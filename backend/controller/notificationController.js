import Notifications from "../models/notifications.js";
import Schedule_room_meeting from "../models/schedule_room_meeting.js";
import { createNotification } from "../services/Notifications/notifications.js";
import moment from "moment-timezone";

async function getNotification(req, res) {
  try {
    const userId = req.user.user_id;

    const AllNotification = await Notifications.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    const unReadCount = AllNotification.filter(
      (notification) => !notification.is_read
    ).length;

    res.send({
      message: "success",
      data: AllNotification,
      unReadCount: unReadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function markReadNotification(req, res) {
  try {
    const userId = req.user.user_id;

    const updatedNotifications = await Notifications.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.send({ message: "All unread notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createNewNotification(req, res) {
  try {
    const userId = req.user.user_id;
    const { title, message,type } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const result = await createNotification(message, title, userId,type);

    if (!result.success) {
      return res
        .status(201)
        .json({ message: result.message, success: result.success });
    }

    return res
      .status(201)
      .json({ message: result.message, success: result.success }); // 201 Created
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const checkScheduleMeeting = async (req, res) => {
  try {
    console.log("Checking for upcoming scheduled meetings...");

    const timezone = "Asia/Kolkata";
    const now = moment().tz(timezone); // Get the current time in the user's timezone

    let meetings;

    try {
      meetings = await Schedule_room_meeting.findAll();
    } catch (fetchError) {
      console.error("Error fetching meetings:", fetchError);
      return res.status(500).json({ message: "Error fetching meetings." });
    }

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

        // Check if the current time is within the 10-minute window before the meeting starts
        if (now.isBetween(tenMinutesBeforeStart, startMomentWithTimezone)) {
          const title = "Upcoming Meeting Notification";
          const message = `Your meeting "${
            meeting.title
          }" starts at ${startMomentWithTimezone.format(
            "hh:mm A"
          )} on ${startMomentWithTimezone.format("MMMM Do YYYY")}.`;
          const type = "Meeting Reminder"

          try {
            await createNotification(message, title, meeting.user_id,type); // Await the notification creation
          } catch (notificationError) {
            console.error(
              `Error creating notification for user ${meeting.user_id}:`,
              notificationError
            );
          }
        }
      } catch (meetingError) {
        console.error(`Error processing meeting ${meeting.id}:`, meetingError);
      }
    }

    res.status(200).json({
      message: "Meetings checked successfully.",
    });
  } catch (error) {
    console.error("Error checking scheduled meetings:", error);
    res.status(500).json({ message: "Error checking scheduled meetings." });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notification = await Notifications.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found", success: false });
    }

    await Notifications.destroy({ where: { id: notificationId } });

    return res
      .status(200)
      .json({ message: "Notification deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAllNotificationById = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const deletedCount = await Notifications.destroy({
      where: { user_id: userId },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found", success: false });
    }

    return res
      .status(200)
      .json({
        message: "All notifications deleted successfully",
        success: true,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export default {
  getNotification,
  markReadNotification,
  createNewNotification,
  // checkMoments,
  deleteNotification,
  checkScheduleMeeting,
  deleteAllNotificationById
};
