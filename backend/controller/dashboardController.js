import { where } from "sequelize";
import Feedback from "../models/feedback.js";
import Invitations from "../models/invitations.js";
import Pricing from "../models/pricing.js";
import Room_Status from "../models/room_status.js";
import Rooms from "../models/rooms.js";
import Schedule_room_meeting from "../models/schedule_room_meeting.js";
import Transaction from "../models/transaction.js";
import Users from "../models/users.js";
import { roomStatusSync } from "./bigbluebuttonController.js";
import Shared_accesses from "../models/shared_accesses.js";
import { zoomLiveMeetingStatus } from "../services/Zoom/config.js";
import SendUserMail from "../SendEmail/SendUserMail.js";
export async function getResolvedValues(arrayPromises) {
  const resolvedValues = [];

  for (const promise of arrayPromises) {
    resolvedValues.push(await promise);
  }

  return resolvedValues;
}

async function liveRooms(req, res) {
  try {
    const zoomToken = req.zoomToken;
    const rooms = await Rooms.findAll({
      include: {
        model: Users,
      },
    });
    const changed = await roomStatusSync(rooms);
    let changedValue = await getResolvedValues(changed);
    const zoomlive = await zoomLiveMeetingStatus(zoomToken, rooms);

    const filtered = changedValue?.filter((val) => {
      delete val.user.dataValues.password;
      return val.online === true;
    });
    return res.send({ data: { filtered } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// async function roomcount(req, res) {
//   try {
//     const { user: filterUsers } = req.body;

//     // Define where clause for filtering users, if provided
//     let whereClause = {};
//     if (filterUsers && filterUsers.length > 0) {
//       const userIds = filterUsers.map((user) => user.id);
//       whereClause = {
//         user_id: userIds, // assuming userId is the foreign key in the Rooms model
//       };
//     }
//     const rooms = await Rooms.findAll({
//       where: whereClause,
//       include: {
//         model: Users,
//       },
//     });
//     const userCount = {};

//     // Iterate through the data array and count the occurrences of each user
//     rooms.forEach((item) => {
//       const userId = item.user.id;
//       if (userCount[userId]) {
//         userCount[userId] += 1;
//       } else {
//         userCount[userId] = 1;
//       }
//     });

//     // Convert the userCount object to an array of objects with "label" and "value" properties
//     const chartData = Object.entries(userCount).map(([userId, count]) => ({
//       label: rooms.find((item) => item.user.id === userId).user.name,
//       value: count,
//     }));
//     return res.send({ data: chartData });
//   } catch (error) {
//     console.log(error);
//   }
// }

async function roomcount(req, res) {
  try {
    const { user: filterUsers } = req.body;

    let whereClause = {};
    if (filterUsers?.length) {
      whereClause.user_id = filterUsers.map((user) => user.id);
    }

    // Fetch rooms along with their associated users
    const rooms = await Rooms.findAll({
      where: whereClause,
      include: {
        model: Users,
      },
    });

    // Use a Map for better performance in counting occurrences
    const userCountMap = new Map();

    rooms.forEach((room) => {
      const userId = room.user.id;
      const userName = room.user.name;

      if (userCountMap.has(userId)) {
        userCountMap.set(userId, {
          label: userName,
          value: userCountMap.get(userId).value + 1,
        });
      } else {
        userCountMap.set(userId, { label: userName, value: 1 });
      }
    });

    return res.send({ data: Array.from(userCountMap.values()) });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

// async function roomsUpdates(req, res) {
//   try {
//     const rooms = await Rooms.findAll({
//       include: {
//         model: Users,
//       },
//     });
//     function parseDateString(dateString) {
//       const match = dateString.match(
//         /(\w+), (\w+) (\d+), (\d+) at (\d+):(\d+) (\w+)/
//       );

//       if (match) {
//         const [, dayOfWeek, month, day, year, hour, minute, ampm] = match;
//         const months = [
//           "January",
//           "February",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December",
//         ];
//         const monthIndex = months.indexOf(month);
//         const isPM = ampm === "PM";
//         let hours = parseInt(hour, 10);

//         if (isPM && hours !== 12) {
//           hours += 12;
//         }

//         const postedAt = new Date(
//           year,
//           monthIndex,
//           day,
//           hours,
//           parseInt(minute, 10)
//         );
//         return postedAt;
//       } else {
//         console.error("Invalid date format");
//         return null;
//       }
//     }

//     const filteredData = rooms
//       .filter(
//         (item) => item.last_session !== null && item.last_session !== undefined
//       )
//       .map((item) => ({
//         name: item.name,
//         date: parseDateString(item.last_session),
//         owner: item.user.name,
//         duration: item.room_duration,
//       }));
//     return res.send({ data: filteredData });
//   } catch (error) {
//     console.log(error);
//   }
// }

// const roomStatus = async (req, res) => {
//   try {
//     // const yearquery = req.body.year; // Example: 2024
//     const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
//     const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
//     let yearquery = req.body.year; // Example: 2024
//     // const startDate = new Date(`${yearquery}-09-01`);
//     // const endDate = new Date(`${yearquery}-09-30`);
//     const roomStatusData = await Room_Status.findAll();
//     const yearlyParticipants = new Map();
//     if (endDate) {
//       const year = new Date(endDate).getFullYear();
//       yearquery = year;
//     }

//     const allMonths = Array(12).fill(0);
//     const monthNames = Array.from({ length: 12 }, (_, i) =>
//       new Date(0, i).toLocaleString("en-US", { month: "short" })
//     );

//     roomStatusData.forEach((entry) => {
//       const date = new Date(entry.date);
//       const year = date.getFullYear();
//       const monthIndex = date.getMonth();

//       const isInDateRange =
//         startDate && endDate
//           ? date >= startDate && date <= endDate
//           : year === Number(yearquery);

//       if (isInDateRange) {
//         if (!yearlyParticipants.has(year)) {
//           yearlyParticipants.set(year, [...allMonths]); // Set all months to 0 initially
//         }

//         yearlyParticipants.get(year)[monthIndex] += parseInt(
//           entry.participants,
//           10
//         );
//       }
//     });

//     const yearData = findYearData(yearlyParticipants, yearquery, monthNames);

//     return res.send({ data: yearData });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// function findYearData(yearlyParticipants, year, monthNames) {
//   const yearData = yearlyParticipants.get(Number(year));
//   if (yearData) {
//     return {
//       date: monthNames,
//       participants: yearData,
//     };
//   } else {
//     return {
//       date: monthNames,
//       participants: Array(12).fill(0), // Return 0 for all months if no data found
//     };
//   }
// }

async function roomsUpdates(req, res) {
  try {
    const rooms = await Rooms.findAll({
      include: {
        model: Users, // Ensures user data is fetched
      },
      raw: true,
      nest: true, // Maintains nesting for user data
    });

    function parseDateString(dateString) {
      if (!dateString) return null;

      const match = dateString.match(
        /(\w+), (\w+) (\d+), (\d+) at (\d+):(\d+) (\w+)/
      );
      if (!match) return null;

      const [, , month, day, year, hour, minute, ampm] = match;
      const months = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
      };

      let hours = parseInt(hour, 10);
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      return new Date(year, months[month], day, hours, parseInt(minute, 10));
    }

    // Process data efficiently using reduce()
    const filteredData = rooms.reduce((acc, item) => {
      if (item.last_session) {
        acc.push({
          name: item.name,
          date: parseDateString(item.last_session),
          owner: item.User?.name || "Unknown",
          duration: item.room_duration,
        });
      }
      return acc;
    }, []);

    return res.send({ data: filteredData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const roomStatus = async (req, res) => {
  try {
    const { startDate, endDate, year } = req.body;
    let yearquery = year ? Number(year) : null;
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    if (parsedEndDate) {
      yearquery = parsedEndDate.getFullYear();
    }

    // Fetch only required fields
    const roomStatusData = await Room_Status.findAll({
      attributes: ["date", "participants"],
      raw: true, // Improves performance by returning plain JSON instead of Sequelize instances
    });

    // Initialize all months with zero values
    const allMonths = Array(12).fill(0);
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString("en-US", { month: "short" })
    );

    // Process records in a single loop
    roomStatusData.forEach(({ date, participants }) => {
      const entryDate = new Date(date);
      const entryYear = entryDate.getFullYear();
      const monthIndex = entryDate.getMonth();

      const isInDateRange =
        parsedStartDate && parsedEndDate
          ? entryDate >= parsedStartDate && entryDate <= parsedEndDate
          : entryYear === yearquery;

      if (isInDateRange) {
        allMonths[monthIndex] += parseInt(participants, 10);
      }
    });

    // Format response directly
    return res.send({
      data: {
        date: monthNames,
        participants: allMonths,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const subscriptionCount = async (req, res) => {
  try {
    const pricingData = await Pricing.findAll({
      order: [["price", "ASC"]],
    });
    if (pricingData) {
      const userData = await Users.findAll();
      const resultArray = [];

      pricingData.forEach((pricingItem) => {
        const matchingUsers = userData.filter(
          (user) => user.subscription_id === pricingItem.id
        );

        const totalCount = matchingUsers.length;
        const label = pricingItem.name;

        resultArray.push({ label, value: totalCount });
      });

      // Now resultArray contains the desired array of objects with label and total count
      return res.send({ data: resultArray });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const scheduleMeetingOrder = async (req, res) => {
  try {
    const rooms = await Rooms.findAll();
    const changed = await roomStatusSync(rooms);
    let changedValue = await getResolvedValues(changed);
    const publicView = req.query.publicView;
    let whereCondition = {};
    if (publicView === "true") {
      whereCondition.public_view = true;
    } else if (publicView === "false") {
      whereCondition.online = false;
    }
    const scheduleData = await Schedule_room_meeting.findAll({
      where: whereCondition,
      include: {
        model: Rooms,
      },
    });

    if (scheduleData.length > 0) {
      const currentDate = new Date();
      const futureMeetings = scheduleData
        .filter((meeting) => new Date(meeting.startDate) >= currentDate)
        .map((meeting) => ({
          name: meeting.title,
          date: meeting.startDate,
          meeting,
        }));

      if (futureMeetings.length > 0) {
        // Sort the array in ascending order based on date
        futureMeetings.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Send the sorted future meetings to the frontend
        res.status(200).json({ data: futureMeetings });
      } else {
        res.status(200).json({ message: "No future meetings found." });
      }
    } else {
      res.status(200).json({ message: "No schedule data found." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const invitesSent = async (req, res) => {
  try {
    const invitesData = await Invitations.findAll();
    const result = {};

    invitesData.forEach((invite) => {
      const { email, provider } = invite;

      if (!result[provider]) {
        result[provider] = {
          name: provider,
          total: 1,
        };
      } else {
        result[provider].total++;
      }
    });

    if (result) {
      res.send({ data: result });
    } else {
      res.status(200).json({ message: "No invitesSent found." });
    }
  } catch (error) {
    console.log(error);
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedbackData = await Feedback.findAll({
      order: [["created_at", "DESC"]],
    });

    if (feedbackData) {
      res.send({ data: feedbackData, message: "success" });
    } else {
      res.send({ message: "No Feedback " });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  const feedbackId = req.params.id; // Assuming you get the feedback ID from the request parameters

  try {
    const feedback = await Feedback.findByPk(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.destroy();
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const allTransaction = async (req, res) => {
  try {
    const allTransactions = await Transaction.findAll({
      include: {
        model: Users,
      },
    });
    if (allTransactions) {
      res.send({ message: "success", data: allTransactions });
    } else {
      res.send({ message: "No Transaction", data: [] });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const delete_Transaction = async (req, res) => {
  try {
    const transactionid = req.params.id;
    const transactionToDelete = await Transaction.findByPk(transactionid);
    if (transactionToDelete) {
      await transactionToDelete.destroy();
      res.send({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
      raw: true, // Improves performance by returning plain JSON
    });

    return res.json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const roomShareDetails = async (req, res) => {
  try {
    const rooms = await Rooms.findAll({
      include: {
        model: Users,
        attributes: ["name"],
      },
    });

    const roomDetails = [];

    for (const room of rooms) {
      const sharedAccesses = await Shared_accesses.findAll({
        where: { room_id: room.id },
        include: {
          model: Users,
          attributes: ["name"],
        },
        attributes: ["created_at"],
      });

      const sharedWith = sharedAccesses.map((access) => ({
        name: access.user.name,
        date: access.created_at,
      }));

      roomDetails.push({
        userName: room.user.name,
        roomName: room.name,
        sharedWith,
      });
    }

    res.send({ data: roomDetails });
  } catch (error) {
    console.error("Error fetching room share details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching room share details." });
  }
};

const sendMail = async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(200).json({ error: "Emails array is required" });
    }

    // Send emails one by one (or you can batch if needed)
    const results = await Promise.allSettled(
      emails.map((email) => SendUserMail(email, message, subject))
    );

    // Collect results
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    res.json({
      message: `Emails processed. ✅ Success: ${success}, ❌ Failed: ${failed}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Failed to send emails", success: false });
  }
};

export default {
  liveRooms,
  roomcount,
  roomsUpdates,
  roomStatus,
  subscriptionCount,
  scheduleMeetingOrder,
  invitesSent,
  getFeedback,
  deleteFeedback,
  allTransaction,
  delete_Transaction,
  allUsers,
  roomShareDetails,
  sendMail,
};
