import Razorpay from "razorpay";
import crypto from "crypto";
import Users from "../models/users.js";
import Pricing from "../models/pricing.js";
import Site_settings from "../models/site_settings.js";
import Roles from "../models/roles.js";
import Settings from "../models/settings.js";
import Role_permissions from "../models/role_permissions.js";
import Permissions from "../models/permissions.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Transaction from "../models/transaction.js";
import Stripe from "stripe";
import calculateDates from "../utils/calculateDates.js";
import { Console } from "console";
import RoomPayments from "../models/roomPayments.js";
import {
  createNotification,
  notifyAdminOfNewPlanSubscription,
} from "../services/Notifications/notifications.js";
import Rooms from "../models/rooms.js";
import auth0Service from "../services/Auth0/auth0Service.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_SECRET",
});

const getTransactionDetails = async (paymentId) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_KEY,
    });
    const payment = await instance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching transaction details", error);
  }
};

async function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

async function checkOut(req, res) {
  try {
    const room_Id = req.body.roomId;
    if (room_Id) {
      const room = await Rooms.findOne({
        where: { friendly_id: room_Id },
        include: {
          model: Users,
          as: "user",
        },
      });

      if (!room || !room.user) {
        return res
          .status(404)
          .json({ message: "Room or user details not found." });
      }

      const pricing = await Pricing.findOne({
        where: { id: room.user.subscription_id },
      });

      if (!pricing) {
        return res.status(404).json({ message: "Pricing details not found." });
      }

      // Compare participants
      if (Number(room.participants) >= pricing.participants) {
        return res.status(201).json({
          message: "Meeting participant limit exceeded.",
          success: false,
        });
      }
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_KEY,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "Something Went Wrong!" });
      }
      res.status(200).send({ data: order, success: true });
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      userEmail,
      subscriptionDate,
      planGrade,
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // const moreData = await moreDetails(razorpay_order_id);
      const getDetails = await getTransactionDetails(razorpay_payment_id);
      let dataToStore;
      if (getDetails) {
        dataToStore = getDetails;
      }
      const userData = await Users.findOne({ where: { email: userEmail } });

      if (userData) {
        const plan = await Pricing.findOne({ where: { name: planName } });
        if (plan) {
          if (dataToStore?.status === "authorized") {
            if (
              userData?.subscription_expiry_date &&
              subscriptionDate < userData?.subscription_expiry_date &&
              userData?.trial === false &&
              userData?.subscription_pending === false
            ) {
              const subscriptiondate = new Date(
                userData.subscription_expiry_date
              );
              let validationPeriodInDays;
              if (plan?.period === "month") {
                const calculateDateValue = await calculateDates(
                  plan?.Validity,
                  userData?.subscription_expiry_date
                );
                validationPeriodInDays = calculateDateValue.numberOfDays;
              } else {
                validationPeriodInDays = plan?.Validity;
              }
              const expiryDate = new Date(subscriptiondate);
              expiryDate.setDate(
                subscriptiondate.getDate() + validationPeriodInDays
              );
              const formattedExpiryDate = await formatDate(expiryDate);
              const formatedStartDate = await formatDate(subscriptiondate);
              const newTransaction = await Transaction.create({
                user_id: userData?.id,
                plan: planName,
                price: plan?.price,
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
                subscription_start: formatedStartDate,
                subscription_expiry: formattedExpiryDate,
                method: dataToStore?.method,
                currency: dataToStore?.currency,
                status: "pending",
                payment_status: dataToStore?.status,
                plan_grade: planGrade,
              });
              userData.subscription_pending = true;
              userData.expired = false;
              const title = "Subscription Pending Activation";
              const message = `Your subscription to the ${planName} plan is pending activation. It will become active once your current plan expires.`;
              const type = "Plan Subscription";

              await createNotification(message, title, userData?.id, type);
              await notifyAdminOfNewPlanSubscription(userData?.name, planName);
              await userData.save();

              await auth0Service.updateAuth0UserMetadata(
                userData?.external_id,
                {
                  plan: plan?.name || null,
                  subscription_start_date: userData.subscription_start_date,
                  subscription_expiry_date: userData.subscription_expiry_date,
                  trial: userData.trial,
                  expired: userData.expired,
                }
              );
            } else {
              if (userData.subscription_pending === false) {
                // Update the subscription_id of the user with the plan id
                userData.subscription_id = plan.id;
                userData.subscription_start_date = subscriptionDate;
                // Save the changes to the database
                const subscriptiondate = new Date(subscriptionDate);
                let validationPeriodInDays;
                if (plan?.period === "month") {
                  const calculateDateValue = await calculateDates(
                    plan?.Validity
                  );
                  validationPeriodInDays = calculateDateValue.numberOfDays;
                } else {
                  validationPeriodInDays = plan?.Validity;
                }
                const expiryDate = new Date(subscriptiondate);
                expiryDate.setDate(
                  subscriptiondate.getDate() + validationPeriodInDays
                );
                const formattedExpiryDate = await formatDate(expiryDate);
                const formatedStartDate = await formatDate(subscriptiondate);
                userData.subscription_expiry_date = expiryDate
                  .toISOString()
                  .split("T")[0];
                userData.trial = false;

                const activeTransactions = await Transaction.findAll({
                  where: {
                    user_id: userData?.id,
                    status: "active",
                  },
                });

                if (activeTransactions?.length > 0) {
                  // Loop through each record and update its status
                  for (const record of activeTransactions) {
                    record.status = "expired";
                    await record.save();
                  }
                }
                const newTransaction = await Transaction.create({
                  user_id: userData?.id,
                  plan: planName,
                  price: plan?.price,
                  payment_id: razorpay_payment_id,
                  order_id: razorpay_order_id,
                  subscription_start: formatedStartDate,
                  subscription_expiry: formattedExpiryDate,
                  method: dataToStore?.method,
                  currency: dataToStore?.currency,
                  status: "active",
                  payment_status: dataToStore?.status,
                  plan_grade: planGrade,
                });
                userData.subscription_pending = false;
                userData.addon_duration = null;
                userData.addon_storage = null;
                userData.duration_spent = null;
                userData.storage_used = null;
                userData.expired = false;
                const title = "Subscription Activated";
                const message = `Congratulations! You're now subscribed to the ${planName} plan. Welcome aboard, and we hope you have an amazing experience with Atlearn`;
                const type = "Plan Subscription";
                await createNotification(message, title, userData?.id, type);
                await notifyAdminOfNewPlanSubscription(
                  userData?.name,
                  planName
                );
                await userData.save();
                await auth0Service.updateAuth0UserMetadata(
                  userData?.external_id,
                  {
                    plan: plan?.name || null,
                    subscription_start_date: userData.subscription_start_date,
                    subscription_expiry_date: userData.subscription_expiry_date,
                    trial: userData.trial,
                    expired: userData.expired,
                  }
                );
              }
            }
          } else {
            const newTransaction = await Transaction.create({
              user_id: userData?.id,
              plan: planName,
              price: plan?.price,
              payment_id: razorpay_payment_id,
              order_id: razorpay_order_id,
              method: dataToStore?.method,
              currency: dataToStore?.currency,
              payment_status: dataToStore?.status,
              plan_grade: planGrade,
              status: "failed",
            });
            const title = "Subscription Failed";
            const message = `Unfortunately, your subscription to the ${planName} plan could not be processed. Please try again or contact support for assistance.`;
            const type = "Plan Subscription";
            await createNotification(message, title, userData?.id, type);
          }
        } else {
          return res.status(200).json({
            message: `Plan with name ${planName} not found`,
            success: false,
          });
        }
      } else {
        return res.status(200).json({
          message: `User with email ${userEmail} not found`,
          success: false,
        });
      }
      return res.status(200).json({
        message: "Payment verified successfully",
        success: true,
      });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(200).json(error);
    // console.log(error);
  }
}

