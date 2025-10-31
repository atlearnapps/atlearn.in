import axios from "axios";
import xml2js from "xml2js";
import bbb from "bigbluebutton-js";
import Rooms from "../models/rooms.js";
import Users from "../models/users.js";
import Room_meeting_options from "../models/room_meeting_options.js";
import Meeting_options from "../models/meeting_options.js";
import Rooms_configurations from "../models/rooms_configurations.js";
import Recordings from "../models/recordings.js";
import Formats from "../models/formats.js";
import sequelize from "sequelize";
import Room_Status from "../models/room_status.js";
import Pricing from "../models/pricing.js";
import Analytics_dashboard from "../models/analytics_dashboard.js";
let api = bbb.api(process.env.BBB_URL, process.env.BBB_SECRET);

let http = bbb.http;

// api module itslef is responsible for constructing URLs
// let meetingCreateUrl = api.administration.create('My Meeting', 'meeting-11', {
//     duration: 2,
//     attendeePW: 'secret',
//     moderatorPW: 'supersecret',
//     endCallbackUrl:"http://localhost:3000/room/test/callback"
//   })

// http method should be used in order to make calls
async function createMeetingUrl(req, res, next) {
  try {
    const id = req?.params?.id;
    const participant_count = req?.body?.participant_count || null;
    // let adminLogout= false
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });
    const roomName = roomVal?.name;
    if(roomName?.length === 1) {
      return res.json({
        message: "Name length error!",
        success: false,
      });
    }
    let durationPlan = 10;
    let disableFeatures = "";
    let participants = 2;
    if (roomVal?.user?.subscription_id) {
      const totalDurationByUser = await Analytics_dashboard.findAll({
        attributes: [
            'user_id',
            [sequelize.fn('SUM', sequelize.col('duration')), 'total_duration']
        ],
        where: {
            user_id: roomVal?.user?.id
        },
        group: ['user_id']
      });
      const subscription = await Pricing.findOne({
        where: { id: roomVal?.user?.subscription_id },
      });
      if (subscription?.duration) {
        const hrsToMins =((subscription?.duration || 0) + (roomVal?.user?.addon_duration || 0)) * 60 || 60;
        const totalDuration = totalDurationByUser?.[0]?.dataValues?.total_duration || 0;
        const balanceDuration = subtractAndRoundMinutes(+totalDuration,hrsToMins);
        if(balanceDuration > 0) {
          durationPlan = balanceDuration;
        } else {
          return res.json({
            message: "Insufficient Duration Balance",
            success: false,
            duration:true
          });
        }
      }
      participants = subscription?.participants;
      const sharedNotes = subscription?.sharedNotes === "true" ? null : "sharedNotes";
      const chat = subscription?.chat === "true" ? null : "chat";
      const screenshare =
        subscription?.screenshare === "true" ? null : "screenshare";
      const multiuserwhiteboard =
        subscription?.multiuserwhiteboard === "true" ? null : "presentation";
      const breakoutRooms =
        subscription?.breakout === "true" ? null : "breakoutRooms";
      const values = [
        sharedNotes,
        chat,
        screenshare,
        multiuserwhiteboard,
        breakoutRooms,
      ];
      const nonNullValues = values?.filter((value) => value !== null);
      disableFeatures = nonNullValues?.join(",");
    }
    // if(roomVal?.user?.role_id){
    //   const rolename = await Roles.findOne({ where: { id: roomVal?.user?.role_id} });

    //   if(rolename.name === "Administrator"){
    //     adminLogout=true
    //   }
    // }
    // const url= adminLogout? process.env.BBB_ADMIN_LOGOUT_URL : process.env.BBB_LOGOUT_URL

    const recordMeetingOption = await Meeting_options.findOne({
      where: { name: "record" },
    });
    const moderatorPWMeetingOption = await Meeting_options.findOne({
      where: { name: "glModeratorAccessCode" },
    });
    const viewerPWMeetingOption = await Meeting_options.findOne({
      where: { name: "glViewerAccessCode" },
    });
    const muteOnStartMeetingOption = await Meeting_options.findOne({
      where: { name: "muteOnStart" },
    });
    const recordRoomConfig = await Rooms_configurations?.findOne({
      where: { meeting_option_id: recordMeetingOption?.id },
    });
    const moderatorPWRoomConfig = await Rooms_configurations?.findOne({
      where: { meeting_option_id: moderatorPWMeetingOption?.id },
    });
    const viewerPWRoomConfig = await Rooms_configurations?.findOne({
      where: { meeting_option_id: viewerPWMeetingOption?.id },
    });
    const muteOnStartRoomConfig = await Rooms_configurations?.findOne({
      where: { meeting_option_id: muteOnStartMeetingOption?.id },
    });
    let recordRoomConfigDefault = recordRoomConfig?.value;
    let muteOnStartRoomConfigDefault = muteOnStartRoomConfig?.value;
    const roomSettings = await Room_meeting_options.findAll({
      where: {
        room_id: roomVal.id,
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
    const record = roomSettings?.find(
      (v) => v?.meeting_option?.name === "record"
    );
    const guestPolicy = roomSettings?.find(
      (v) => v?.meeting_option?.name === "guestPolicy"
    );
    const moderatorPW = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glModeratorAccessCode"
    );
    const viewerPW = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glViewerAccessCode"
    );
    const muteOnStart = roomSettings?.find(
      (v) => v?.meeting_option?.name === "muteOnStart"
    );
    const maxParticipantsVal = (Number(participant_count) < Number(participants) && !isNaN(participant_count) && participant_count > 1) ? participant_count : participants;
    let meetingCreateUrl = api.administration.create(
      roomVal?.name,
      roomVal?.meeting_id,
      {
        duration: durationPlan,
        attendeePW: viewerPW?.value === "false" ? "VPW" : viewerPW?.value,
        moderatorPW:
          moderatorPW?.value === "false" ? "MPW" : moderatorPW?.value,
        logoutURL: process.env.BBB_LOGOUT_URL,
        record: record?.value === "true" ? true : false,
        recordId: record?.value === "true" ? roomVal?.meeting_id : "",
        muteOnStart: muteOnStart?.value === "true" ? muteOnStart?.value : "",
        disabledFeatures: disableFeatures,
        maxParticipants: maxParticipantsVal,
        guestPolicy: guestPolicy?.value,
      }
    );
    http(meetingCreateUrl)
      .then((result) => {
        // const getRecord = api.recording.getRecordings({
        //   recordId: roomVal?.meeting_id,
        //   meetingID: roomVal?.meeting_id
        // })
        let moderatorUrl = api.administration.join(
          roomVal?.user?.name,
          roomVal?.meeting_id,
          moderatorPW?.value === "false" ? "MPW" : moderatorPW?.value
        );
        roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
        // let attendeeUrl = api.administration.join('attendee', roomVal?.meeting_id, 'secret')
        // console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`)

        // let meetingEndUrl = api.administration.end(roomVal?.meeting_id, 'supersecret')
        // console.log(`End meeting link: ${meetingEndUrl}`)
        // res.redirect(moderatorUrl);
        res.json({
          message: "success",
          success:true,
          data: {
            // createMeetingurl: meetingCreateUrl,
            // endMeetingUrl: meetingEndUrl,
            joinModeratorUrl: moderatorUrl,
            // getRecord: getRecord,
            // joinAttendeeUrl: attendeeUrl,
            // result: resulthttps://ns1.akraed.com/rooms/smw-ygi-euh-hbh/join
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server Error! Please try again later",
          error: err,
        });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
// async function getAllMeetingInfo(url) {

//   const linkResponse = await axios.get(url);
//   console.log("ooooooooooooooooooooooooooooooooooooooooooooooooo");
//   const returncode = linkResponse?.data?.response?.returncode;
//   if (returncode === "FAILED") {
//     return {
//       success: false,
//       data: {
//         message: "Meeting is not found",
//       },
//     };
//   } else {
//     if (linkResponse?.data) {
//       const xmlStringify = await xml2js.parseStringPromise(linkResponse?.data);
//       const jsonStringify = JSON.stringify(xmlStringify, null, 2);
//       const meetingInfo = JSON.parse(jsonStringify);
//       if (meetingInfo?.response?.returncode?.[0] === "SUCCESS") {
//         return { success: true, data: meetingInfo?.response };
//       } else {
//         return {
//           success: false,
//           data: {
//             message: "Error",
//           },
//         };
//       }
//     } else {
//       return {
//         success: false,
//         data: {
//           message: "Error",
//         },
//       };
//     }
//   }
// }

async function getAllMeetingInfo(url) {
  try {
    const linkResponse = await axios.get(url);
    const returncode = linkResponse?.data?.response?.returncode;
    if (returncode === "FAILED") {
      return {
        success: false,
        data: {
          message: "Meeting is not found",
        },
      };
    } else {
      if (linkResponse?.data) {
        const xmlStringify = await xml2js.parseStringPromise(
          linkResponse?.data
        );
        const jsonStringify = JSON.stringify(xmlStringify, null, 2);
        const meetingInfo = JSON.parse(jsonStringify);
        if (meetingInfo?.response?.returncode?.[0] === "SUCCESS") {
          return { success: true, data: meetingInfo?.response };
        } else {
          return {
            success: false,
            data: {
              message: "Error",
            },
          };
        }
      } else {
        return {
          success: false,
          data: {
            message: "Error",
          },
        };
      }
    }
  } catch (error) {
    console.error("Error fetching meeting info:", error);
    return {
      success: false,
      data: {
        message: "Error fetching meeting info",
      },
    };
  }
}

async function meetingRunningInfo(req, res) {
  try {
    const id = req?.params?.id;
    const checkMeetingInfo = api.monitoring.getMeetingInfo(id);
    console.log(checkMeetingInfo);
    const linkResponse = await axios.get(checkMeetingInfo);
    const returncode = linkResponse?.data?.response?.returncode;

    if (returncode === "FAILED") {
      return res.json({ message: "Meeting is not found" });
    } else {
      if (linkResponse?.data) {
        const xmlStringify = await xml2js.parseStringPromise(
          linkResponse?.data
        );
        const jsonStringify = JSON.stringify(xmlStringify, null, 2);
        const meetingInfo = JSON.parse(jsonStringify);
        if (meetingInfo?.response?.returncode?.[0] === "SUCCESS") {
          return res.json({ meetingInfo, message: "SUCCESS" });
        } else {
          return res.json({ message: "checking" });
        }
      } else {
        return res.json({ message: "Error" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function meetingInfo(url) {
  const linkResponse = await axios.get(url);
  if (linkResponse?.data) {
    const returncode = linkResponse?.data?.response?.returncode;
    if (returncode === "FAILED") {
      return false;
    } else {
      if (linkResponse?.data) {
        const xmlStringify = await xml2js.parseStringPromise(
          linkResponse?.data
        );
        const jsonStringify = JSON.stringify(xmlStringify, null, 2);
        const meetingInfo = JSON.parse(jsonStringify);
        if (meetingInfo?.response?.returncode?.[0] === "SUCCESS") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

function subtractAndRoundMinutes(millisecondsCount, minuteCount) {
  // Convert minutes to milliseconds
  const millisecondsFromMinutes = minuteCount * 60 * 1000;

  // Subtract the milliseconds count from the converted minutes
  const resultMilliseconds = millisecondsFromMinutes - millisecondsCount;

  // Convert back to minutes and round
  const resultMinutes = Math.round(resultMilliseconds / (60 * 1000));

  return resultMinutes;
}

async function createMeeting(Id) {
  try {
    const id = Id;
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });
    let durationPlan = 5;
    let disableFeatures = "";
    let participants = 2;
    if (roomVal?.user?.subscription_id) {
      const totalDurationByUser = await Analytics_dashboard.findAll({
        attributes: [
            'user_id',
            [sequelize.fn('SUM', sequelize.col('duration')), 'total_duration']
        ],
        where: {
            user_id: roomVal?.user?.id
        },
        group: ['user_id']
      });
      const subscription = await Pricing.findOne({
        where: { id: roomVal?.user?.subscription_id },
      });
      if (subscription?.duration) {
        const hrsToMins = ((subscription?.duration || 0) + (roomVal?.user?.addon_duration || 0)) * 60 || 60;
        const totalDuration = totalDurationByUser?.[0]?.dataValues?.total_duration || 0;
        const balanceDuration = subtractAndRoundMinutes(+totalDuration,hrsToMins);
        if(balanceDuration > 0) {
          durationPlan = balanceDuration;
        } else {
          return "insufficient_duration_balance";
        }
      }
      participants = subscription?.participants;
      const sharedNotes = subscription?.sharedNotes === "true" ? null : "polls";
      const chat = subscription?.chat === "true" ? null : "chat";
      const screenshare =
        subscription?.screenshare === "true" ? null : "screenshare";
      const multiuserwhiteboard =
        subscription?.multiuserwhiteboard === "true" ? null : "presentation";
      const breakoutRooms =
        subscription?.breakout === "true" ? null : "breakoutRooms";
      const values = [
        sharedNotes,
        chat,
        screenshare,
        multiuserwhiteboard,
        breakoutRooms,
      ];
      const nonNullValues = values?.filter((value) => value !== null);

      disableFeatures = nonNullValues?.join(",");
    }
    const roomSettings = await Room_meeting_options.findAll({
      where: {
        room_id: roomVal.id,
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
    const record = roomSettings?.find(
      (v) => v?.meeting_option?.name === "record"
    );
    const guestPolicy = roomSettings?.find(
      (v) => v?.meeting_option?.name === "guestPolicy"
    );
    const moderatorPW = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glModeratorAccessCode"
    );
    const viewerPW = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glViewerAccessCode"
    );
    const muteOnStart = roomSettings?.find(
      (v) => v?.meeting_option?.name === "muteOnStart"
    );
    let meetingCreateUrl = api.administration.create(
      roomVal?.name,
      roomVal?.meeting_id,
      {
        duration: durationPlan,
        attendeePW: viewerPW?.value === "false" ? "VPW" : viewerPW?.value,
        moderatorPW:
          moderatorPW?.value === "false" ? "MPW" : moderatorPW?.value,
        logoutURL: process.env.BBB_LOGOUT_URL,
        record: record?.value === "true" ? true : false,
        recordId: record?.value === "true" ? roomVal?.meeting_id : "",
        muteOnStart: muteOnStart?.value === "true" ? muteOnStart?.value : "",
        disabledFeatures: disableFeatures,
        maxParticipants: participants,
        guestPolicy: guestPolicy?.value,
      }
    );

    const result = await http(meetingCreateUrl);
    roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
    return result;
  } catch (error) {
    throw error;
  }
}

async function endMeeting(req, res, next) {
  try {
    const id = req?.params?.id;
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });
    const checkMeetingInfo = api.monitoring.getMeetingInfo(roomVal?.meeting_id);
    const meetingCheck = await meetingInfo(checkMeetingInfo);
    if (meetingCheck) {
      const roomSettings = await Room_meeting_options.findAll({
        where: {
          room_id: roomVal.id,
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
      const moderatorPW = roomSettings?.find(
        (v) => v?.meeting_option?.name === "glModeratorAccessCode"
      );
      const mpwd = moderatorPW?.value === "false" ? "MPW" : moderatorPW?.value;
      const endM = api.administration.end(roomVal?.meeting_id, mpwd);
      if (endM) {
        const responseCheck = await axios.get(endM);
        return res.json({ message: "Meeting Ended", success: true });
      } else {
        return res.json({ success: false, message: "Error" });
      }
    } else {
      return res.json({ success: false, message: "Meeting is not running" });
    }
  } catch (error) {
    throw error;
  }
}

async function viewerJoinMeetingUrl(req, res, next) {
  try {
    const id = req?.params?.id;
    const { name, access_code } = req.body;

    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });
    const roomName = roomVal?.name;
    if(roomName?.length === 1) {
      return res.json({
        message: "Name length error!",
        success: false,
      });
    }
    const roomSettings = await Room_meeting_options.findAll({
      where: {
        room_id: roomVal.id,
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
    const anyoneCanStart = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glAnyoneCanStart"
    );
    const checkjoinasModerator = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glAnyoneJoinAsModerator"
    );
    const moderatorPw = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glModeratorAccessCode"
    );
    const moderatorAcc =
      moderatorPw?.value === "false" ? "MPW" : moderatorPw?.value;

    const viewerPW = roomSettings?.find(
      (v) => v?.meeting_option?.name === "glViewerAccessCode"
    );
    const viewerAcc = viewerPW?.value === "false" ? "VPW" : viewerPW?.value;

    if (checkjoinasModerator.value === "true") {
      const checkMeetingInfo = api.monitoring.getMeetingInfo(
        roomVal?.meeting_id
      );
      const meetingCheck = await meetingInfo(checkMeetingInfo);
      if (meetingCheck) {
        // moderator and viewers have access code
        if (moderatorPw?.value === "false" && viewerPW?.value === "false") {
          let attendeeUrl = api.administration.join(
            name,
            roomVal?.meeting_id,
            moderatorAcc
          );
          roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
          return res.json({
            message: "success",
            success: true,
            data: {
              joinAttendeeUrl: attendeeUrl,
            },
          });
        } else {
          if (moderatorAcc === access_code) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              moderatorAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else if (viewerAcc === access_code) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              moderatorAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            return res.json({ message: "Access code invalid", success: false });
          }
        }
      } else {
        const meeting = createMeeting(id);
        const meetingStatus = await meeting;
        if(meetingStatus === "insufficient_duration_balance") {
          return res.json({
            message: "Insufficient Duration Balance",
            success: false,
            duration:true
          });
        }
        if (meeting) {
          if (moderatorPw?.value === "false") {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              moderatorAcc
            );
            // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            if (moderatorAcc === access_code) {
              let attendeeUrl = api.administration.join(
                name,
                roomVal?.meeting_id,
                moderatorAcc
              );
              roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

              return res.json({
                message: "success",
                success: true,
                data: {
                  joinAttendeeUrl: attendeeUrl,
                },
              });
            } else {
              return res.json({
                message: "Access code invalid",
                success: false,
              });
            }
          }
        }
      }
    } else {
      const access_code_viewers = viewerAcc === access_code;
      const access_code_moderator = moderatorAcc === access_code;
      const checkMeetingInfo = api.monitoring.getMeetingInfo(
        roomVal?.meeting_id
      );
      const meetingCheck = await meetingInfo(checkMeetingInfo);
      if (moderatorPw.value !== "false" && viewerPW.value !== "false") {
        if (access_code_viewers) {
          if (meetingCheck) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              viewerAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            // Check Viewer access code and Any one can start meeting option
            if (anyoneCanStart.value === "true") {
              const meeting = createMeeting(id);
              const meetingStatus = await meeting;
              if(meetingStatus === "insufficient_duration_balance") {
                return res.json({
                  message: "Insufficient Duration Balance",
                  success: false,
                  duration:true
                });
              }
              if (meeting) {
                let attendeeUrl = api.administration.join(
                  name,
                  roomVal?.meeting_id,
                  viewerAcc
                );
                // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
  
                return res.json({
                  message: "success",
                  success: true,
                  data: {
                    joinAttendeeUrl: attendeeUrl,
                  },
                });
              }
            } else {
              return res.json({ message: "Meeting is not running" });
            }
          }
        } else if (access_code_moderator) {
          if (meetingCheck) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              moderatorAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            // Check Moderator access code and Any one can start meeting option
            if (anyoneCanStart.value === "true") {
              const meeting = createMeeting(id);
              const meetingStatus = await meeting;
              if(meetingStatus === "insufficient_duration_balance") {
                return res.json({
                  message: "Insufficient Duration Balance",
                  success: false,
                  duration:true
                });
              }
              if (meeting) {
                let attendeeUrl = api.administration.join(
                  name,
                  roomVal?.meeting_id,
                  moderatorAcc
                );
                // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
  
                return res.json({
                  message: "success",
                  success: true,
                  data: {
                    joinAttendeeUrl: attendeeUrl,
                  },
                });
              }
            } else {
              return res.json({ message: "Meeting is not running" });
            }
          }
        } else {
          return res.json({ message: "Access code invalid", success: false });
        }
      } else if (moderatorPw.value !== "false") {
        if (access_code_moderator) {
          if (meetingCheck) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              moderatorAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            // Check Moderator access code and Any one can start meeting option
            if (anyoneCanStart.value === "true") {
              const meeting = createMeeting(id);
              const meetingStatus = await meeting;
              if(meetingStatus === "insufficient_duration_balance") {
                return res.json({
                  message: "Insufficient Duration Balance",
                  success: false,
                  duration:true
                });
              }
              if (meeting) {
                let attendeeUrl = api.administration.join(
                  name,
                  roomVal?.meeting_id,
                  moderatorAcc
                );
                // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
  
                return res.json({
                  message: "success",
                  success: true,
                  data: {
                    joinAttendeeUrl: attendeeUrl,
                  },
                });
              }
            } else {
              return res.json({ message: "Meeting is not running" });
            }
          }
        } else {
          if (meetingCheck) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              viewerAcc
            );
            roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            // Check Moderator access code and Any one can start meeting option
            if (anyoneCanStart.value === "true") {
              const meeting = createMeeting(id);
              const meetingStatus = await meeting;
              if(meetingStatus === "insufficient_duration_balance") {
                return res.json({
                  message: "Insufficient Duration Balance",
                  success: false,
                  duration:true
                });
              }
              if (meeting) {
                let attendeeUrl = api.administration.join(
                  name,
                  roomVal?.meeting_id,
                  viewerAcc
                );
                // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
  
                return res.json({
                  message: "success",
                  success: true,
                  data: {
                    joinAttendeeUrl: attendeeUrl,
                  },
                });
              }
            } else {
              return res.json({ message: "Meeting is not running" });
            }
          }
        }
      } else if (viewerPW.value !== "false") {
        if (access_code_viewers) {
          if (meetingCheck) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              viewerAcc
            );
            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          } else {
            // Check Viewer access code and Any one can start meeting option
            if (anyoneCanStart.value === "true") {
              const meeting = createMeeting(id);
              const meetingStatus = await meeting;
              if(meetingStatus === "insufficient_duration_balance") {
                return res.json({
                  message: "Insufficient Duration Balance",
                  success: false,
                  duration:true
                });
              }
              if (meeting) {
                let attendeeUrl = api.administration.join(
                  name,
                  roomVal?.meeting_id,
                  viewerAcc
                );
                // roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
  
                return res.json({
                  message: "success",
                  success: true,
                  data: {
                    joinAttendeeUrl: attendeeUrl,
                  },
                });
              }
            } else {
              return res.json({ message: "Meeting is not running" });
            }
          }
        } else {
          return res.json({ message: "Access code invalid", success: false });
        }
      } else if (anyoneCanStart.value === "true") {
        if (meetingCheck) {
          let attendeeUrl = api.administration.join(
            name,
            roomVal?.meeting_id,
            viewerAcc
          );
          roomStatusChanges(roomVal?.meeting_id, roomVal?.id);
          return res.json({
            message: "success",
            success: true,
            data: {
              joinAttendeeUrl: attendeeUrl,
            },
          });
        } else {
          const meeting = createMeeting(id);
          const meetingStatus = await meeting;
          if(meetingStatus === "insufficient_duration_balance") {
            return res.json({
              message: "Insufficient Duration Balance",
              success: false,
              duration:true
            });
          }
          if (meeting) {
            let attendeeUrl = api.administration.join(
              name,
              roomVal?.meeting_id,
              viewerAcc
            );
            return res.json({
              message: "success",
              success: true,
              data: {
                joinAttendeeUrl: attendeeUrl,
              },
            });
          }
        }
      } else {
        if (meetingCheck) {
          let attendeeUrl = api.administration.join(
            name,
            roomVal?.meeting_id,
            viewerAcc
          );
          roomStatusChanges(roomVal?.meeting_id, roomVal?.id);

          return res.json({
            message: "success",
            success: true,
            data: {
              joinAttendeeUrl: attendeeUrl,
            },
          });
        } else {
          return res.json({ message: "Meeting is not running" });
        }
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function recordingInfo(url) {
  const linkResponse = await axios.get(url);
  if (linkResponse) {
    const xmlStringify = await xml2js.parseStringPromise(linkResponse?.data);
    const jsonStringify = JSON.stringify(xmlStringify, null, 2);
    const RecordingInfo = JSON.parse(jsonStringify);

    return RecordingInfo;
  }
}

async function deleteRecord(req, res, next) {
  try {
    const formatId = req?.params?.id;
    const formatFind = await Formats.findOne({
      where: {
        id: formatId,
      },
    });
    if (formatFind) {
      const val = api.recording.deleteRecordings(formatFind?.recording_id);
      const linkResponse = await axios.get(val);
      if (linkResponse?.data) {
        if (linkResponse?.data?.response?.returncode === "FAILED") {
          return res.json({ message: "recording not found" });
        } else {
          await Formats.destroy({
            where: {
              recording_id: formatFind?.recording_id,
            },
          });
          await Recordings.destroy({
            where: {
              record_id: formatFind?.recording_id,
            },
          });
          return res.json({ message: "success", success: true });
        }
      }
    } else {
      return res.json({ message: "not found", success: false });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const getAllRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page
    const perPage = parseInt(req.query.perPage) || 10; // Records per page
    const offset = (page - 1) * perPage;
    const { count, rows } = await Formats.findAndCountAll({
      limit: perPage,
      offset,
      include: {
        model: Recordings,
        include: {
          model: Rooms,
          include: {
            model: Users,
            attributes: ["name", "email"],
          },
        },
      },
    });
    const totalPages = Math.ceil(count / perPage);
    res.status(200).send({
      data: rows,
      pagination: {
        currentPage: page,
        lastPage: totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function getRecord(req, res, next) {
  try {
    const id = req?.params?.id;
    const roomVal = await Rooms.findOne({
      where: { friendly_id: id },
      include: { model: Users },
    });

    const getRecordVal = api.recording.getRecordings({
      recordId: roomVal?.meeting_id,
      meetingID: roomVal?.meeting_id,
    });
    
    // return res.json({ message: "sucess", data: getRecordVal });
    if (getRecordVal) {
      const linkResponse = await axios.get(getRecordVal);
      if (linkResponse) {
        const xmlStringify = await xml2js.parseStringPromise(
          linkResponse?.data
        );
        const jsonStringify = JSON.stringify(xmlStringify, null, 2);
        const RecordingInfo = JSON.parse(jsonStringify);
        if (RecordingInfo?.response?.recordings?.[0]) {
          const recordingsArr =
            RecordingInfo?.response?.recordings?.[0]?.recording;
          // return res.json({ message: "sucess", data: recordingsArr });
          const values = recordingsArr?.map(async (val) => {
            const inputDate = new Date();
            const istOptions = {
              timeZone: "Asia/Kolkata",
              // weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            };
            const formattedDateIST = inputDate.toLocaleDateString(
              "en-US",
              istOptions
            );

            const dataObj = {
              record_id: val.recordID?.[0],
              participants: val.participants?.[0],
              protectable: false,
              visibility: val.state?.[0],
              name: val.name?.[0],
              length: val.playback?.[0]?.format?.[0]?.length?.[0],
              room_id: roomVal?.id,
              recorded_at: formattedDateIST,
            };
            const findRec = await Formats.findOne({
              where: {
                recording_id: val.recordID?.[0],
              },
            });
            if (findRec) {
              const updatedRec = await Recordings.update(
                {
                  participants: val.participants?.[0],
                  visibility: val.state?.[0],
                  length: val.playback?.[0]?.format?.[0]?.length?.[0],
                },
                {
                  where: {
                    record_id: val.recordID?.[0],
                  },
                }
              );
              return updatedRec;
            } else {
              const rec = await Recordings.create(dataObj);
              if (rec) {
                const formatObj = {
                  record_id: rec?.id,
                  recording_id: val.recordID?.[0],
                  recording_type: val.playback?.[0]?.format?.[0]?.type?.[0],
                  url: val.playback?.[0]?.format?.[0]?.url?.[0],
                };
                const formatCreate = await Formats.create(formatObj);

                return formatCreate;
              } else {
                return rec;
              }
            }
          });
          await Formats.findAll({
            include: [
              {
                model: Recordings,
                where: {
                  room_id: roomVal?.id,
                },
              },
            ],
          });
          const getFormat = await Formats.findAll({
            include: [
              {
                model: Recordings,
                where: {
                  room_id: roomVal?.id,
                },
              },
            ],
          });
          return res.json({ message: "sucess", data: { getFormat, roomVal } });
        }

        return res.json({ message: "sucess", data: [] });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateRecording(req, res) {
  try {
    // const { newName, recordId, meetingID } = req.body;
    // const updatedData = api.recording.updateRecordings(recordId, {name: newName, meetingID})
    console.log('updatedData', req.body);
    return res.json({ message: "sucess", data: req.body });
  } catch(err) {
    console.log('Error - update recording', err)
    return res.status(400).json({ message: err.message });
  }
}

export const roomStatusSync = async (roomsArray) => {
  const roomVal = roomsArray?.map(async (r) => {
    let room = r?.dataValues;
    const checkMeetingInfo = api.monitoring.getMeetingInfo(room?.meeting_id);
    const meetingCheck = await getAllMeetingInfo(checkMeetingInfo);
    if (meetingCheck?.success) {
      const meetingStatus = meetingCheck?.data?.running?.[0];
      const meetingPaticipants = meetingCheck?.data?.participantCount?.[0];
      const status = meetingStatus === "true" ? true : false;
      const createDate = meetingCheck?.data?.createDate?.[0];
      const inputDate = new Date(createDate);
      const istOptions = {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const formattedDateIST = inputDate.toLocaleDateString(
        "en-US",
        istOptions
      );
      await Rooms.update(
        {
          online: status,
          participants: meetingPaticipants,
          last_session: formattedDateIST,
        },
        {
          where: {
            id: room?.id,
          },
        }
      );
      room.online = status;
      room.participants = meetingPaticipants;
      room.last_session = formattedDateIST;
    } else {
      await Rooms.update(
        { online: false, participants: "0" },
        {
          where: {
            id: room?.id,
          },
        }
      );
      room.online = false;
      room.participants = "0";
    }
    return room;
  });
  return roomVal;
};

export const getRecordings = async (id) => {};

const roomStatusChanges = async (meeting_id, id) => {
  const checkMeetingInfo = api.monitoring.getMeetingInfo(meeting_id);
  const meetingCheck = await getAllMeetingInfo(checkMeetingInfo);
  if (meetingCheck?.success) {
    const meetingStatus = meetingCheck?.data?.running?.[0];
    const meetingPaticipants = meetingCheck?.data?.participantCount?.[0];
    const status = meetingStatus === "true" ? true : false;
    const createDate = meetingCheck?.data?.createDate?.[0];
    const inputDate = new Date(createDate);
    const istOptions = {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDateIST = inputDate.toLocaleDateString("en-US", istOptions);
    // console.log(meetingCheck);
    // await Rooms.update(
    //   {
    //     online: status,
    //     participants: parseInt(meetingPaticipants) + 1,
    //     last_session: formattedDateIST,
    //   },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );

    const room = await Rooms.findOne({ where: { id: id } });

    if (room) {
      await Rooms.update(
        {
          online: status,
          participants: parseInt(meetingPaticipants) + 1,
          last_session: formattedDateIST,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const date = new Date();

      let roomStatus = await Room_Status.findOne({
        where: { last_session: formattedDateIST },
      });

      if (roomStatus) {
        // Update existing room status
        await roomStatus.update({
          participants: parseInt(meetingPaticipants) + 1,
        });
      } else {
        // Create new room status
        await Room_Status.create({
          name: room.name,
          participants: parseInt(meetingPaticipants) + 1,
          date: date,
          last_session: formattedDateIST,
        });
      }
    }
  }
};

async function user_getRecord(req, res, next) {
  try {
    const user_id = req?.params?.id;

    // Find all rooms associated with the user
    const userRooms = await Rooms.findAll({
      where: { user_id: user_id },
    });

    if (!userRooms || userRooms.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or has no associated rooms" });
    }

    // Process each room in parallel
    const roomPromises = userRooms.map(async (roomVal) => {
      const getRecordVal = api.recording.getRecordings({
        recordId: roomVal?.meeting_id,
        meetingID: roomVal?.meeting_id,
      });

      if (getRecordVal) {
        const linkResponse = await axios.get(getRecordVal);

        if (linkResponse) {
          const xmlStringify = await xml2js.parseStringPromise(
            linkResponse?.data
          );
          const jsonStringify = JSON.stringify(xmlStringify, null, 2);
          const RecordingInfo = JSON.parse(jsonStringify);

          if (RecordingInfo?.response?.recordings?.[0]) {
            const recordingsArr =
              RecordingInfo?.response?.recordings?.[0]?.recording;

            // Process each recording in parallel
            const values = await Promise.all(
              recordingsArr?.map(async (val) => {
                const inputDate = new Date();
                const istOptions = {
                  timeZone: "Asia/Kolkata",
                  // weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                };
                const formattedDateIST = inputDate.toLocaleDateString(
                  "en-US",
                  istOptions
                );

                const dataObj = {
                  record_id: val.recordID?.[0],
                  participants: val.participants?.[0],
                  protectable: false,
                  visibility: val.state?.[0],
                  name: val.name?.[0],
                  length: val.playback?.[0]?.format?.[0]?.length?.[0],
                  room_id: roomVal?.id,
                  recorded_at: formattedDateIST,
                };

                const findRec = await Formats.findOne({
                  where: {
                    recording_id: val.recordID?.[0],
                  },
                });

                if (findRec) {
                  const updatedRec = await Recordings.update(
                    {
                      participants: val.participants?.[0],
                      visibility: val.state?.[0],
                      length: val.playback?.[0]?.format?.[0]?.length?.[0],
                    },
                    {
                      where: {
                        record_id: val.recordID?.[0],
                      },
                    }
                  );

                  return updatedRec;
                } else {
                  const rec = await Recordings.create(dataObj);

                  if (rec) {
                    const formatObj = {
                      record_id: rec?.id,
                      recording_id: val.recordID?.[0],
                      recording_type: val.playback?.[0]?.format?.[0]?.type?.[0],
                      url: val.playback?.[0]?.format?.[0]?.url?.[0],
                    };

                    const formatCreate = await Formats.create(formatObj);

                    return formatCreate;
                  } else {
                    return rec;
                  }
                }
              })
            );

            // Additional processing if needed

            // Get and return the final Formats
            const getFormat = await Formats.findAll({
              include: [
                {
                  model: Recordings,
                  where: {
                    room_id: roomVal?.id,
                  },
                  include: [{ model: Rooms }],
                },
              ],
            });

            return { message: "success", data: getFormat };
          }
        }
      }

      // Return an empty result for this room if processing fails
      return { message: "success", data: [] };
    });

    // Wait for all rooms to be processed
    const roomResults = await Promise.all(roomPromises);

    // Now you can accumulate the results and send the response

    // For example, you can concatenate all room formats into a single array
    const allFormats = roomResults.flatMap((result) => result.data);

    return res.json({ message: "success", data: allFormats });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export default {
  createMeetingUrl,
  viewerJoinMeetingUrl,
  getAllRecords,
  getRecord,
  deleteRecord,
  meetingRunningInfo,
  endMeeting,
  user_getRecord,
  updateRecording,
};
