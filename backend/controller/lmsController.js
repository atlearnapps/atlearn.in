import Meeting_options from "../models/meeting_options.js";
import Room_meeting_options from "../models/room_meeting_options.js";
import Rooms from "../models/rooms.js";
import Rooms_configurations from "../models/rooms_configurations.js";
import Users from "../models/users.js";
import generateUniqueId from "generate-unique-id";

const create_room = async (req, res) => {
    try {
      const roomData = req.body;
      const filename = req?.file?.filename;
  
      // Fetch user ID based on email, if provided
      if (req.body.email) {
        const user = await Users.findOne({ where: { email: req.body.email } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        roomData.user_id = user.id;
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
  
      // Fetch the room configurations for all options
      const roomConfigurations = await Promise.all(
        Object.keys(meetingOptionMap).map(async (name) => {
          return {
            name,
            config: await Rooms_configurations.findOne({
              where: { meeting_option_id: meetingOptionMap[name] },
            }),
          };
        })
      );
  
      // Map the configurations to meeting options
      const roomMeetingOptions = roomConfigurations.map(({ name, config }) => {
        let value = config?.value;
  
        if (name === "guestPolicy") {
          value = value === "true" ? "ASK_MODERATOR" : "ALWAYS_ACCEPT";
        }
  
        if (["glModeratorAccessCode", "glViewerAccessCode"].includes(name)) {
          value = value === "true"
            ? generateUniqueId({ length: 6 })
            : config?.value;
        }
  
        return {
          meeting_option_id: meetingOptionMap[name],
          value,
          room_id: room?.id,
        };
      });
  
      await Room_meeting_options.bulkCreate(roomMeetingOptions);
  
      res.status(201).json({ message: "successfully created", success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  async function updateUserProfile(req, res) {
    const {
      name,
      email,
    } = req.body;
    try {
      const user = await Users.findOne({
        where:{email:email}
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (name) {
        user.name = name;
      }


      await user.save();
      // delete user.dataValues?.password;
      res.json({
        // data: user,
        message: " The user has been updated",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }



  export default {
    create_room,
    updateUserProfile
  }