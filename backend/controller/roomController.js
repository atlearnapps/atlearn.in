import Rooms from "../models/rooms.js";
import Meeting_options from "../models/meeting_options.js";
import generateUniqueId from "generate-unique-id";
import Room_meeting_options from "../models/room_meeting_options.js";
import Shared_accesses from "../models/shared_accesses.js";
import Users from "../models/users.js";
import { Op, Sequelize } from "sequelize";
import Role_permissions from "../models/role_permissions.js";
import Roles from "../models/roles.js";
import Permissions from "../models/permissions.js";
import { roomStatusSync } from "./bigbluebuttonController.js";
// import sendEmail from "../SendEmail/SendEmail.js";
import SharedRooms from "../SendEmail/ShareRoom.js";
import ScheduleEmail from "../SendEmail/ScheduleEmail.js";
import Schedule_room_meeting from "../models/schedule_room_meeting.js";
import Invitations from "../models/invitations.js";
import Feedback from "../models/feedback.js";
import FeedbackEmail from "../SendEmail/FeedbackEmail.js";
import Formats from "../models/formats.js";
import Recordings from "../models/recordings.js";
import Site_settings from "../models/site_settings.js";
import Settings from "../models/settings.js";
import Pricing from "../models/pricing.js";
import InviteNewUser from "../SendEmail/InviteNewUser.js";
import Rooms_configurations from "../models/rooms_configurations.js";
import Analytics_dashboard from "../models/analytics_dashboard.js";
import sequelize from "sequelize";
import moment from "moment-timezone";
import RoomPayments from "../models/roomPayments.js";
import { createNotification } from "../services/Notifications/notifications.js";
import fs from "fs";
import { log } from "console";
import {
  createZoomMeeting,
  deleteZoomMeeting,
  zoomLiveMeetingStatus,
} from "../services/Zoom/config.js";
import Zoom_meeting_options from "../models/zoom_meeting_options.js";
import axios from "axios";
import AcknowledgmentMail from "../SendEmail/AcknowledgmentMail.js";

