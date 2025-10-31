import axios from "axios";
import Rooms from "../models/rooms.js";
import Users from "../models/users.js";
import Zoom_meeting_options from "../models/zoom_meeting_options.js";
import { KJUR } from "jsrsasign";
import moment from "moment-timezone";
// import { inNumberArray, isBetween, isRequiredAllOrNone, validateRequest } from "../services/Zoom/validations.js"
import {
  inNumberArray,
  isBetween,
  isRequiredAllOrNone,
  validateRequest,
} from "../services/Zoom/validations.js";
import Room_meeting_options from "../models/room_meeting_options.js";
import Meeting_options from "../models/meeting_options.js";
const baseUrl = process.env.ZOOM_URL;
const ZOOM_API_URL = "https://api.zoom.us/v2/videosdk/sessions";
const ZOOM_SDK_KEY = process.env.ZOOM_MEETING_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_MEETING_SDK_SECRET;

const propValidations = {
  role: inNumberArray([0, 1]),
  expirationSeconds: isBetween(1800, 172800),
};

const schemaValidations = [isRequiredAllOrNone(["meetingNumber", "role"])];

const coerceRequestBody = (body) => ({
  ...body,
  ...["role", "expirationSeconds"].reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: typeof body[cur] === "string" ? parseInt(body[cur]) : body[cur],
    }),
    {}
  ),
});

 const generateZoomSignature = (req, res) => {
  const requestBody = coerceRequestBody(req.body);
  const validationErrors = validateRequest(
    requestBody,
    propValidations,
    schemaValidations
  );

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const { meetingNumber, role, expirationSeconds } = requestBody;
  const iat = Math.floor(Date.now() / 1000);
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MEETING_SDK_SECRET
  );

  return res.json({ signature: sdkJWT });
};

const createZoomMeeting = async (req, res) => {
  try {
    const { topic, start_time, type, duration, timezone, agenda } = req.body;

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        // topic,
        // type,
        // start_time,
        // duration,
        topic,
        type,
        start_time,
        duration,
        timezone,
        agenda,
        settings: {
          host_video: false,
          participant_video: false,
          join_before_host: false,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: "both",
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${req.zoomToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error });
  }
};

const startZoomMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const currentTime = moment.tz("Asia/Kolkata").format("dddd, MMM D, YYYY, h:mm A");
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: [{ model: Users }, { model: Zoom_meeting_options }],
    });

    if (!roomVal) {
      return res
        .status(404)
        .json({ message: "Room not found", success: false });
    }

    const { user, zoom_meeting_option } = roomVal;

    if (!zoom_meeting_option || !user) {
      return res
        .status(400)
        .json({ message: "Meeting or user data missing", success: false });
    }

    const url = `${baseUrl}?meetingNumber=${zoom_meeting_option.meeting_id}&userName=${user.name}&role=1&passWord=${zoom_meeting_option.password}`;
    roomVal.last_session=currentTime;
    await roomVal.save();

    return res.status(200).json({
      message: "Meeting URL successfully created",
      success: true,
      url: url,
    });
  } catch (error) {
    console.error("Error starting Zoom meeting:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// const joinZoomMeeting = async (req, res) => {
//   try {
//     const id = req?.params?.id;
//     const { name } = req.body;
//     const roomVal = await Rooms.findOne({
//       where: { friendly_id: id },
//       include: { model: Zoom_meeting_options },
//     });

//     if (!roomVal) {
//       return res
//         .status(404)
//         .json({ message: "Room not found", success: false });
//     }

//     const { zoom_meeting_option } = roomVal;

//     if (!zoom_meeting_option || !name) {
//       return res
//         .status(400)
//         .json({ message: "Meeting or user data missing", success: false });
//     }
//     const url = `${baseUrl}?meetingNumber=${zoom_meeting_option.meeting_id}&userName=${name}&role=0&passWord=${zoom_meeting_option.password}`;

//     return res.status(200).json({
//       message: "Join meeting URL successfully created",
//       success: true,
//       url: url,
//     });
//   } catch (error) {
//     console.error("Error starting Zoom meeting:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false,
//       error: error.message,
//     });
//   }
// };

const joinZoomMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, access_code } = req.body;

    // Fetch room details with Zoom meeting options
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Zoom_meeting_options },
    });

    if (!roomVal) {
      return res.status(404).json({ message: "Room not found", success: false });
    }

    // Fetch room meeting options
    const roomSettings = await Room_meeting_options.findAll({
      where: { room_id: roomVal.id },
      include: [{ model: Meeting_options }],
    });

    // Validate access code if required
    const viewerPW = roomSettings.find(
      (v) => v?.meeting_option?.name === "glViewerAccessCode"
    )?.value;

    if (viewerPW && viewerPW !== "false" && viewerPW !== access_code) {
      return res.json({ message: "Access code invalid", success: false });
    }

    const { zoom_meeting_option } = roomVal;

    if (!zoom_meeting_option || !name) {
      return res.status(400).json({ message: "Meeting or user data missing", success: false });
    }

    const url = `${baseUrl}?meetingNumber=${zoom_meeting_option.meeting_id}&userName=${encodeURIComponent(name)}&role=0&passWord=${zoom_meeting_option.password}`;

    return res.status(200).json({
      message: "Join meeting URL successfully created",
      success: true,
      url,
    });
  } catch (error) {
    console.error("Error starting Zoom meeting:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


const createZoomSession = async (req,res) => {
  try {
    const { topic } = req.body;

    const response = await axios.post(
      ZOOM_API_URL,
      {
        session_name: topic || "New Video SDK Session",
      },
      {
        headers: {
          // Authorization: `Bearer ${req.zoomToken}`,
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${ZOOM_SDK_KEY}:${ZOOM_SDK_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Error creating session",
    });
  }
}

// const meetingParticiant= async(req,res)=>{
//   const { meetingId } = req.body;
//   try{
//     const response = await axios.get(
//       `https://api.zoom.us/v2/metrics/meetings/${meetingId}/participants`,
//       {
//         headers: {
//           Authorization: `Bearer ${req.zoomToken}`, // Make sure this is a valid JWT or OAuth token
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//   } catch (error) {
//     console.error("Error starting Zoom meeting:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false,
//       error: error.message,
//     });
//   }
// }

// For akartech zoom meeting link creation
 const createZoomMeetingLink = async (req, res) => {
  try {
    const { topic, start_time, type, duration, timezone, agenda, user } = req.body;

    // Step 1: Create Zoom meeting via Zoom API
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic,
        type, // 1: instant meeting, 2: scheduled, 3: recurring with no fixed time, 8: recurring with fixed time
        start_time,
        duration,
        timezone,
        agenda,
        settings: {
          host_video: false,
          participant_video: false,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0, // Automatically approve
          audio: "both",
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${req.zoomToken}`, // Must be a valid Zoom JWT or OAuth token
          "Content-Type": "application/json",
        },
      }
    );

    const zoomMeeting = response.data;

    // Step 2: Build meeting URLs
    const startMeetingUrl = `${baseUrl}?meetingNumber=${zoomMeeting.id}&userName=${encodeURIComponent(
      user || "Host"
    )}&role=1&passWord=${zoomMeeting.password}`;

    const joinMeetingUrl = `${baseUrl}?meetingNumber=${zoomMeeting.id}&role=0&passWord=${zoomMeeting.password}`;

    // Step 3: Return response
    res.status(200).json({
      message: "Zoom meeting created successfully",
      meetingDetails: {
        id: zoomMeeting.id,
        topic: zoomMeeting.topic,
        start_time: zoomMeeting.start_time,
        duration: zoomMeeting.duration,
        timezone: zoomMeeting.timezone,
        password: zoomMeeting.password,
        start_url: zoomMeeting.start_url,
        join_url: zoomMeeting.join_url,
      },
      customLinks: {
        startMeetingUrl,
        joinMeetingUrl,
      },
    });
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to create Zoom meeting",
      error: error.response ? error.response.data : error.message,
    });
  }
};

export default {
  generateZoomSignature,
  createZoomMeeting,
  startZoomMeeting,
  joinZoomMeeting,
  createZoomSession,
  createZoomMeetingLink
};
