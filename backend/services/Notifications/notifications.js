import moment from "moment-timezone";
import Users from "../../models/users.js";
import Roles from "../../models/roles.js";
import Notification from "../../models/notifications.js";
import Schedule_room_meeting from "../../models/schedule_room_meeting.js";
import ScheduleEmail from "../../SendEmail/ScheduleEmail.js";

export const createNotification = async (message, title, user_id, type) => {
  const timezone = "Asia/Kolkata";

  try {
    const existingNotification = await Notification.findOne({
      where: { message, user_id },
    });

    if (existingNotification) {
      const createdAtInTimezone = moment.tz(
        existingNotification.createdAt,
        timezone
      );
      const oneWeekAgo = moment.tz(timezone).subtract(1, "weeks");

      if (createdAtInTimezone.isAfter(oneWeekAgo)) {
        return {
          success: false,
          message:
            "Notification already exists and was sent within the last week",
        };
      }
    }

    await Notification.create({
      message,
      title,
      user_id,
      type,
    });

    return { success: true, message: "Notification created successfully" };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, message: "Error creating notification" };
  }
};

const getUsersByRole = async (roleName) => {
  try {
    // Find the role by its name (e.g., "Administrator")
    const roleData = await Roles.findOne({ where: { name: roleName } });

    if (!roleData) {
      return { success: false, message: `Role "${roleName}" not found` };
    }

    // Find all users with the corresponding role ID
    const users = await Users.findAll({
      where: {
        role_id: roleData.id,
      },
    });

    if (users.length === 0) {
      return {
        success: false,
        message: `No users found with the role "${roleName}"`,
      };
    }

    return { success: true, users };
  } catch (error) {
    console.error(`Error fetching users by role "${roleName}":`, error);
    return { success: false, message: "Error fetching users by role" };
  }
};

export const notifyAdminsOfNewUser = async (newUser) => {
  const title = "New User Signup";
  const message = `New user signed up: ${newUser.name}`;
  const type = "New Registration";

  const usersData = await getUsersByRole("Administrator");

  // Notify all admins and super admins
  await Promise.all(
    usersData?.users?.map((user) =>
      createNotification(message, title, user.id, type)
    )
  );

  return { message: "Notifications sent to admins.", success: true };
};

export const notifyAdminsofExpiredPlanUsers = async (userName, plan) => {
  try {
    const title = "User Plan Expired";
    const message = `User ${userName}'s ${plan} plan has expired.`;
    const type = "Plan Expiry";
    const usersData = await getUsersByRole("Administrator");
    await Promise.all(
      usersData?.users?.map((user) =>
        createNotification(message, title, user.id, type)
      )
    );
    return { message: "Notifications sent to admins.", success: true };
  } catch (error) {
    return { success: false, message: "Error creating notification" };
  }
};

export const notifyAdminOfNewPlanSubscription = async (userName, plan) => {
  try {
    const title = "New Plan Subscription";
    const message = `User ${userName} has subscribed to the ${plan} plan.`;
    const type = "Plan Subscription";
    const usersData = await getUsersByRole("Administrator");
    await Promise.all(
      usersData?.users?.map((user) =>
        createNotification(message, title, user.id, type)
      )
    );
    return { message: "Notifications sent to admins.", success: true };
  } catch (error) {
    return { success: false, message: "Error creating notification" };
  }
};

export const checkScheduleMeeting = async () => {
  try {
    const timezone = "Asia/Kolkata";
    const now = moment().tz(timezone); // Get the current time in the user's timezone

    let meetings;

    try {
      meetings = await Schedule_room_meeting.findAll();
    } catch (fetchError) {
      console.error("Error fetching meetings:", fetchError);
      return; // Exit if there is an error fetching meetings
    }

    // Check if there are no meetings scheduled
    if (!meetings || meetings.length === 0) {
      console.log("No scheduled meetings found.");
      return; // Exit if no meetings are found
    }

    const reminderTime = now.add(10, "minutes").startOf("minute");
    for (const meeting of meetings) {
      try {
        // First, parse the string date using moment without timezone
        const startMomentWithTimezone = moment.tz(
          meeting.startDate,
          "ddd, MMM D, YYYY, h:mm A",
          "Asia/Kolkata"
        );
        // Then apply the timezone
        // const startMomentWithTimezone = startMoment
        const tenMinutesBeforeStart = startMomentWithTimezone
          .clone()
          .subtract(10, "minutes");
        const meetingTime = moment.tz(
            meeting.startDate,
            "ddd, MMM D, YYYY, h:mm A",
            "Asia/Kolkata"
          );

        // Check if the current time is within the 10-minute window before the meeting starts
        if (now.isBetween(tenMinutesBeforeStart, startMomentWithTimezone)) {
          const title = "Upcoming Meeting ";
          const message = `Your meeting "${
            meeting.title
          }" starts at ${startMomentWithTimezone.format(
            "hh:mm A"
          )} on ${startMomentWithTimezone.format("MMMM Do YYYY")}.`;
          const type = "Meeting Reminder";
          try {
            await createNotification(message, title, meeting.user_id,type); // Await the notification creation
          } catch (notificationError) {
            console.error(
              `Error creating notification for user ${meeting.user_id}:`,
              notificationError
            );
          }
        }
        if (meetingTime.isSame(reminderTime, "minute")) {
          try {
            if (meeting?.guestEmail?.length > 0) {
              const guestEmails = meeting.guestEmail.split(",").map((email) => email.trim());
              await Promise.all(
                guestEmails.map((email) =>
                  ScheduleEmail({
                    title: meeting.title,
                  description: meeting.description,
                  startDate: meeting.startDate,
                  endDate: meeting.endDate,
                  guestEmail: email,
                  url: `${meeting.url}&scheduleId=${meeting.id}`,
                  public_view: meeting.public_view,
                  price: meeting.price,
                  },'Reminder')
                )
              )
            } 
          } catch(scheduleEmailError) {
            console.error(
              `Error creating notification for user ${meeting.user_id}:`,
              scheduleEmailError
            );
          }
        }
      } catch (meetingError) {
        console.error(`Error processing meeting ${meeting.id}:`, meetingError);
      }
    }
  } catch (error) {
    console.error("Error checking scheduled meetings:", error);
    res.status(500).json({ message: "Error checking scheduled meetings." });
  }
};
