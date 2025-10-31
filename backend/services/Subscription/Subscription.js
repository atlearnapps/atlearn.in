import Meeting_options from "../../models/meeting_options.js";
import Pricing from "../../models/pricing.js";
import Roles from "../../models/roles.js";
import Room_meeting_options from "../../models/room_meeting_options.js";
import Rooms from "../../models/rooms.js";
import Users from "../../models/users.js";
import calculateDates from "../../utils/calculateDates.js";
import { notifyAdminsofExpiredPlanUsers } from "../Notifications/notifications.js";
import moment from "moment";
import { Op } from "sequelize";

export async function processExpiredUsers() {
  try {
    console.log("Checking expired users...");

    // Fetch all users with their subscription and role details
    const allUsers = await Users.findAll({
      include: [
        { model: Pricing, as: "subscription" },
        {
          model: Roles,
          as: "role",
          where: {
            name: { [Op.notIn]: ["Super Admin", "Administrator", "Guest"] },
          },
        },
      ],
    });

    if (!allUsers.length) {
      console.log("No users found.");
      return;
    }

    // Pre-fetch "Free" plan and "record" meeting option
    const [freePlan, recordOption] = await Promise.all([
      Pricing.findOne({ where: { name: "Free" } }),
      Meeting_options.findOne({ where: { name: "record" } }),
    ]);

    if (!freePlan) {
      console.error("Free plan not found. Ensure it's available in the database.");
      return;
    }

    // Process users in parallel
    const expiredUsers = await Promise.all(
      allUsers.map((user) => processUser(user, freePlan, recordOption))
    );

    console.log("Expired users processed:", expiredUsers.filter(Boolean));
  } catch (error) {
    console.error("Error processing expired users:", error);
  }
}

async function processUser(user, freePlan, recordOption) {
    const currentDateIST = moment().tz("Asia/Kolkata");
  const { subscription, subscription_expiry_date, trial } = user;

  // Handle Enterprise Trial Users
  if (subscription?.name === "Enterprise" && trial === true && moment.tz(subscription_expiry_date, "YYYY-MM-DD","Asia/Kolkata").isBefore(currentDateIST)) {
    await handleEnterpriseTrialUser(user, freePlan, recordOption);
    return { id: user.id, name: user.name, updatedPlan: "Free" };
  }

  // Handle Expired Users
  if (subscription_expiry_date && moment.tz(subscription_expiry_date, "YYYY-MM-DD","Asia/Kolkata").isBefore(currentDateIST) && user.expired === false) {
    user.expired = true;

    await Promise.all([
      user.save(),
      notifyAdminsofExpiredPlanUsers(user.name, subscription?.name),
      disableRoomSettings(user.id, ["record", "glModeratorAccessCode", "glAnyoneJoinAsModerator", "glAnyoneCanStart"]),
    ]);

    return { id: user.id, name: user.name, subscription_expiry_date };
  }

  return null;
}

async function handleEnterpriseTrialUser(user, freePlan, recordOption) {
  const rooms = await Rooms.findAll({ where: { user_id: user.id } });

  // Disable "record" option for all user rooms in parallel
  if (recordOption) {
    await Promise.all(
      rooms.map(async (room) => {
        const roomSetting = await Room_meeting_options.findOne({
          where: { room_id: room.id, meeting_option_id: recordOption.id, value: "true" },
        });
        if (roomSetting) {
          roomSetting.value = "false";
          await roomSetting.save();
        }
      })
    );
  }

  // Calculate new subscription dates
  const startDate = new Date();
  const validationPeriodInDays =
    freePlan.period === "month"
      ? (await calculateDates(freePlan.Validity)).numberOfDays
      : freePlan.Validity;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + validationPeriodInDays);

  // Update user subscription
  Object.assign(user, {
    subscription_id: freePlan.id,
    subscription_start_date: startDate.toISOString().split("T")[0],
    subscription_expiry_date: endDate.toISOString().split("T")[0],
    addon_duration: null,
    addon_storage: null,
    duration_spent: null,
    storage_used: null,
  });
  await user.save();
}

async function disableRoomSettings(userId, optionNames) {
  const [userRooms, meetingOptions] = await Promise.all([
    Rooms.findAll({ where: { user_id: userId }, attributes: ["id"] }),
    Meeting_options.findAll({ where: { name: optionNames }, attributes: ["id"] }),
  ]);

  if (userRooms.length && meetingOptions.length) {
    const roomIds = userRooms.map((room) => room.id);
    const meetingOptionIds = meetingOptions.map((option) => option.id);

    await Room_meeting_options.update(
      { value: "false" },
      {
        where: {
          room_id: roomIds,
          meeting_option_id: meetingOptionIds,
        },
      }
    );
  }
}