async function failedTransation(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      planName,
      userEmail,
      planGrade,
      totalPrice,
    } = req.body;
    // const moreData = await moreDetails(razorpay_order_id);
    const getDetails = await getTransactionDetails(razorpay_payment_id);
    let dataToStore;
    if (getDetails) {
      dataToStore = getDetails;
    }
    const userData = await Users.findOne({ where: { email: userEmail } });
    if (userData) {
      const plan = await Pricing.findOne({ where: { name: planName } });
      if (plan) {
        const newTransaction = await Transaction.create({
          user_id: userData?.id,
          plan: planName,
          price: plan?.price,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          method: dataToStore?.method,
          currency: dataToStore?.currency,
          payment_status: dataToStore?.status,
          plan_grade: planGrade,
          status: "failed",
        });
        return res.status(200).json({
          message: "Payment failed",
          success: false,
        });
      } else {
        const newTransaction = await Transaction.create({
          user_id: userData?.id,
          plan: planName,
          price: totalPrice,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          method: dataToStore?.method,
          currency: dataToStore?.currency,
          payment_status: dataToStore?.status,
          status: "failed",
        });
        return res.status(200).json({
          message: "Payment failed",
          success: false,
        });
      }
    } else {
      return res.status(200).json({
        message: `User with email ${userEmail} not found`,
        success: false,
      });
    }
  } catch (error) {
    res.status(200).json(error);
  }
}

