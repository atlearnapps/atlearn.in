import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Roles from "../models/roles.js";
import Users from "../models/users.js";
import { Op } from "sequelize";
import Permissions from "../models/permissions.js";
import Role_permissions from "../models/role_permissions.js";
import Site_settings from "../models/site_settings.js";
import Settings from "../models/settings.js";
import Rooms from "../models/rooms.js";
import Room_meeting_options from "../models/room_meeting_options.js";
import sendEmail from "../SendEmail/SendEmail.js";
import Token from "../models/token.js";
import fs from "fs";
import Pricing from "../models/pricing.js";
import Transaction from "../models/transaction.js";
import ContactEmail from "../SendEmail/ContactEmail.js";
import Invite from "../SendEmail/Invite.js";
import Schedule_room_meeting from "../models/schedule_room_meeting.js";
import calculateDates from "../utils/calculateDates.js";
import Shared_accesses from "../models/shared_accesses.js";
import Meeting_options from "../models/meeting_options.js";
import RoomPayments from "../models/roomPayments.js";
import {
  notifyAdminsofExpiredPlanUsers,
  notifyAdminsOfNewUser,
} from "../services/Notifications/notifications.js";
import Bank_details from "../models/bank_details.js";
import axios from "axios";
import InstructorApplicationEmail from "../SendEmail/InstructorApplicationEmail.js";
import welcomeMailForTutor from "../SendEmail/welcomeMailForTutor.js";
import WelocomeMailForCourseCreators from "../SendEmail/WelocomeMailForCourseCreators.js";
import CourseCreatorApplicationMail from "../SendEmail/CourseCreatorApplicationMail.js";
import LMSNewInquiry from "../SendEmail/LMSNewInquiry.js";
import sendDemoCredentialsEmail from "../SendEmail/sendDemoCredentialsEmail.js";
import AcknowledgmentMail from "../SendEmail/AcknowledgmentMail.js";
import auth0Service from "../services/Auth0/auth0Service.js";
// New Users
async function createNewUser(req, res) {
  try {
    let userData = req.body;
    // Call Auth0 API to create the user
    let auth0Response;
    try {
      auth0Response = await axios.post(
        `${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: `${process.env.AUTH0_CLIENT_ID}`,
          email: userData.email,
          password: userData.password,
          connection: "Username-Password-Authentication",
          username: userData.name,
          name: userData.name,
          nickname: userData.name,
        }
      );
    } catch (error) {
      return res.status(200).json({
        message: "Email Already Registered",
        success: false,
      });
    }

    const userdata = await Users.findOne({ where: { email: userData.email } });

    const registration = "RegistrationMethod";
    const siteSettingsValues = await Site_settings.findOne({
      include: [
        {
          model: Settings,
          where: {
            name: registration,
          },
        },
      ],
    });

    if (userdata) {
      res.send({ message: "Email Already Registered", success: false });
    } else {
      const hashedPassword = await bcrypt.hash(userData?.password, 10);
      userData.password = hashedPassword;

      if (siteSettingsValues.value !== "approval") {
        userData.approve = true;
      }

      if (!userData.provider) {
        userData.provider = "atlearn";
      }
      if (!userData.language) {
        userData.language = "English";
      }

      if (userData?.role) {
        const role = userData?.role;
        const roleId = await Roles.findOne({ where: { name: role } });
        if (roleId) {
          userData.role_id = roleId.id;
        } else {
          res.status(201).json({ message: "Not found Role" });
        }
      }

      if (!userData.subscription_id) {
        if (userData?.role !== "Guest") {
          const plan = await Pricing.findOne({ where: { name: "Enterprise" } });

          if (plan) {
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 3);

            userData.subscription_id = plan.id;
            userData.subscription_start_date = startDate
              .toISOString()
              .split("T")[0];
            userData.subscription_expiry_date = endDate
              .toISOString()
              .split("T")[0];

            userData.trial = true;
          }
        }
      } else {
        const planDate = await Pricing.findOne({
          where: { id: userData.subscription_id },
        });
        if (planDate) {
          const startDate = new Date();
          const endDate = new Date(startDate);
          let validationPeriodInDays;
          if (planDate?.period === "month") {
            const calculateDateValue = await calculateDates(planDate?.Validity);
            validationPeriodInDays = calculateDateValue.numberOfDays;
          } else {
            validationPeriodInDays = planDate?.Validity;
          }
          endDate.setDate(startDate.getDate() + validationPeriodInDays);

          // userData.subscription_id = plan.id;
          userData.subscription_start_date = startDate
            .toISOString()
            .split("T")[0];
          userData.subscription_expiry_date = endDate
            .toISOString()
            .split("T")[0];

          if (planDate.name === "Free") {
            userData.trial = true;
          } else {
            userData.trial = false;
          }
        }
      }

      const user = await Users.create(userData);
      if (userData?.token) {
        await Token.destroy({ where: { token: userData.token } });
      }
      if (!userData.verified) {
        await sendEmail(user, "verifyemail", userData?.roomid);
        res.status(201).json({
          message: "Please Verify Your Email to Activate Your Account",
          success: true,
        });
      } else {
        res.status(201).json({
          message: "Successfully Created",
          success: true,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllNewUsers(req, res) {
  // try {
  //   const users = await Users.findAll({
  //     include: [{ model: Roles, as: "role" }],
  //   });
  //   res.json({ data: users });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  try {
    const users = await Users.findAll({
      where: {
        status: {
          [Op.not]: true,
        },
        approve: {
          [Op.not]: false,
        },
      },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });
    const filtered = users?.map((val) => {
      delete val?.dataValues?.password;
      return val;
    });
    res.json({ data: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchNewUser(req, res) {
  let userData = { ...req.body };
  const id = req?.params?.id;
  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      name,
      email,
      password,
      role_id,
      status,
      language,
      approve,
      planId,
      subscriptionDate,
    } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (name) {
      user.name = name;
      auth0Service.updateprofile(user?.external_id, { name: name });
    }
    if (email) {
      user.email = email;
    }
    if (role_id) {
      user.role_id = role_id;
    }
    if (status === false) {
      user.status = status;
    } else if (status) {
      user.status = status;
    }
    if (language) {
      user.language = language;
    }
    if (approve) {
      user.approve = approve;
    }

    if (planId) {
      const planDate = await Pricing.findOne({ where: { id: planId } });
      // if (planDate.id !== user?.subscription_id || user?.trial === true) {
      if (
        planDate.id !== user?.subscription_id ||
        user?.trial === true ||
        (planDate.id === user?.subscription_id && user?.expired)
      ) {
        const activeTransactions = await Transaction.findAll({
          where: {
            user_id: user?.id,
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

        if (planDate?.recording === "false") {
          const meetingOptions = await Meeting_options.findOne({
            where: {
              name: "record",
            },
          });

          const rooms = await Rooms.findAll({
            where: {
              user_id: user?.id,
            },
          });

          for (const room of rooms) {
            const roomSettings = await Room_meeting_options.findOne({
              where: {
                room_id: room.id,
                meeting_option_id: meetingOptions.id,
              },
            });

            if (roomSettings && roomSettings.value === "true") {
              // Update the value to false
              roomSettings.value = "false";
              await roomSettings.save();
            }
          }
        }

        const startDate = new Date(subscriptionDate);
        const endDate = new Date(startDate);
        let validationPeriodInDays;
        if (planDate?.period === "month") {
          const calculateDateValue = await calculateDates(planDate?.Validity);
          validationPeriodInDays = calculateDateValue.numberOfDays;
        } else {
          validationPeriodInDays = planDate?.Validity;
        }
        endDate.setDate(startDate.getDate() + validationPeriodInDays);

        user.subscription_id = planDate.id;
        user.subscription_start_date = startDate.toISOString().split("T")[0];
        user.subscription_expiry_date = endDate.toISOString().split("T")[0];
        user.expired = false;
        if (planDate.name === "Free") {
          user.trial = true;
        } else {
          user.trial = false;
        }
      }
    }

    await user.save();
    delete user.dataValues?.password;
    res.json({
      data: user,
      message: " The user has been updated",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function changePwdByUserId(req, res) {
  const id = req?.params?.id;
  try {
    const { old_password, new_password, confirm_password } = req.body;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }
    if (user.provider !== "google") {
      const validPassword = await bcrypt.compare(old_password, user.password);
      if (!validPassword) {
        return res.json({
          message: "Current password does not match.",
          success: false,
        });
      }
    } else {
      if (user.provider !== "atlearn") {
        user.provider = "atlearn";
      }
    }

    if (new_password === confirm_password) {
      const hashedPassword = await bcrypt.hash(confirm_password, 10);
      user.password = hashedPassword;
      await user.save();
      return res.json({
        message: " The user password has been updated",
        success: true,
      });
    } else {
      return res
        .status(401)
        .json({ error: "confirm password not match with new password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteNewUser(req, res) {
  const id = req?.params?.id;
  try {
    const rooms = await Rooms.findAll({ where: { user_id: id } }); // Find all rooms associated with the user

    if (rooms.length > 0) {
      for (const room of rooms) {
        // Delete meeting options for each room
        await Room_meeting_options.destroy({ where: { room_id: room.id } });

        // Delete schedule meeting for each room
        await Schedule_room_meeting.destroy({ where: { room_id: room.id } });

        await Shared_accesses.destroy({ where: { room_id: room.id } });
        // await Shared_accesses.destroy({where: {user_id: id}})
        // await Shared_accesses.destroy({
        //   where: {
        //     [Op.or]: [
        //       { room_id: room.id },
        //       { user_id: id }
        //     ]
        //   }
        // });
        // Delete the room
        await Rooms.destroy({ where: { id: room.id } });

        // Here you can include additional logic to handle history rooms if needed
      }
    }
    await Shared_accesses.destroy({ where: { user_id: id } });

    const roomdelete = await Rooms.destroy({ where: { user_id: id } });
    const user = await Users.findOne({ where: { id: id } });

    const deletedRowCount = await Users.destroy({ where: { id: id } });
    if (deletedRowCount === 0) {
      res.json({ message: "User not found", success: false });
    } else {
      auth0Service.deleteAccount(user?.external_id);
      res.send({ message: "User Deleted", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// New Login
async function newLogin(req, res) {
  try {
    const { email, password } = req.body;
    const permission = {};
    const user = await Users.findOne({
      where: { email },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });

    if (user) {
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
    }

    const registration = "RegistrationMethod";
    const siteSettingsValues = await Site_settings.findOne({
      include: [
        {
          model: Settings,
          where: {
            name: registration,
          },
        },
      ],
    });

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    } else if (!user.verified) {
      return res.json({
        message: "Please Verify Your Email to Activate Your Account",
        success: false,
      });
    } else if (user.status === true) {
      return res.json({
        message: "Your account has been blocked",
        success: false,
      });
    } else if (siteSettingsValues.value === "approval") {
      if (!user.approve) {
        return res.json({
          message:
            "Your registration is pending approval from the administrator. Please try again later.",
          success: false,
        });
      }
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({
        message: "Invalid password",
        success: false,
      });
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
    user.dataValues.subscription_plan = user.dataValues?.subscription?.name;
    delete user.dataValues?.password;
    delete user.dataValues?.subscription_id;
    delete user.dataValues?.subscription;
    return res.json({
      message: "Login success",
      data: user,
      token: token,
    });

    // res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
}

async function bannedUsers(req, res) {
  try {
    const bannedUsers = await Users.findAll({
      where: { status: true },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });
    res.json({ data: bannedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function pendingUser(req, res) {
  try {
    const pendingUser = await Users.findAll({
      where: { approve: false },
    });
    res.json({ data: pendingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// roles

async function createRole(req, res, next) {
  try {
    let roleData = req.body;
    if (!roleData.color) {
      roleData.color = await generateUniqueColor();
    }

    if (!roleData.provider) {
      roleData.provider = "atlearn";
    }
    const role = await Roles.create(roleData);
    const create_room = await Permissions.findOne({
      where: { name: "CreateRoom" },
    });
    const manage_users = await Permissions.findOne({
      where: { name: "ManageUsers" },
    });
    const manage_rooms = await Permissions.findOne({
      where: { name: "ManageRooms" },
    });
    const manage_recordings = await Permissions.findOne({
      where: { name: "ManageRecordings" },
    });
    const manage_site_settings = await Permissions.findOne({
      where: { name: "ManageSiteSettings" },
    });
    const manage_roles = await Permissions.findOne({
      where: { name: "ManageRoles" },
    });
    const shared_list = await Permissions.findOne({
      where: { name: "SharedList" },
    });
    const can_record = await Permissions.findOne({
      where: { name: "CanRecord" },
    });
    const room_limit = await Permissions.findOne({
      where: { name: "RoomLimit" },
    });
    const rolePermissionValues = [
      { role_id: role?.id, permission_id: create_room?.id, value: "true" },
      { role_id: role?.id, permission_id: manage_users?.id, value: "false" },
      { role_id: role?.id, permission_id: manage_rooms?.id, value: "false" },
      {
        role_id: role?.id,
        permission_id: manage_recordings?.id,
        value: "false",
      },
      {
        role_id: role?.id,
        permission_id: manage_site_settings?.id,
        value: "false",
      },
      { role_id: role?.id, permission_id: manage_roles?.id, value: "false" },
      { role_id: role?.id, permission_id: shared_list?.id, value: "true" },
      { role_id: role?.id, permission_id: can_record?.id, value: "true" },
      { role_id: role?.id, permission_id: room_limit?.id, value: "10" },
    ];
    await Role_permissions.bulkCreate(rolePermissionValues);
    res.status(201).json({ message: "successfully created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function to generate a unique color
// async function generateUniqueColor() {
//   const colors = ["#FF5733", "#5E2AEB", "#2ABAAE", "#EBDE2A", "#EB2A61"];
//   let uniqueColor = null;

//   do {
//     uniqueColor = colors[Math.floor(Math.random() * colors.length)];
//     const existingRole = await Roles.findOne({ where: { color: uniqueColor } });
//   } while (existingRole);

//   return uniqueColor;
// }

async function generateUniqueColor() {
  const colors = ["#FF5733", "#5E2AEB", "#2ABAAE", "#EBDE2A", "#EB2A61"];
  let uniqueColor = null;
  let existingRole = null;

  do {
    uniqueColor = colors[Math.floor(Math.random() * colors.length)];
    existingRole = await Roles.findOne({ where: { color: uniqueColor } });
  } while (existingRole);

  return uniqueColor;
}

async function getRoles(req, res) {
  try {
    const roles = await Roles.findAll();
    if (roles) {
      res.send({ data: roles });
    } else {
      res.send({ message: "not have roles" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getRoleById(req, res) {
  const id = req.params.id;
  try {
    const role = await Roles.findByPk(id);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
    } else {
      res.status(200).json(role);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRole(req, res) {
  const id = req.params.id;
  try {
    const role = await Roles.findOne({ where: { id: id } });
    role.name = req.body.name;
    await role.save();
    res.status(200).send({ message: "updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// async function deleteRole(req, res) {
//   const id = req.params.id;
//   try {
//     const deleteRolePermission = await Role_permissions.destroy({
//       where: { role_id: id },
//     });
//     const deletedRowCount = await Roles.destroy({ where: { id: id } });
//     if (deletedRowCount === 0) {
//       res.status(404).json({ message: "Role not found", success: false });
//     } else {
//       res.send({ message: " Role deleted", success: true });
//     }
//   } catch (error) {
//     res.send({
//       message: "The action can't be completed. Please try again.",
//       success: false,
//     });
//   }
// }

async function deleteRole(req, res) {
  const id = req.params.id;

  try {
    // Get default role from settings
    const defaultSetting = await Site_settings.findOne({
      include: [
        {
          model: Settings,
          where: {
            name: {
              [Op.in]: ["DefaultRole"],
            },
          },
        },
      ],
    });

    // const defaultRoleId = defaultSetting?.value;
    const defaultRoleId = await Roles.findOne({
      where: { name: defaultSetting?.value },
    });

    if (!defaultRoleId) {
      return res.status(500).json({
        message: "Default role not found in settings.",
        success: false,
      });
    }

    if (defaultRoleId === id) {
      return res.status(400).json({
        message: "Cannot delete the default role.",
        success: false,
      });
    }

    // Update users with the role being deleted to the default role
    await Users.update(
      { role_id: defaultRoleId?.id },
      { where: { role_id: id } }
    );
    // Delete role permissions
    await Role_permissions.destroy({ where: { role_id: id } });

    // Delete the role
    const deletedRowCount = await Roles.destroy({ where: { id: id } });

    if (deletedRowCount === 0) {
      return res
        .status(404)
        .json({ message: "Role not found", success: false });
    }

    return res.send({
      message: "Role deleted and users updated",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({
      message: "The action can't be completed. Please try again.",
      success: false,
    });
  }
}

async function verifyEmail(req, res) {
  const token = req.params.id;
  try {
    const verify = await Token.findOne({ where: { token: token } });
    if (verify) {
      const id = verify.user_id;
      const user = await Users.findByPk(id);
      if (user) {
        user.verified = true;
        await user.save();
        await notifyAdminsOfNewUser(user);
        await Token.destroy({ where: { id: verify.id } });

        res.send({ success: true, message: "success" });
      }
    } else {
      res.send({ message: "Invalid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function uploadProfile(req, res) {
  if (!req.file) {
    res.send({ message: "No file uploaded" });
  }
  const id = req.params.id;
  const user = await Users.findByPk(id);
  if (user) {
    const avatarPath = user.avatarPath;

    if (avatarPath) {
      fs.unlink(avatarPath, async (err) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Error deleting avatar file", error: err });
        } else {
          const filename = req.file.filename;
          const filepath = req.file.path;
          user.avatar = filename;
          user.avatarPath = filepath;

          await user.save();
        }
      });
    } else {
      const filename = req.file.filename;
      const filepath = req.file.path;
      user.avatar = filename;
      user.avatarPath = filepath;

      await user.save();
    }
  }
  res.send(user);
}

async function deleteProfile(req, res) {
  const id = req.params.id;
  try {
    const user = await Users.findOne({ where: { id } });
    if (user) {
      // Get the avatar path
      const avatarPath = user.avatarPath;

      // Check if the avatarPath exists
      if (avatarPath) {
        fs.unlink(avatarPath, (err) => {
          if (err) {
            console.error("Error deleting avatar file:", err);
            res
              .status(500)
              .json({ message: "Error deleting avatar file", error: err });
          } else {
            // Clear the avatar path in the user record
            user.avatar = null;
            user.avatarPath = null;
            user
              .save()
              .then(() => {
                res.json({
                  message: "Avatar deleted successfully",
                  success: true,
                });
              })
              .catch((error) => {
                res
                  .status(500)
                  .json({ message: "Error updating user record", error });
              });
          }
        });
      } else {
        res.status(404).json({ message: "Avatar not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting avatar", error });
  }
}

async function forgetPassword(req, res) {
  try {
    const email = req.body.email;
    const user = await Users.findOne({ where: { email: email } });
    if (user) {
      await sendEmail(user, "forgetpassword");
      res.send({
        message: `A password reset email has been sent to ${email}.`,
        success: true,
      });
    } else {
      res.send({ message: "Emai not mactching", success: false });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
async function resetPassword(req, res) {
  try {
    const token = req.params.id;
    const { password, confirmPassword } = req.body;
    const verify = await Token.findOne({ where: { token: token } });
    if (verify) {
      const id = verify.user_id;
      const user = await Users.findByPk(id);
      if (user) {
        if (password === confirmPassword) {
          const hashedPassword = await bcrypt.hash(confirmPassword, 10);
          user.password = hashedPassword;
          await user.save();
          await Token.destroy({ where: { id: verify.id } });
          return res.json({
            message: " The user password has been updated",
            success: true,
          });
        } else {
          return res
            .status(401)
            .json({ error: "confirm password not match with new password" });
        }
      }
    } else {
      res.send({ message: "Invalid Token" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
async function get_transactions(req, res) {
  try {
    const userId = req.user.user_id;
    const allTransactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
    if (allTransactions) {
      res.send({ message: "success", data: allTransactions });
    } else {
      res.send({ message: "No Transaction", data: [] });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
const contact = async (req, res) => {
  try {
    const { email, firstname, message, subject, phone, type, provider } =
      req.body;
    const name = `${firstname}`;
    const names = ["Terms", "PrivacyPolicy"];
    let termsURL;
    let privacyURL;
    const siteSettingsValues = await Site_settings.findAll({
      include: [
        {
          model: Settings,
          where: {
            name: {
              [Op.in]: names,
            },
          },
        },
      ],
    });
    for (const item of siteSettingsValues) {
      switch (item.setting.name) {
        case "Terms":
          termsURL = item.value;
          break;
        case "PrivacyPolicy":
          privacyURL = item.value;
          break;
        default:
          break;
      }
    }
    // if (type === "Application of an instructor") {
    //   await InstructorApplicationEmail(
    //     email,
    //     message,
    //     name,
    //     subject,
    //     phone,
    //     termsURL,
    //     privacyURL,
    //     type
    //   );
    //   await welcomeMailForTutor(
    //     email,
    //     name
    //   )
    // } else {
    //   await ContactEmail(
    //     email,
    //     message,
    //     name,
    //     subject,
    //     phone,
    //     termsURL,
    //     privacyURL,
    //     type
    //   );
    // }

    const commonArgs = [
      email,
      message,
      name,
      subject,
      phone,
      termsURL,
      privacyURL,
      type,
      provider,
    ];

    if (type === "Application of an instructor") {
      await Promise.all([
        InstructorApplicationEmail(...commonArgs),
        welcomeMailForTutor(email, name),
      ]);
    } else if (type === "course_creator") {
      await Promise.all([
        CourseCreatorApplicationMail(...commonArgs),
        WelocomeMailForCourseCreators(email, name),
      ]);
    } else if (type === "LMS New Inquiry") {
      await LMSNewInquiry(...commonArgs);
    } else if (type === "Request Meeting Demo" || type === "Request LMS Demo") {
      await sendDemoCredentialsEmail(email, name, type);
    } else {
      await ContactEmail(...commonArgs);
      await AcknowledgmentMail(email, name);
    }

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const inviteUser = async (req, res) => {
  try {
    const email = req.body.email;
    await Invite(email);
    res
      .status(201)
      .json({ success: true, message: "Invitation has been sent" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyInviteUser = async (req, res) => {
  try {
    const token = req.params.id;
    const verify = await Token.findOne({ where: { token: token } });
    if (!verify) {
      return res.status(201).json({ message: "Token is missing" });
    }

    jwt.verify(verify.token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(201).json({ message: "Token verification failed" });
      }
      res.status(201).json({ message: "Token is valid", success: true });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function formatDate(date) {
  let [day, month, year] = date.split("-");
  let newStartDate = `${year}-${month}-${day}`;

  return newStartDate;
}

const changePlan = async (req, res) => {
  try {
    const userId = req?.user?.user_id;
    const plan = req.body.plan;
    const userData = await Users.findOne({
      where: { id: userId },
    });
    if (userData && plan === "free") {
      const plan = await Pricing.findOne({ where: { name: "Free" } });
      if (plan) {
        if (plan?.recording === "false") {
          const meetingOptions = await Meeting_options.findOne({
            where: {
              name: "record",
            },
          });

          const rooms = await Rooms.findAll({
            where: {
              user_id: userId,
            },
          });

          for (const room of rooms) {
            const roomSettings = await Room_meeting_options.findOne({
              where: {
                room_id: room.id,
                meeting_option_id: meetingOptions.id,
              },
            });

            if (roomSettings && roomSettings.value === "true") {
              // Update the value to false
              roomSettings.value = "false";
              await roomSettings.save();
            }
          }
        }

        const startDate = new Date();
        let validationPeriodInDays;
        if (plan?.period === "month") {
          const calculateDateValue = await calculateDates(plan?.Validity);
          validationPeriodInDays = calculateDateValue.numberOfDays;
        } else {
          validationPeriodInDays = plan?.Validity;
        }
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + validationPeriodInDays);

        userData.subscription_id = plan.id;
        userData.subscription_start_date = startDate
          .toISOString()
          .split("T")[0];
        userData.subscription_expiry_date = endDate.toISOString().split("T")[0];
        userData.addon_duration = null;
        userData.addon_storage = null;
        userData.duration_spent = null;
        userData.storage_used = null;
        await userData.save();
        await auth0Service.updateAuth0UserMetadata(userData?.external_id, {
          plan: plan?.name || null,
          subscription_start_date: userData.subscription_start_date,
          subscription_expiry_date: userData.subscription_expiry_date,
          trial: userData.trial,
          expired: userData.expired,
        });
        res.status(201).json({ success: true });
      }
    } else if (userData && plan === "next") {
      const pendingTransactions = await Transaction.findOne({
        where: {
          user_id: userId,
          status: "pending",
        },
      });
      const activeTransactions = await Transaction.findAll({
        where: {
          user_id: userId,
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
      if (pendingTransactions) {
        const plan = await Pricing.findOne({
          where: { name: pendingTransactions.plan },
        });
        if (plan) {
          if (plan?.recording === "false") {
            const meetingOptions = await Meeting_options.findOne({
              where: {
                name: "record",
              },
            });

            const rooms = await Rooms.findAll({
              where: {
                user_id: userId,
              },
            });

            for (const room of rooms) {
              const roomSettings = await Room_meeting_options.findOne({
                where: {
                  room_id: room.id,
                  meeting_option_id: meetingOptions.id,
                },
              });

              if (roomSettings && roomSettings.value === "true") {
                // Update the value to false
                roomSettings.value = "false";
                await roomSettings.save();
              }
            }
          }
          const startDate = await formatDate(
            pendingTransactions?.subscription_start
          );

          const endDate = await formatDate(
            pendingTransactions?.subscription_expiry
          );
          userData.subscription_id = plan.id;
          userData.subscription_start_date = startDate;
          userData.subscription_expiry_date = endDate;
          userData.expired = false;
          userData.subscription_pending = false;
          userData.addon_duration = null;
          userData.addon_storage = null;
          userData.duration_spent = null;
          userData.storage_used = null;
          await userData.save();
          await auth0Service.updateAuth0UserMetadata(userData?.external_id, {
            plan: plan?.name || null,
            subscription_start_date: userData.subscription_start_date,
            subscription_expiry_date: userData.subscription_expiry_date,
            trial: userData.trial,
            expired: userData.expired,
          });
          pendingTransactions.status = "active";
          await pendingTransactions.save();
          res.status(201).json({ success: true });
        }
      }
    } else {
      res.status(201).json({ message: "user not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const expiredPlan = async (req, res) => {
  try {
    const userId = req?.user?.user_id;
    const userData = await Users.findOne({
      where: { id: userId },
      include: [{ model: Pricing, as: "subscription" }],
    });
    userData.expired = true;
    await userData.save();
    const activeTransactions = await Transaction.findAll({
      where: {
        user_id: userId,
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
    await notifyAdminsofExpiredPlanUsers(
      userData?.name,
      userData?.subscription?.name
    );
    const userRooms = await Rooms.findAll({
      where: { user_id: userId },
      attributes: ["id"],
    });

    if (!userRooms.length) {
      return res
        .status(201)
        .json({ message: "Rooms not found", success: false });
    }

    const meetingOptions = await Meeting_options.findAll({
      where: {
        name: [
          "record",
          "glModeratorAccessCode",
          "glAnyoneJoinAsModerator",
          "glAnyoneCanStart",
        ],
      },
      attributes: ["id"],
    });

    const meetingOptionIds = meetingOptions.map((option) => option.id);
    const roomIds = userRooms.map((room) => room.id);

    const roomSettings = await Room_meeting_options.findAll({
      where: {
        room_id: roomIds,
        meeting_option_id: meetingOptionIds,
        // value: "true", // Only fetch where value is true
      },
    });

    if (!roomSettings.length) {
      return res
        .status(201)
        .json({ message: "roomSettings not found", success: false });
    }

    await Room_meeting_options.update(
      { value: "false" },
      {
        where: {
          id: roomSettings.map((setting) => setting.id), // Update by setting IDs
        },
      }
    );
    res.status(201).json({ message: " Room seetings updated", success: true });
  } catch (error) {
    res
      .status(201)
      .json({ message: " Error updating room settings", success: true });
    console.error("Error updating room settings:", error);
    // Handle errors (log, return error response, etc.)
  }
};
async function createPayment(req, res) {
  try {
    // Destructure the request body
    const { roomId, userId, schedule_id, amount, status } = req.body;

    // Create a new payment record
    const newPayment = await RoomPayments.create({
      room_id: roomId,
      user_id: userId,
      schedule_id: schedule_id,
      amount_paid: amount,
      payment_status: status,
    });

    console.log("Payment record created:", newPayment);

    // Send success response
    return res.status(201).json({
      message: "Payment record created successfully",
      data: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment record:", error);

    // Send error response
    return res.status(500).json({
      message: "Error creating payment record",
      error: error.message,
    });
  }
}
async function addBankDeails(req, res) {
  const { name, email, phone, account_number, ifsc_code } = req.body;
  const userId = req?.user?.user_id;
  if (!ifsc_code || !account_number) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const newBackDetails = await Bank_details.create({
      user_id: userId,
      name,
      email,
      phone,
      account_number,
      ifsc_code,
    });

    if (newBackDetails) {
      const userData = await Users.findOne({ where: { id: userId } });
      if (userData) {
        userData.bank_details_id = newBackDetails?.id;
        await userData.save();
      }
    }

    // Send response
    res.status(201).json({
      message: "Bank details added successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding bank details:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// const addRole = async (req, res) => {
//   try {
//     const { userEmail, role } = req.body;

//     const userdata = await Users.findOne({ where: { email: userEmail } });
//     if (!userdata) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }

//     const roleData = await Roles.findOne({ where: { name: role } });
//     if (!roleData) {
//       return res
//         .status(404)
//         .json({ message: "Role not found", success: false });
//     }

//     userdata.role_id = roleData.id;

//     if (role !== "Guest") {
//       const plan = await Pricing.findOne({ where: { name: "Free" } });
//       // if (plan) {
//       //   const startDate = new Date();
//       //   const endDate = new Date();
//       //   endDate.setDate(startDate.getDate() + 3);

//       //   userdata.subscription_id = plan.id;
//       //   userdata.subscription_start_date = startDate
//       //     .toISOString()
//       //     .split("T")[0];
//       //   userdata.subscription_expiry_date = endDate.toISOString().split("T")[0];
//       //   userdata.trial = true;
//       // }

//       if (plan) {
//         const startDate = new Date();
//         let validationPeriodInDays;
//         if (plan?.period === "month") {
//           const calculateDateValue = await calculateDates(plan?.Validity);
//           validationPeriodInDays = calculateDateValue.numberOfDays;
//         } else {
//           validationPeriodInDays = plan?.Validity;
//         }
//         const endDate = new Date(startDate);
//         endDate.setDate(startDate.getDate() + validationPeriodInDays);

//         userdata.subscription_id = plan.id;
//         userdata.subscription_start_date = startDate
//           .toISOString()
//           .split("T")[0];
//         userdata.subscription_expiry_date = endDate.toISOString().split("T")[0];
//         userdata.addon_duration = null;
//         userdata.addon_storage = null;
//         userdata.duration_spent = null;
//         userdata.storage_used = null;
//         userdata.trial = true;
//       }
//     }

//     await userdata.save();
//           await auth0Service.updateAuth0UserMetadata(userdata?.external_id, {
//               role: roleName,
//               plan: plan?.name || "Free",
//               subscription_start_date: userdata.subscription_start_date,
//               subscription_expiry_date: userdata.subscription_expiry_date,
//             });

//     const user = await Users.findOne({
//       where: { id: userdata.id },
//       include: [
//         { model: Roles, as: "role" },
//         { model: Pricing, as: "subscription" },
//       ],
//     });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });
//     }

//     user.dataValues.subscription_plan = user.subscription?.name;
//     delete user.dataValues.password;
//     delete user.dataValues.subscription_id;
//     delete user.dataValues.subscription;

//     // const accessToken = jwt.sign(
//     //   {
//     //     user_id: user.id,
//     //     username: user.name,
//     //     email: user.email,
//     //   },
//     //   process.env.TOKEN_KEY,
//     //   { expiresIn: "1h" }
//     // );

//     return res.json({
//       message: "Success",
//       data: user,
//       // token: accessToken,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const addRole = async (req, res) => {
  try {
    const { userEmail, role } = req.body;

    const userdata = await Users.findOne({ where: { email: userEmail } });
    if (!userdata) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const roleData = await Roles.findOne({ where: { name: role } });
    if (!roleData) {
      return res
        .status(404)
        .json({ message: "Role not found", success: false });
    }

    userdata.role_id = roleData.id;

    let plan = null;
    if (role !== "Guest") {
      plan = await Pricing.findOne({ where: { name: "Free" } });
      if (plan) {
        const startDate = new Date();
        let validationPeriodInDays;

        if (plan?.period === "month") {
          const calculateDateValue = await calculateDates(plan?.Validity);
          validationPeriodInDays = calculateDateValue.numberOfDays;
        } else {
          validationPeriodInDays = plan?.Validity;
        }

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + validationPeriodInDays);

        userdata.subscription_id = plan.id;
        userdata.subscription_start_date = startDate
          .toISOString()
          .split("T")[0];
        userdata.subscription_expiry_date = endDate.toISOString().split("T")[0];
        userdata.addon_duration = null;
        userdata.addon_storage = null;
        userdata.duration_spent = null;
        userdata.storage_used = null;
        userdata.trial = true;
      }
    } else {
      // Reset subscription if role is Guest
      userdata.subscription_id = null;
      userdata.subscription_start_date = null;
      userdata.subscription_expiry_date = null;
      userdata.addon_duration = null;
      userdata.addon_storage = null;
      userdata.duration_spent = null;
      userdata.storage_used = null;
      userdata.trial = false;
    }

    await userdata.save();

    await auth0Service.updateAuth0UserMetadata(userdata?.external_id, {
      role:
        role === "Moderator"
          ? "Teacher"
          : role === "Guest"
          ? "Student"
          : roleData?.name,
      plan: plan?.name || null,
      subscription_start_date: userdata.subscription_start_date,
      subscription_expiry_date: userdata.subscription_expiry_date,
      trial: userdata.trial,
      expired: userdata.expired,
    });

    const user = await Users.findOne({
      where: { id: userdata.id },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.dataValues.subscription_plan = user.subscription?.name || null;
    delete user.dataValues.password;
    delete user.dataValues.subscription_id;
    delete user.dataValues.subscription;

    return res.json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

async function getAllTeachers(req, res) {
  try {
    const users = await Users.findAll({
      where: {
        status: {
          [Op.not]: true,
        },
        approve: {
          [Op.not]: false,
        },
      },
      include: [
        {
          model: Roles,
          as: "role",
          where: {
            name: {
              [Op.notIn]: ["Super Admin", "Administrator", "Guest"],
            },
          },
        },
      ],
    });
    const filtered = users?.map((val) => {
      delete val?.dataValues?.password;
      return val;
    });
    res.json({ data: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default {
  createNewUser,
  getAllNewUsers,
  deleteNewUser,
  patchNewUser,
  newLogin,
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  bannedUsers,
  changePwdByUserId,
  verifyEmail,
  uploadProfile,
  deleteProfile,
  forgetPassword,
  resetPassword,
  get_transactions,
  contact,
  pendingUser,
  inviteUser,
  verifyInviteUser,
  changePlan,
  expiredPlan,
  createPayment,
  addBankDeails,
  addRole,
  getAllTeachers,
};