const createRoom = async (req, res) => {
  try {
    let roomData = { ...req.body };
    const filename = req?.file?.filename;
    if (roomData?.provider === "zoom") {
      const zoomToken = req.zoomToken;
      if (!zoomToken) {
        throw new Error("Zoom token is missing");
      }
      const meetingData = await createZoomMeeting({
        topic: roomData?.name,
        zoomToken: zoomToken,
      });
      if (meetingData) {
        const zoomMeetingDetails = await Zoom_meeting_options.create({
          meeting_id: meetingData.id,
          password: meetingData.password,
        });
        if (zoomMeetingDetails) {
          roomData.zoom_meeting_setting_id = zoomMeetingDetails.id;
        }
      }
    }
    if (req.body.user) {
      roomData.user_id = req.body.user;
    } else if (req.body.user_external_id) {
      const user = await Users.findOne({
        where: { external_id: req.body.user_external_id },
      });
      roomData.user_id = user?.id;
    } else {
      roomData.user_id = req.user.user_id;
    }
    if (filename) {
      roomData.cover_image_url = filename;
    }

    roomData.friendly_id = generateUniqueId({
      length: 15,
      includeSymbols: ["-"],
    });
    roomData.meeting_id = generateUniqueId({
      length: 15,
      includeSymbols: ["-"],
    });
    const room = await Rooms.create(roomData);

    // Fetch all required meeting options in advance
    const meetingOptions = await Meeting_options.findAll({
      where: {
        name: [
          "record",
          "muteOnStart",
          "guestPolicy",
          "glAnyoneCanStart",
          "glAnyoneJoinAsModerator",
          "glRequireAuthentication",
          "glModeratorAccessCode",
          "glViewerAccessCode",
        ],
      },
    });
    // Map the options to their respective IDs
    const meetingOptionMap = meetingOptions.reduce((map, option) => {
      map[option.name] = option.id;
      return map;
    }, {});

    // Fetch the room configurations for "record" and "muteOnStart"
    const recordMeetingOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["record"] },
    });
    const muteOnStartMeetingOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["muteOnStart"] },
    });
    const guestPolicyOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["guestPolicy"] },
    });
    const glAnyoneCanStartOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["glAnyoneCanStart"] },
    });
    const glAnyoneJoinAsModeratorOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["glAnyoneJoinAsModerator"] },
    });
    const glRequireAuthenticationOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["glRequireAuthentication"] },
    });
    const glModeratorAccessCodeOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["glModeratorAccessCode"] },
    });
    const glViewerAccessCodeOption = await Rooms_configurations.findOne({
      where: { meeting_option_id: meetingOptionMap["glViewerAccessCode"] },
    });
    const roomMeetingOptions = [
      {
        meeting_option_id: meetingOptionMap["record"],
        value: recordMeetingOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["muteOnStart"],
        value: muteOnStartMeetingOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["guestPolicy"],
        value:
          guestPolicyOption?.value === "true"
            ? "ASK_MODERATOR"
            : "ALWAYS_ACCEPT",
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["glAnyoneCanStart"],
        value: glAnyoneCanStartOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["glAnyoneJoinAsModerator"],
        value: glAnyoneJoinAsModeratorOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["glRequireAuthentication"],
        value: glRequireAuthenticationOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["glModeratorAccessCode"],
        value:
          glModeratorAccessCodeOption?.value === "true"
            ? generateUniqueId({
                length: 6,
              })
            : glModeratorAccessCodeOption?.value,
        room_id: room?.id,
      },
      {
        meeting_option_id: meetingOptionMap["glViewerAccessCode"],
        value:
          glViewerAccessCodeOption?.value === "true"
            ? generateUniqueId({
                length: 6,
              })
            : glModeratorAccessCodeOption?.value,
        room_id: room?.id,
      },
    ];
    await Room_meeting_options.bulkCreate(roomMeetingOptions);
    res.status(201).json({ message: "successfully created", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export async function getResolvedValues(arrayPromises) {
  const resolvedValues = [];

  for (const promise of arrayPromises) {
    resolvedValues.push(await promise);
  }

  return resolvedValues;
}

const getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page
    const perPage = parseInt(req.query.perPage) || 10; // Records per page
    const status = req.query.status;
    const zoomToken = req.zoomToken;
    let whereCondition = {};
    if (status === "true") {
      whereCondition.online = true;
    } else if (status === "false") {
      whereCondition.online = false;
    }
    const offset = (page - 1) * perPage;
    const { count, rows } = await Rooms.findAndCountAll({
      limit: perPage,
      offset,
      where: whereCondition,
      include: {
        model: Users,
      },
    });
    const changed = await roomStatusSync(rows);
    let changedValue = await getResolvedValues(changed);
    const zoomlive = await zoomLiveMeetingStatus(zoomToken, rows);
    const totalPages = Math.ceil(count / perPage);
    const filtered = changedValue?.map((val) => {
      delete val.user.dataValues.password;
      return val;
    });
    res.status(200).send({
      data: filtered,
      pagination: {
        currentPage: page,
        lastPage: totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const zoomToken = req.zoomToken;
    // Find all rooms that match the given user ID
    let matchingRooms = await Rooms.findAll({
      where: { user_id: userId },
    });

    // Get rooms shared with the user
    const sharedRooms = await Shared_accesses.findAll({
      where: {
        user_id: userId,
      },
      include: {
        model: Rooms,
        include: {
          model: Users, // Include the Users model
          attributes: ["name", "expired"], // Specify the attributes you want to fetch
        },
      },
    });

    // Extract the room data from the sharedRooms (through the association)
    const sharedRoomData = sharedRooms.map((item) => item.room); // or item.Rooms depending on your alias

    // Combine both
    const combinedRooms = [...matchingRooms, ...sharedRoomData];

    for (const roomsVal of matchingRooms) {
      // Fetch the total duration for each room's meeting_id
      const result = await Analytics_dashboard.findAll({
        attributes: [
          "user_id",
          [sequelize.fn("SUM", sequelize.col("duration")), "total_duration"],
        ],
        where: {
          user_id: userId,
          meeting_id: roomsVal.dataValues.meeting_id,
        },
        group: ["user_id"],
      });

      // Update the room with the total duration spent
      roomsVal.room_duration = result?.[0]?.dataValues?.total_duration || 0;
      await roomsVal.save();
    }

    const changed = await roomStatusSync(combinedRooms);
    let changedValue = await getResolvedValues(changed);
    const zoomlive = await zoomLiveMeetingStatus(zoomToken, matchingRooms);

    if (sharedRooms.length > 0) {
      // Map shared rooms and fetch user information
      const values = sharedRooms.map((val) => {
        const retObj = {
          ...val.room?.dataValues,
          shared_owner: val.room?.user_id,
        };
        return retObj;
      });
      matchingRooms = [...matchingRooms, ...values];
    }
    const roomsWithMeetings = await Promise.all(
      (matchingRooms || []).map(async (room) => {
        const existingMeetings = await Schedule_room_meeting.findAll({
          where: { room_id: room.id },
          raw: true, // Ensures that only pure JSON data is returned
        });

        return {
          ...(room.get ? room.get({ plain: true }) : room),
          existingMeetings: existingMeetings.length > 0 ? existingMeetings : [],
        };
      })
    );
    if (roomsWithMeetings.length > 0) {
      res.status(201).send({ data: roomsWithMeetings });
    } else {
      res.status(201).send([]);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllRoomSettings = async (req, res) => {
  try {
    const room_id = req?.params?.id;
    const roomSettings = await Room_meeting_options.findAll({
      where: {
        room_id: room_id,
      },
      include: [
        {
          model: Rooms,
        },
        {
          model: Meeting_options,
        },
      ],
    });

    if (roomSettings.length > 0) {
      res.status(201).send({ data: roomSettings });
    } else {
      res.status(201).send([]);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const updateRoomSettings = async (req, res) => {
//   try {
//     const room_meeting_id = req?.params?.id;
//     const { value } = req?.body;
//     const roomSettings = await Room_meeting_options.findByPk(room_meeting_id);
//     if (value) {
//       roomSettings.value = value;
//       await roomSettings.save();

//       return res.json({ message: " The room settings has been updated" });
//     }
//     res.json({ message: " The room settings has been not updated" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const updateRoomSettings = async (req, res) => {
  try {
    const room_meeting_id = req?.params?.id;
    const { value } = req?.body;

    if (!room_meeting_id || value === undefined) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const roomSettings = await Room_meeting_options.findByPk(room_meeting_id, {
      include: [{ model: Rooms }, { model: Meeting_options }],
    });

    if (!roomSettings) {
      return res.status(404).json({ message: "Room settings not found" });
    }

    roomSettings.value = value;
    await roomSettings.save();

    const zoomSettingMap = {
      muteOnStart: "mute_upon_entry",
      glAnyoneCanStart: "join_before_host",
    };

    if (roomSettings.room?.provider === "zoom") {
      const settingKey = zoomSettingMap[roomSettings.meeting_option?.name];

      if (settingKey) {
        const zoomOptions = await Zoom_meeting_options.findByPk(
          roomSettings.room.zoom_meeting_setting_id
        );

        if (zoomOptions) {
          await axios.patch(
            `https://api.zoom.us/v2/meetings/${zoomOptions.meeting_id}`,
            { settings: { [settingKey]: value === "true" } },
            {
              headers: {
                Authorization: `Bearer ${req.zoomToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    }

    return res.json({ message: "Room settings have been updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const editRoom = async (req, res) => {
//   try {
//     const { id: roomId, name: newName } = req.body;
//     const filename = req?.file?.filename;

//     const roomToUpdate = await Rooms.findByPk(roomId);

//     if (!roomToUpdate) {
//       return res
//         .status(404)
//         .json({ message: "Room not found with the given ID." });
//     }

//     if (newName) {
//       roomToUpdate.name = newName;
//     }

//     // Handle cover image update
//     if (filename) {
//       const oldImagePath = `upload/Images/${roomToUpdate.cover_image_url}`;
//       const newImagePath = `upload/Images/${filename}`;

//       if (roomToUpdate.cover_image_url) {
//         // Remove the old image file asynchronously
//         fs.unlink(oldImagePath, (err) => {
//           if (err) {
//             console.error("Error deleting old image:", err.message);
//           }
//         });
//       }

//       roomToUpdate.cover_image_url = filename;
//     }

//     // Save changes to the database
//     await roomToUpdate.save();

//     res.status(200).json({ message: "Successfully updated", success: true });
//   } catch (error) {
//     console.error("Error updating room:", error.message);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

const editRoom = async (req, res) => {
  try {
    const { id: roomId, name: newName, provider } = req.body;
    const filename = req?.file?.filename;
    const zoomToken = req.zoomToken;

    const roomToUpdate = await Rooms.findByPk(roomId);
    if (!roomToUpdate) {
      return res
        .status(404)
        .json({ message: "Room not found with the given ID." });
    }

    // Update room name if provided
    if (newName) roomToUpdate.name = newName;

    // Handle cover image update
    if (filename) {
      if (roomToUpdate.cover_image_url) {
        const oldImagePath = `upload/Images/${roomToUpdate.cover_image_url}`;
        fs.promises
          .unlink(oldImagePath)
          .catch((err) =>
            console.error("Error deleting old image:", err.message)
          );
      }
      roomToUpdate.cover_image_url = filename;
    }

    // Handle provider changes
    if (provider) {
      if (
        roomToUpdate.provider === "zoom" &&
        roomToUpdate.zoom_meeting_setting_id
      ) {
        try {
          const zoomDetails = await Zoom_meeting_options.findByPk(
            roomToUpdate.zoom_meeting_setting_id
          );
          if (zoomDetails) {
            await deleteZoomMeeting({
              zoomMeetingId: zoomDetails.meeting_id,
              zoomToken,
            });

            // **Step 1: Set zoom_meeting_setting_id to NULL and save room**
            roomToUpdate.zoom_meeting_setting_id = null;
            roomToUpdate.provider = "bbb";
            await roomToUpdate.save();

            // **Step 2: Now delete the Zoom details**
            await zoomDetails.destroy();
          }
        } catch (error) {
          console.error(
            "Failed to delete Zoom meeting:",
            error.response?.data || error.message
          );
        }
      } else if (provider === "zoom") {
        const meetingData = await createZoomMeeting({
          topic: newName || roomToUpdate.name,
          zoomToken,
        });

        if (meetingData) {
          const zoomMeetingDetails = await Zoom_meeting_options.create({
            meeting_id: meetingData.id,
            password: meetingData.password,
          });

          roomToUpdate.zoom_meeting_setting_id = zoomMeetingDetails.id;
          roomToUpdate.provider = "zoom";
        }
      }
    }

    // Save final room data if not already saved
    await roomToUpdate.save();

    res.status(200).json({ message: "Successfully updated", success: true });
  } catch (error) {
    console.error("Error updating room:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeRoom = async (req, res) => {
  try {
    const roomId = req?.params?.id;
    if (!roomId) {
      return res
        .status(400)
        .json({ message: "Room ID is required", success: false });
    }

    const scheduleMeetingExists = await Schedule_room_meeting.count({
      where: { room_id: roomId },
    });

    if (scheduleMeetingExists > 0) {
      return res.status(200).json({
        message:
          "To delete this room, you must first delete its scheduled meetings.",
        success: false,
      });
    }

    // Delete associated records in parallel
    await Promise.all([
      Room_meeting_options.destroy({ where: { room_id: roomId } }),
      Shared_accesses.destroy({ where: { room_id: roomId } }),
    ]);

    const room = await Rooms.findOne({ where: { id: roomId } });
    if (!room) {
      return res
        .status(200)
        .json({ message: "Room not found.", success: false });
    }

    if (room.cover_image_url) {
      const filePath = `upload/Images/${room.cover_image_url}`;
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    if (room.provider === "zoom" && room.zoom_meeting_setting_id) {
      try {
        const zoomDetails = await Zoom_meeting_options.findOne({
          where: { id: room.zoom_meeting_setting_id },
        });

        if (zoomDetails) {
          await axios.delete(
            `https://api.zoom.us/v2/meetings/${zoomDetails.meeting_id}`,
            {
              headers: {
                Authorization: `Bearer ${req.zoomToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete Zoom meeting:",
          error.response?.data || error.message
        );
      }
    }

    // Delete room and associated Zoom meeting settings in parallel
    const [deletedRooms, deletedZoomMeeting] = await Promise.all([
      Rooms.destroy({ where: { id: roomId } }),
      Zoom_meeting_options.destroy({
        where: { id: room.zoom_meeting_setting_id },
      }),
    ]);

    if (deletedRooms > 0) {
      return res
        .status(200)
        .json({ message: "Successfully deleted", success: true });
    }

    res
      .status(404)
      .json({ message: "Room not found with the given ID.", success: false });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const createSharedAccess = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userData = await Users.findOne({ where: { id: userId } });
    const requestData = req.body;

    for (const data of requestData) {
      const { user_id, room_id } = data;
      const roomData = {
        user_id,
        room_id,
      };
      const room = await Rooms.findOne({ where: { id: room_id } });
      const title = "Room Access Shared";
      const message = `User ${userData?.name} has shared access to Room ${room?.name} with you.`;
      const type = "Room Access";
      await createNotification(message, title, user_id, type);

      // Assuming Shared_accesses.create is an asynchronous function
      const createdAccess = await Shared_accesses.create(roomData);
      // sharedAccesses.push(createdAccess);
    }

    res.status(201).json({ message: "Room has been shared.", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSharedAccess = async (req, res) => {
  try {
    const id = req?.params?.id;
    const share_access_data = await Shared_accesses.findOne({
      where: { id: id },
    });
    const userData = await Users.findOne({
      where: { id: share_access_data?.user_id },
    });
    const room = await Rooms.findOne({
      where: { id: share_access_data?.room_id },
    });
    const title = "Room Access Removed";
    const message = `Your access to Room ${room?.name} has been removed.`;
    const type = "Room Access";
    await createNotification(message, title, userData?.id, type);
    await Shared_accesses.destroy({
      where: { id: id },
    });
    res.status(201).json({ message: " Room has been unshared", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSharedAccessByRoomId = async (req, res) => {
  try {
    const id = req?.params?.id;
    const sharedAccess = await Shared_accesses.findAll({
      where: { room_id: id },
      include: {
        model: Users,
      },
    });
    res.status(201).json({ message: "success", data: sharedAccess });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const id = req?.params?.id;
    const zoomToken = req.zoomToken;
    const roomToUpdate = await Rooms.findOne({ where: { friendly_id: id } });
    const changed = await roomStatusSync([roomToUpdate]);
    let changedValue = await getResolvedValues(changed);
    const zoomlive = await zoomLiveMeetingStatus(zoomToken, [roomToUpdate]);
    if (roomToUpdate) {
      res.status(201).json({ message: "success", data: roomToUpdate });
    } else {
      res.status(201).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateAccessCode = async (req, res) => {
  try {
    const room_meeting_id = req?.params?.id;
    const roomSettings = await Room_meeting_options.findByPk(room_meeting_id);
    const accesscode = generateUniqueId({
      length: 6,
    });
    if (accesscode) {
      roomSettings.value = accesscode.toString();
      await roomSettings.save();
      return res.json({ message: "A new access code has been generated" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const DeleteAccessCode = async (req, res) => {
  try {
    const room_meeting_id = req?.params?.id;
    const roomSettings = await Room_meeting_options.findByPk(room_meeting_id);
    if (roomSettings) {
      roomSettings.value = "false";
      await roomSettings.save();
      return res.json({ message: "The access code has been deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserBy_id = async (req, res) => {
  try {
    const settings = {};
    const id = req?.params?.id;
    const room = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });
    if (room) {
      const roomSettings = await Room_meeting_options.findAll({
        where: {
          room_id: room.id,
        },
        include: [
          {
            model: Meeting_options,
          },
        ],
      });
      roomSettings.forEach((item) => {
        settings[item?.meeting_option?.name] = item.value;
      });

      return res.json({ data: { room, settings } });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchUser = async (req, res) => {
  const name = req.body.name;
  const roomid = req.body.RoomId;
  const userId = req.user.user_id;
  let excludedUserIds = [userId];
  try {
    const sharedAccess = await Shared_accesses.findAll({
      where: { room_id: roomid },
    });
    const validPlans = await Pricing.findAll({
      where: {
        sharedRoomAccess: "true",
      },
    });
    if (!validPlans?.length) {
      res.json({ message: "No eligible users found", success: false });
    }
    const roleWithoutAdmin = await Roles.findAll({
      where: {
        name: {
          [Op.notIn]: ["Administrator", "Super Admin"],
        },
      },
    });
    if (!roleWithoutAdmin?.length) {
      res.json({ message: "No users found", success: false });
    }
    const planIds = validPlans?.map((pv) => pv?.id);
    const rolesIds = roleWithoutAdmin?.map((pv) => pv?.id);

    // Add user IDs from sharedAccess to the excluded list
    if (sharedAccess && sharedAccess.length > 0) {
      // Extract user_id from each record and add to the array
      const userIdsFromSharedAccess = sharedAccess.map(
        (record) => record.user_id
      );
      excludedUserIds = excludedUserIds.concat(userIdsFromSharedAccess);
    }

    const users = await Users.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              // [Op.like]: `%${name}%`,
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            email: {
              // [Op.like]: `%${name}%`,
              [Op.iLike]: `%${name}%`,
            },
          },
        ],
        // subscription_id: {
        //   [Op.in]: planIds,
        // },
        role_id: {
          [Op.in]: rolesIds,
        },
        // id: {
        //   [Op.ne]: userId, // Exclude the specified user ID
        // },
        id: {
          [Op.not]: excludedUserIds, // Exclude specified user IDs
        },
      },
      include: [
        { model: Pricing, as: "subscription" },
        { model: Roles, as: "role" },
      ],
    });
    if (users?.length > 0) {
      res.json({ message: "success", data: users, success: true });
    } else {
      res.json({ message: "No users found", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for users" });
  }
};
const shareRoom = async (req, res) => {
  try {
    const { email, url, room } = req.body;
    const name = ["Terms", "PrivacyPolicy"];
    let termsURL;
    let privacyURL;
    const siteSettingsValues = await Site_settings.findAll({
      include: [
        {
          model: Settings,
          where: {
            name: {
              [Op.in]: name,
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
    if (email) {
      const guestEmails = email.split(",").map((email) => email.trim());

      Promise.all(
        guestEmails.map((email) => {
          return SharedRooms(email, url, room, termsURL, privacyURL);
        })
      );

      // await SharedRooms(email, url, room, termsURL, privacyURL);
    }
    const invitation = await Invitations.create({ email, provider: "email" });
    res.json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const scheduleMeeting = async (req, res) => {
//   try {
//     const userId = req.user.user_id; // Extract user ID
//     const scheduleDetails = req.body;

//     // Validate required fields
//     const {
//       public_view,
//       title,
//       description,
//       startDate,
//       endDate,
//       guestEmail,
//       url,
//       roomid,
//       price,
//     } = scheduleDetails;

//     if (!title || !startDate || !endDate || !url || !roomid) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     // Check if the room exists
//     const existingRoom = await Rooms.findOne({ where: { id: roomid } });
//     if (!existingRoom) {
//       return res
//         .status(404)
//         .json({ message: "The specified room does not exist." });
//     }

//     // Prepare meeting data
//     const meetingData = {
//       title,
//       startDate,
//       endDate,
//       url,
//       room_id: existingRoom.id,
//       public_view,
//       price,
//       user_id: userId,
//     };

//     if (description) meetingData.description = description;
//     if (guestEmail) meetingData.guestEmail = guestEmail;

//     // Create the scheduled meeting
//     const newMeeting = await Schedule_room_meeting.create(meetingData);

//     // Send email notifications to guests if provided
//     if (guestEmail && newMeeting) {
//       const guestEmails = guestEmail.split(",").map((email) => email.trim());

//       // Send emails in parallel
//       await Promise.all(
//         guestEmails.map((email) =>
//           ScheduleEmail({
//             title,
//             description,
//             startDate,
//             endDate,
//             guestEmail: email,
//             url: `${url}&scheduleId=${newMeeting.id}`, // Include meeting ID in URL
//             public_view,
//             price,
//           })
//         )
//       );
//     }

//     return res.json({
//       message: "Meeting scheduled successfully",
//       meeting: newMeeting,
//     });
//   } catch (error) {
//     console.error("Error scheduling meeting:", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const scheduleMeeting = async (req, res) => {
  try {
    const userId = req.user.user_id; // Extract user ID
    const scheduleDetails = req.body;

    // Validate required fields
    const {
      public_view,
      title,
      description,
      startDate,
      endDate,
      guestEmail,
      url,
      roomid,
      price,
    } = scheduleDetails;

    if (!title || !startDate || !endDate || !url || !roomid) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Convert the input date format to IST timezone
    const startDateIST = moment.tz(
      startDate,
      "ddd, MMM D, YYYY, h:mm A",
      "Asia/Kolkata"
    );
    const endDateIST = moment.tz(
      endDate,
      "ddd, MMM D, YYYY, h:mm A",
      "Asia/Kolkata"
    );

    if (!startDateIST.isValid() || !endDateIST.isValid()) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Check if the room exists
    const existingRoom = await Rooms.findOne({ where: { id: roomid } });
    if (!existingRoom) {
      return res
        .status(404)
        .json({ message: "The specified room does not exist." });
    }

    // Check for any meeting that has the same start time
    const sameStartTimeMeeting = await Schedule_room_meeting.findOne({
      where: {
        room_id: roomid,
        startDate: startDateIST.format("ddd, MMM D, YYYY, h:mm A"),
      },
    });

    if (sameStartTimeMeeting) {
      return res.json({
        message:
          "A meeting is already scheduled at this start time. Please choose a later start time.",
        success: false,
      });
    }

    // Check if the new meeting starts before an existing meeting has ended
    const overlappingMeeting = await Schedule_room_meeting.findOne({
      where: {
        room_id: roomid,
        startDate: {
          [Op.lt]: endDateIST.format("ddd, MMM D, YYYY, h:mm A"),
        },
        endDate: {
          [Op.gt]: startDateIST.format("ddd, MMM D, YYYY, h:mm A"),
        },
      },
    });

    if (overlappingMeeting) {
      return res.json({
        message:
          "A meeting is already scheduled during this time. The new meeting can only start after the first meeting ends.",
        success: false,
      });
    }

    // Prepare meeting data
    const meetingData = {
      title,
      startDate: startDateIST.format("ddd, MMM D, YYYY, h:mm A"),
      endDate: endDateIST.format("ddd, MMM D, YYYY, h:mm A"),
      url,
      room_id: existingRoom.id,
      public_view,
      price,
      user_id: userId,
    };

    if (description) meetingData.description = description;
    if (guestEmail) meetingData.guestEmail = guestEmail;

    // Create the scheduled meeting
    const newMeeting = await Schedule_room_meeting.create(meetingData);

    // Send email notifications to guests if provided
    if (guestEmail && newMeeting) {
      const guestEmails = guestEmail.split(",").map((email) => email.trim());

      await Promise.all(
        guestEmails.map((email) =>
          ScheduleEmail({
            title,
            description,
            startDate,
            endDate,
            guestEmail: email,
            url: `${url}&scheduleId=${newMeeting.id}`,
            public_view,
            price,
          })
        )
      );
    }

    return res.json({
      message: "Meeting scheduled successfully",
      success: true,
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("Error scheduling meeting:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getScheduleMeeting = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const rooms = await Rooms.findAll({
      where: {
        user_id: userId,
      },
      order: [
        ["online", "DESC"],
        ["created_at", "DESC"],
      ],
    });

    for (const roomsVal of rooms) {
      const result = await Analytics_dashboard.findAll({
        attributes: [
          "user_id",
          [sequelize.fn("SUM", sequelize.col("duration")), "total_duration"],
        ],
        where: {
          user_id: userId,
          meeting_id: roomsVal.dataValues.meeting_id,
        },
        group: ["user_id"],
      });

      roomsVal.room_duration = result?.[0]?.dataValues?.total_duration || 0;

      await roomsVal.save();
    }

    const roomsWithMeetings = [];

    for (const room of rooms) {
      const existingMeetings = await Schedule_room_meeting.findAll({
        where: {
          room_id: room.id,
        },
      });

      const roomWithMeetingInfo = {
        ...room.toJSON(),
        existingMeetings: existingMeetings.length > 0 ? existingMeetings : null,
      };

      roomsWithMeetings.push(roomWithMeetingInfo);
    }

    res.status(200).json({ data: roomsWithMeetings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSingleScheduleMeeting = async (req, res) => {
  try {
    const scheduleId = req?.params?.id;
    const existSchedule = await Schedule_room_meeting.findOne({
      where: {
        id: scheduleId,
      },
    });
    if (existSchedule) {
      res.status(200).json({ data: existSchedule, message: "success" });
    } else {
      res.status(200).json({ message: " Schedule Meeting does not exist " });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const updateScheduleMeeting = async (req, res) => {
//   try {
//     const scheduleId = req.params.id;
//     const updatedMeetingData = req.body;

//     const existSchedule = await Schedule_room_meeting.findOne({
//       where: {
//         id: scheduleId,
//       },
//     });

//     if (existSchedule) {
//       await existSchedule.update(updatedMeetingData);

//       await existSchedule.update({ notifications: [] });
//       res.status(200).json({
//         message: "ScheduleMeeting updated successfully",
//         success: true,
//       });
//     } else {
//       res.status(404).json({ message: "Schedule Meeting does not exist" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const updateScheduleMeeting = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const updatedMeetingData = req.body;

    const existSchedule = await Schedule_room_meeting.findOne({
      where: { id: scheduleId },
    });

    if (!existSchedule) {
      return res
        .status(404)
        .json({ message: "Schedule Meeting does not exist" });
    }

    const { startDate, endDate } = updatedMeetingData;

    // Convert to IST timezone
    const startDateIST = moment.tz(
      startDate,
      "ddd, MMM D, YYYY, h:mm A",
      "Asia/Kolkata"
    );
    const endDateIST = moment.tz(
      endDate,
      "ddd, MMM D, YYYY, h:mm A",
      "Asia/Kolkata"
    );

    if (!startDateIST.isValid() || !endDateIST.isValid()) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Check if another meeting has the same start time
    const sameStartMeeting = await Schedule_room_meeting.findOne({
      where: {
        startDate: startDateIST.format("ddd, MMM D, YYYY, h:mm A"),
        id: { [Op.ne]: scheduleId }, // Exclude the current meeting
      },
    });

    if (sameStartMeeting) {
      return res.status(200).json({
        message:
          "Another meeting is already scheduled at this start time. Please choose a different time.",
        success: false,
      });
    }

    // Check if the updated meeting overlaps with another meeting
    const overlappingMeeting = await Schedule_room_meeting.findOne({
      where: {
        startDate: { [Op.lt]: endDateIST.format("ddd, MMM D, YYYY, h:mm A") },
        endDate: { [Op.gt]: startDateIST.format("ddd, MMM D, YYYY, h:mm A") },
        id: { [Op.ne]: scheduleId }, // Exclude the current meeting
      },
    });

    if (overlappingMeeting) {
      return res.status(200).json({
        message:
          "The updated meeting time conflicts with another scheduled meeting. Please choose a different time.",
        success: false,
      });
    }

    // Update meeting details
    await existSchedule.update(updatedMeetingData);
    await existSchedule.update({ notifications: [] });

    return res.status(200).json({
      message: "ScheduleMeeting updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteScheduleMeeting = async (req, res) => {
  try {
    const scheduleId = req.params.id;

    // Check if the schedule exists
    const existSchedule = await Schedule_room_meeting.findOne({
      where: {
        id: scheduleId,
      },
    });

    if (existSchedule) {
      // Delete the schedule
      await existSchedule.destroy();

      res.status(200).json({
        message: "Scheduled meeting deleted successfully",
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Scheduled meeting does not exist",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

const feedback = async (req, res) => {
  try {
    const { email, name, message } = req.body;
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
    await FeedbackEmail(email, message, name, termsURL, privacyURL);
    await AcknowledgmentMail(email, name);
    const invitation = await Feedback.create({
      name,
      email,
      message,
      date: new Date().toISOString(),
    });

    // Respond with the created invitation
    res
      .status(200)
      .send({ success: true, message: "Feedback sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const live_Room_Records = async (req, res) => {
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
      // Assuming user is an object with online property
      delete val.user.dataValues.password;
      return val.online === true;
    });

    if (filtered && filtered.length > 0) {
      const getFormatPromises = filtered.map(async (val) => {
        const getFormat = await Formats.findAll({
          include: [
            {
              model: Recordings,
              where: {
                room_id: val.id,
              },
              include: {
                model: Rooms,
                include: {
                  model: Users,
                  attributes: ["name", "email"],
                },
              },
            },
          ],
        });
        return getFormat;
      });

      const getFormatResults = await Promise.all(getFormatPromises);

      const resultArray = getFormatResults.filter(
        (getFormat) => getFormat.length > 0
      );

      if (resultArray.length > 0) {
        res.status(200).send({ data: resultArray, message: "success" });
      } else {
        res
          .status(200)
          .send({ data: [], message: "No online rooms with recordings" });
      }
    } else {
      res.status(200).send({ data: [], message: "No online rooms" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const totalCount = async (req, res) => {
  try {
    const zoomToken = req.zoomToken;
    const user = await Users.findAll();
    const rooms = await Rooms.findAll({
      include: {
        model: Users,
      },
    });
    const changed = await roomStatusSync(rooms);
    let changedValue = await getResolvedValues(changed);
    const zoomlive = await zoomLiveMeetingStatus(zoomToken, rooms);
    const onlineRooms = changedValue?.filter((val) => {
      delete val.user.dataValues.password;
      return val.online === true;
    });

    const responseArray = [
      { name: "Users", count: user.length || 0 },
      { name: "Online Rooms", count: onlineRooms.length || 0 },
      { name: "Total Rooms", count: rooms.length || 0 },
    ];
    res.status(200).send({ data: responseArray, message: "success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getScheduleMeetingNotification = async (req, res) => {
  try {
    let unreadCount = 0;
    const userId = req.user.user_id;
    const rooms = await Rooms.findAll({
      where: {
        user_id: userId,
      },
    });
    if (rooms) {
      let allMeetings = [];
      for (const room of rooms) {
        // Find all Schedule_room_meeting instances
        const meetings = await Schedule_room_meeting.findAll({
          where: {
            room_id: room.id,
          },
        });
        allMeetings = allMeetings.concat(meetings);
        // Current time
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 5); // Add 5 hours
        currentTime.setMinutes(currentTime.getMinutes() + 30);

        // Function to check if a meeting starts within the next 10 minutes
        for (const meeting of meetings) {
          // Convert meeting start time to Date object
          const startTime = new Date(meeting.startDate);
          startTime.setHours(startTime.getHours() + 5); // Add 5 hours
          startTime.setMinutes(startTime.getMinutes() + 30);
          const endTime = new Date(meeting.endDate);
          endTime.setHours(endTime.getHours() + 5); // Add 5 hours
          endTime.setMinutes(endTime.getMinutes() + 30);

          // Calculate the difference in milliseconds between current time and meeting start time
          const timeDifference = startTime - currentTime;

          if (timeDifference > 0 && timeDifference <= 600000) {
            const existingNotification = meeting.notifications;
            if (existingNotification.read === false) {
              unreadCount++;
            }

            // Check if there is no existing notification or if the existing notification is different
            if (existingNotification.length <= 0) {
              const notification = {
                title: "Scheduled Meeting Soon",
                message: `Your meeting in ${meeting.title} is about to start in less than 10 minutes`,
                read: false, // Set read to false initially
              };
              unreadCount++;
              await meeting.update({ notifications: notification });
            }
          } else {
            if (endTime < currentTime) {
              await meeting.destroy();
              await meeting.update({ notifications: [] });
            }
          }
        }
      }
      // Send response
      res.status(200).json({
        message: "Notifications added successfully",
        data: { allMeetings, unreadCount },
      });
    } else {
      res.status(200).json({
        message: "room not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateNotificationReadStatus = async (req, res) => {
  try {
    const { meetingIds } = req.body; // Assuming meetingIds is an array of meeting IDs

    // Find meetings by IDs
    const meetings = await Schedule_room_meeting.findAll({
      where: {
        id: meetingIds, // Assuming the primary key of the meeting model is 'id'
      },
    });

    if (meetings.length === 0) {
      return res.status(404).json({ error: "Meetings not found" });
    }

    // Update the read status of notifications for each meeting
    for (const meeting of meetings) {
      if (meeting.notifications && meeting.notifications.read === false) {
        await meeting.update({
          notifications: {
            ...meeting.notifications,
            read: true,
          },
        });
      }
    }

    // Send response
    res.status(200).json({
      message: "Notification read status updated successfully",
      data: meetings,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const id = req.user.user_id;
    const user = await Users.findOne({ where: { id } });
    if (email && user?.name) {
      await InviteNewUser(email, user?.name);
      res.json({ message: "success" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const scheduledMeetings = async (req, res) => {
  try {
    const { roomId, scheduleMeeting_Id } = req.body;

    const room = await Rooms.findOne({ where: { friendly_id: roomId } });
    if (!room) {
      return res.json({ message: "No Room found", success: false });
    }

    let currentMeeting = null;
    let nextMeeting = null;

    if (scheduleMeeting_Id) {
      const currentDateIST = moment().tz("Asia/Kolkata");
      const Meeting = await Schedule_room_meeting.findOne({
        where: { id: scheduleMeeting_Id, room_id: room?.id },
      });
      if (Meeting) {
        const endDateIST = moment(Meeting.endDate).tz("Asia/Kolkata");

        if (endDateIST.isValid() && endDateIST.isBefore(currentDateIST)) {
          await Schedule_room_meeting.destroy({
            where: { id: Meeting?.id },
          });
        }
      } else {
        return res.json({ message: "Meeting not found", success: false });
      }

      const specifiedMeeting = await Schedule_room_meeting.findOne({
        where: { id: scheduleMeeting_Id, room_id: room?.id },
      });

      if (specifiedMeeting) {
        currentMeeting = specifiedMeeting;
        return res.json({
          message: "success",
          currentMeeting,
          nextMeeting: null, // No need to check next meeting if specifiedMeeting is current
        });
      } else {
        return res.json({ message: "Meeting not found", success: false });
      }
    }

    const scheduleRoomMeetings = await Schedule_room_meeting.findAll({
      where: { room_id: room?.id },
    });

    const currentDateIST = moment().tz("Asia/Kolkata");

    scheduleRoomMeetings.forEach((meeting) => {
      const startDateIST = moment(meeting.startDate).tz("Asia/Kolkata");
      const endDateIST = moment(meeting.endDate).tz("Asia/Kolkata");

      if (
        startDateIST.isValid() &&
        endDateIST.isValid() &&
        currentDateIST.isAfter(startDateIST) &&
        currentDateIST.isBefore(endDateIST)
      ) {
        currentMeeting = meeting;
      }

      if (
        startDateIST.isValid() &&
        endDateIST.isValid() &&
        startDateIST.isAfter(currentDateIST)
      ) {
        if (
          !nextMeeting ||
          startDateIST.isBefore(
            moment(nextMeeting.startDate).tz("Asia/Kolkata")
          )
        ) {
          nextMeeting = meeting;
        }
      }
    });

    if (currentMeeting) {
      currentMeeting.startDateIST = moment(currentMeeting.startDate)
        .tz("Asia/Kolkata")
        .format("ddd, MMM D, YYYY, h:mm A");
      currentMeeting.endDateIST = moment(currentMeeting.endDate)
        .tz("Asia/Kolkata")
        .format("ddd, MMM D, YYYY, h:mm A");
    }

    if (nextMeeting) {
      nextMeeting.startDateIST = moment(nextMeeting.startDate)
        .tz("Asia/Kolkata")
        .format("ddd, MMM D, YYYY, h:mm A");
      nextMeeting.endDateIST = moment(nextMeeting.endDate)
        .tz("Asia/Kolkata")
        .format("ddd, MMM D, YYYY, h:mm A");
    }

    return res.json({
      message: "success",
      currentMeeting: currentMeeting || null,
      nextMeeting: nextMeeting || null,
    });
  } catch (error) {
    console.error("Error fetching scheduled meetings:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getScheduledMeetingonly = async (req, res) => {
  try {
    const currentDateIST = moment().tz("Asia/Kolkata");
    const date = req.query.date || null;
    const { filter, name, tag } = req.query;
    const queryConditions = { public_view: "true" };
    const roomQueryCondition = {};

    if (filter === "free") {
      queryConditions.price = null;
    } else if (filter === "paid") {
      queryConditions.price = { [Op.not]: null };
    }

    if (tag === "Online Class") {
      roomQueryCondition.room_type = "online_class";
    } else if (tag === "Webinar") {
      roomQueryCondition.room_type = "webinar";
    } else if (tag === "Training") {
      roomQueryCondition.room_type = "training";
    }

    if (name?.length > 0) {
      queryConditions.title = { [Op.iLike]: `%${name}%` };
    }

    const scheduledMeetings = await Schedule_room_meeting.findAll({
      where: { public_view: "true" },
      include: {
        model: Rooms,
      },
    });

    if (scheduledMeetings && scheduledMeetings.length > 0) {
      const meetingsToDelete = [];

      for (const meeting of scheduledMeetings) {
        const endDateIST = moment.tz(
          meeting.endDate,
          "ddd, MMM D, YYYY, h:mm A",
          "Asia/Kolkata"
        );

        if (endDateIST.isValid() && endDateIST.isBefore(currentDateIST)) {
          meetingsToDelete.push(meeting.id);
        }
      }

      if (meetingsToDelete.length > 0) {
        await Schedule_room_meeting.destroy({
          where: { id: meetingsToDelete },
        });
      }
      const updatedScheduledMeetings = await Schedule_room_meeting.findAll({
        where: queryConditions,
        include: [
          {
            model: Rooms,
            where: roomQueryCondition,
            include: {
              model: Users,
              attributes: ["name", "avatar"],
            },
          },
        ],
      });
      // Apply filter logic only if a valid filter is provided
      const filteredScheduledMeetings =
        date?.length > 0
          ? updatedScheduledMeetings.filter((meeting) => {
              const startDateIST = moment.tz(
                meeting.startDate,
                "ddd, MMM D, YYYY, h:mm A",
                "Asia/Kolkata"
              );

              if (!startDateIST.isValid()) return false;

              switch (date) {
                case "Today":
                  return startDateIST.isSame(currentDateIST, "day");
                case "This Week":
                  return startDateIST.isSame(currentDateIST, "week");
                case "This Month":
                  return startDateIST.isSame(currentDateIST, "month");
                default:
                  return false;
              }
            })
          : updatedScheduledMeetings;

      return res.json({
        message: "success",
        success: true,
        data: filteredScheduledMeetings,
      });
    } else {
      return res.json({ message: "no upcoming meetings", success: false });
    }
  } catch (error) {
    console.error("Error fetching scheduled meetings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const checkMeetingPayment = async (req, res) => {
  const { user_id, schedule_id } = req.body;

  try {
    const payment = await RoomPayments.findOne({
      where: {
        user_id,
        schedule_id,
        payment_status: "paid",
      },
    });

    if (payment) {
      res.json({ paymentStatus: true });
    } else {
      res.json({ paymentStatus: false });
    }
  } catch (error) {
    console.error("Error checking payment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking the payment status" });
  }
};

const getRoomScheduledMeetings = async (req, res) => {
  try {
    const roomid = req.params.id;
    const getScheduleMeeting = await Schedule_room_meeting.findAll({
      where: {
        room_id: roomid,
      },
    });
    if (getScheduleMeeting) {
      res.json({ data: getScheduleMeeting, success: true });
    } else {
      res.json({ message: "no Schedule Meetings", success: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  createRoom,
  editRoom,
  removeRoom,
  getRooms,
  getAllRooms,
  getAllRoomSettings,
  updateRoomSettings,
  createSharedAccess,
  deleteSharedAccess,
  getSharedAccessByRoomId,
  getRoomById,
  generateAccessCode,
  DeleteAccessCode,
  getUserBy_id,
  searchUser,
  shareRoom,
  scheduleMeeting,
  getScheduleMeeting,
  getSingleScheduleMeeting,
  updateScheduleMeeting,
  feedback,
  live_Room_Records,
  totalCount,
  getScheduleMeetingNotification,
  updateNotificationReadStatus,
  inviteUser,
  scheduledMeetings,
  getScheduledMeetingonly,
  checkMeetingPayment,
  deleteScheduleMeeting,
  getRoomScheduledMeetings,
};