async function getSession(id, password) {
  const userId = id;
  const permission = {};
  if (userId) {
    const user = await Users.findOne({
      where: { id: userId },
      // include: [{ model: Roles, as: "role" }],
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });
    if (user) {
      if (user.status === true) {
        return { message: "User blocked", success: false };
      }
      const roleId = user?.role?.id;

      const rolePermissionValues = await Role_permissions.findAll({
        where: {
          role_id: roleId,
        },
        include: [
          {
            model: Permissions,
          },
        ],
      });

      rolePermissionValues?.forEach((item) => {
        permission[item?.permission?.name] = item.value;
      });
    } else {
      return { message: "User Not Found", success: false };
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return {
        message: "Invalid password",
        success: false,
      };
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.name,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    delete user.dataValues?.password;
    return {
      data: { user, permission },
      token: token,
      success: true,
    };
  } else {
    return { message: "User Not Found", success: false };
  }
}

const createAccount = async (req, res) => {
  try {
    let userData = req.body;
    const pass = req.body.password;
    const userdata = await Users.findOne({ where: { email: userData.email } });
    if (userdata) {
      res.send({ message: "Email Already Registered", success: false });
    } else {
      const hashedPassword = await bcrypt.hash(userData?.password, 10);
      userData.password = hashedPassword;

      if (!userData.provider) {
        userData.provider = "atlearn";
      }
      if (!userData.language) {
        userData.language = "english";
      }
      if (!userData.verified) {
        userData.verified = true;
      }
      if (!userData.role_id) {
        const name = "DefaultRole";
        const siteSettingsValues = await Site_settings.findOne({
          include: [
            {
              model: Settings,
              where: {
                name: name,
              },
            },
          ],
        });

        if (siteSettingsValues) {
          const role = siteSettingsValues.value;
          const roleId = await Roles.findOne({ where: { name: role } });
          if (roleId) {
            userData.role_id = roleId.id;
          } else {
            res.status(201).json({ message: "Not found Role" });
          }
        }
      }
      if (!userData.subscription_id) {
        const plan = await Pricing.findOne({ where: { name: "Free" } });
        if (plan) {
          userData.subscription_id = plan.id;
          userData.subscription_start_date = new Date()
            .toISOString()
            .split("T")[0];
        }
      }
      const user = await Users.create(userData);
      if (user) {
        const data = await getSession(user.id, pass);
        if (data) {
          res.status(201).json({
            data: data,
            success: true,
          });
        }
      }
      // res.status(201).json({
      //   data: user,
      //   success: true,
      // });
      // await sendEmail(user, "verifyemail");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const checkoutSession = async (req, res) => {
  try {
    const { plan, total } = req.body;
    // console.log(plan);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan,
              // description: "Unlimited Viedo Edits!",
            },
            unit_amount: Number(total * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { plan, sessionId, user_Id } = req.body;
    const newTransaction = await Transaction.create({
      payment_id: sessionId,
      order_id: sessionId,
      plan: plan,
      user_id: user_Id,
    });
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { user_Id, sessionId } = req.body;
    const subscriptionDate = new Date().toISOString().split("T")[0];
    const get_transaction = await Transaction.findOne({
      where: { order_id: sessionId },
    });
    if (get_transaction) {
      const userData = await Users.findOne({ where: { id: user_Id } });
      const plan = await Pricing.findOne({
        where: { name: get_transaction.plan },
      });
      if (userData) {
        if (plan) {
          userData.subscription_id = plan.id;
          userData.subscription_start_date = subscriptionDate;
          const subscriptiondate = new Date(subscriptionDate);
          const validationPeriodInDays = plan?.Validity;
          const expiryDate = new Date(subscriptiondate);
          expiryDate.setDate(
            subscriptiondate.getDate() + validationPeriodInDays
          );
          const formattedExpiryDate = await formatDate(expiryDate);
          const formatedStartDate = await formatDate(subscriptiondate);
          userData.subscription_expiry_date = expiryDate
            .toISOString()
            .split("T")[0];
          userData.trial = false;
          await userData.save();
          get_transaction.price = plan?.price;
          get_transaction.subscription_start = formatedStartDate;
          get_transaction.subscription_expiry = formattedExpiryDate;
          await get_transaction.save();

          return res.status(200).json({
            message: "Payment  successfully",
            success: true,
          });
        }
      } else {
        return res.status(200).json({
          message: "user not found",
          success: false,
        });
      }
    } else {
      res.status(500).json({ message: "session not matched" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const cancelTransaction = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const getTransaction = await Transaction.findOne({
      where: { order_id: sessionId },
    });

    // If the transaction exists, delete it
    if (getTransaction) {
      await getTransaction.destroy();
      res
        .status(200)
        .json({ success: true, message: "Transaction deleted successfully." });
    } else {
      res
        .status(200)
        .json({ success: false, message: "Transaction not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const moreDetails = async (order_id) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_KEY,
    });

    const orderId = order_id;

    const payments = await instance.orders.fetchPayments(orderId);
    if (payments.items) {
      return payments;
    } else {
      return { message: "faild" };
    }
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTransationDetails = async (req, res) => {
  try {
    const order_id = req?.body?.order_id;
    if (order_id) {
      const details = await moreDetails(order_id);
      if (details) {
        return res.status(200).json({
          message: "Payment  successfully",
          success: true,
          data: details,
        });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const addonpaymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      userEmail,
      totalPrice,
      durationPlan,
      storagePlan,
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // const moreData = await moreDetails(razorpay_order_id);
      const getDetails = await getTransactionDetails(razorpay_payment_id);

      let dataToStore;
      if (getDetails) {
        dataToStore = getDetails;
      }
      const userData = await Users.findOne({ where: { email: userEmail } });
      if (userData) {
        if (durationPlan > 0) {
          if (userData.addon_duration) {
            userData.addon_duration += durationPlan;
          } else {
            userData.addon_duration = durationPlan;
          }
        }
        if (storagePlan > 0) {
          if (userData.addon_storage) {
            userData.addon_storage += storagePlan;
          } else {
            userData.addon_storage = storagePlan;
          }
        }
        const subscriptionStartdate = new Date(
          userData.subscription_start_date
        );
        const subscriptionEnddate = new Date(userData.subscription_expiry_date);
        const formattedExpiryDate = await formatDate(subscriptionEnddate);
        const formatedStartDate = await formatDate(subscriptionStartdate);
        const newTransaction = await Transaction.create({
          user_id: userData?.id,
          plan: planName,
          price: totalPrice,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          subscription_start: formatedStartDate,
          subscription_expiry: formattedExpiryDate,
          method: dataToStore?.method,
          currency: dataToStore?.currency,
          status: "active",
          payment_status: dataToStore?.status,

          // plan_grade: planGrade,
        });
        await userData.save();
        return res.status(200).json({
          message: "Payment verified successfully",
          success: true,
        });
      } else {
        return res.status(200).json({
          message: `User with email ${userEmail} not found`,
          success: false,
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const scheduleMeetingPaymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      userEmail,
      totalPrice,
      scheduleId,
      roomId,
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // const moreData = await moreDetails(razorpay_order_id);
      // let dataToStore;
      // if (moreData.items) {
      //   dataToStore = moreData.items[0];
      // }
      const getDetails = await getTransactionDetails(razorpay_payment_id);
      let dataToStore;
      if (getDetails) {
        dataToStore = getDetails;
      }

      const userData = await Users.findOne({ where: { email: userEmail } });
      if (userData) {
        // const { roomId, userId, schedule_id,amount, status } = req.body;

        // Create a new payment record
        const newPayment = await RoomPayments.create({
          room_id: roomId,
          user_id: userData?.id,
          schedule_id: scheduleId,
          amount_paid: totalPrice,
          payment_status: "paid",
        });

        const newTransaction = await Transaction.create({
          user_id: userData?.id,
          plan: planName,
          price: totalPrice,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          method: dataToStore?.method,
          currency: dataToStore?.currency,
          payment_status: dataToStore?.status,
        });
        return res.status(200).json({
          message: "Payment verified successfully",
          success: true,
        });
      } else {
        return res.status(200).json({
          message: `User with email ${userEmail} not found`,
          success: false,
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default {
  checkOut,
  verifyPayment,
  createAccount,
  checkoutSession,
  addTransaction,
  paymentSuccess,
  cancelTransaction,
  getTransationDetails,
  failedTransation,
  addonpaymentVerification,
  scheduleMeetingPaymentVerification,
};
