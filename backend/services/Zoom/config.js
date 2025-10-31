import axios from "axios";
import Rooms from "../../models/rooms.js";
import Zoom_meeting_options from "../../models/zoom_meeting_options.js";
import Analytics_dashboard from "../../models/analytics_dashboard.js";

// createZoomMeeting

export const createZoomMeeting = async ({
  topic,
  start_time = new Date().toISOString(),
  type = 2,
  duration = 45,
  timezone = "UTC",
  agenda = "",
  zoomToken,
}) => {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
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
          Authorization: `Bearer ${zoomToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteZoomMeeting = async ({ zoomMeetingId, zoomToken }) => {
  try {
    const response = await axios.delete(
      `https://api.zoom.us/v2/meetings/${zoomMeetingId}`,
      {
        headers: {
          Authorization: `Bearer ${zoomToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error delete Zoom meeting:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const minutesToMilliseconds = (minutes) => minutes * 60000;

// const GetPastZoomMeetingDetails = async (meetings, zoomToken) => {
//   try {
//     await Promise.all(
//       meetings.map(async ({ zoom_meeting_setting_id, meeting_id, user_id }) => {
//         try {
//           const zoomSetting = await Zoom_meeting_options.findOne({
//             where: { id: zoom_meeting_setting_id },
//           });

//           if (!zoomSetting) {
//             console.warn(`Zoom setting not found for ID: ${zoom_meeting_setting_id}`);
//             return;
//           }

//           const response = await axios.get(
//             `https://api.zoom.us/v2/past_meetings/${zoomSetting.meeting_id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${zoomToken}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const { data } = response;

//           if (!data) {
//             console.warn(`No data received for meeting ID: ${zoomSetting.meeting_id}`);
//             return;
//           }

//           const exists = await Analytics_dashboard.findOne({
//             where: { zoom_uuid: data.uuid },
//           });

//           if (!exists) {
//             await Analytics_dashboard.create({
//               meeting_id,
//               user_id,
//               zoom_uuid: data.uuid,
//               duration: minutesToMilliseconds(data.duration),
//               created_on: new Date(data.start_time).getTime(),
//               ended_on: new Date(data.end_time).getTime(),
//               participants_count: data.participants_count,
//             });
//           }
//         } catch (error) {
//           if (error.response) {
//             // Zoom API responded with an error
//             console.error(
//               `Error fetching Zoom meeting data (ID: ${zoomSetting?.meeting_id}):`,
//               error.response.status,
//               error.response.data
//             );

//             if (error.response.status === 401) {
//               console.error("Unauthorized: Check if your Zoom API token is correct.");
//             } else if (error.response.status === 404) {
//               console.error("Meeting not found. It may have been deleted or the ID is incorrect.");
//             }
//           } else if (error.request) {
//             // No response from Zoom API
//             console.error("No response from Zoom API. Check your internet connection.");
//           } else {
//             // Other unexpected errors
//             console.error("Unexpected error:", error.message);
//           }
//         }
//       })
//     );
//   } catch (error) {
//     console.error("Error fetching past Zoom meetings:", error);
//   }
// };

const GetPastZoomMeetingDetails = async (meetings, zoomToken) => {
  try {
    await Promise.all(
      meetings.map(async ({ zoom_meeting_setting_id, meeting_id, user_id }) => {
        let zoomSetting = null;

        try {
          // Fetch zoom meeting settings
          zoomSetting = await Zoom_meeting_options.findOne({
            where: { id: zoom_meeting_setting_id },
          });

          if (!zoomSetting) {
            console.warn(`Zoom setting not found for ID: ${zoom_meeting_setting_id}`);
            return;
          }

          // Call Zoom API for past meeting details
          const response = await axios.get(
            `https://api.zoom.us/v2/past_meetings/${zoomSetting.meeting_id}`,
            {
              headers: {
                Authorization: `Bearer ${zoomToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const { data } = response || {};

          if (!data) {
            console.warn(`No data received for meeting ID: ${zoomSetting.meeting_id}`);
            return;
          }

          // Check if this meeting already exists in analytics
          const exists = await Analytics_dashboard.findOne({
            where: { zoom_uuid: data.uuid },
          });

          if (!exists) {
            await Analytics_dashboard.create({
              meeting_id,
              user_id,
              zoom_uuid: data.uuid,
              duration: minutesToMilliseconds(data.duration || 0),
              created_on: data.start_time ? new Date(data.start_time).getTime() : null,
              ended_on: data.end_time ? new Date(data.end_time).getTime() : null,
              participants_count: data.participants_count || 0,
            });
          }
        } catch (error) {
          // ---- SAFE ERROR HANDLING ----
          if (error.response) {
            console.error(
              `Zoom API error (Meeting ID: ${zoomSetting?.meeting_id ?? meeting_id}):`,
              error.response.status,
              error.response.data
            );
          } else if (error.request) {
            console.error("No response from Zoom API. Check internet or API availability.");
          } else {
            console.error("Unexpected error:", error.message);
          }
          // Never throw → just return so Promise.all continues
          return;
        }
      })
    );
  } catch (error) {
    console.error("Top-level error fetching past Zoom meetings:", error);
  }
};



export const zoomLiveMeetingStatus = async (zoomToken, matchingRooms) => {
  try {
    const { data } = await axios.get(
      `https://api.zoom.us/v2/users/me/meetings?type=live`,
      {
        headers: {
          Authorization: `Bearer ${zoomToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const liveMeetings = data?.meetings || [];

    if (liveMeetings.length > 0) {
      await Promise.all(
        liveMeetings.map(async ({ id }) => {
          const zoomSetting = await Zoom_meeting_options.findOne({
            where: { meeting_id: String(id) },
          });

          if (!zoomSetting) return;

          const roomData = matchingRooms.find(
            (room) => room.zoom_meeting_setting_id === zoomSetting.id
          );
          if (roomData && !roomData.online) {
            roomData.online = true;
            await roomData.save();
          }
        })
      );
    } else {
      const filteredRooms = matchingRooms.filter(
        (room) => room.zoom_meeting_setting_id
      );
      await GetPastZoomMeetingDetails(filteredRooms, zoomToken);

      await Promise.all(
        matchingRooms.map(async (room) => {
          if (room.online) {
            room.online = false;
            await room.save();
          }
        })
      );
    }

    return matchingRooms;
  } catch (error) {
    console.error("Error fetching live Zoom meetings:", error);
    throw error;
  }
};
