import express from "express";
const roomRouter = express.Router();
import roomController from "../controller/roomController.js";
// import verifyToken from "../verifyToken.js";
import upload from "../multer/Multer.js";
import { verifyToken } from "../verifyToken.js";
import { verifyOauthClientToken } from "../verifyOauthClientToken.js";
import googleCalenderController from "../controller/googleCalenderController.js";
import lmsController from "../controller/lmsController.js";
import { getZoomToken } from "../services/Zoom/ZoomToken.js";

roomRouter.post("/create", verifyOauthClientToken,getZoomToken,upload.single('image'), roomController.createRoom);
roomRouter.get("/getAllRooms", verifyToken,getZoomToken,roomController.getRooms);
roomRouter.patch("/update", verifyOauthClientToken,getZoomToken, upload.single('image'),roomController.editRoom);
roomRouter.delete("/remove/:id", verifyOauthClientToken,getZoomToken, roomController.removeRoom);
roomRouter.get('/getsingleRoom/:id',verifyToken,getZoomToken,roomController.getRoomById);
roomRouter.get("/settings/getAll/:id", verifyOauthClientToken, roomController.getAllRoomSettings);
roomRouter.patch("/settings/update/:id", verifyOauthClientToken,getZoomToken, roomController.updateRoomSettings);
roomRouter.post("/share_access/create", verifyOauthClientToken, roomController.createSharedAccess);
roomRouter.get("/share_access/getAll/:id", verifyOauthClientToken, roomController.getSharedAccessByRoomId);
roomRouter.delete("/share_access/delete/:id", verifyOauthClientToken, roomController.deleteSharedAccess);
roomRouter.get("/getAccessCode/:id",verifyOauthClientToken,roomController.generateAccessCode);
roomRouter.delete ("/deleteAccessCode/:id",verifyOauthClientToken,roomController.DeleteAccessCode);
roomRouter.get("/getuserDetails/:id",roomController.getUserBy_id);
roomRouter.post("/shareable_users",verifyOauthClientToken,roomController.searchUser);
roomRouter.post("/share_room",verifyOauthClientToken,roomController.shareRoom);
roomRouter.post("/schedule_meeting",verifyOauthClientToken,roomController.scheduleMeeting);
roomRouter.get("/getScheduleMeeting",verifyToken,roomController.getScheduleMeeting);
roomRouter.get("/getSingleScheduleMeeting/:id",verifyOauthClientToken,roomController.getSingleScheduleMeeting);
roomRouter.post("/updateScheduleMeeting/:id",verifyOauthClientToken,roomController.updateScheduleMeeting);
roomRouter.post("/feedback",roomController.feedback);
// roomRouter.get("/live_room_records",getZoomToken,roomController.live_Room_Records);
// roomRouter.get("/total_count",getZoomToken,roomController.totalCount);
roomRouter.get("/get_scheduled_notification",verifyToken,roomController.getScheduleMeetingNotification);
roomRouter.post("/updateNotificationReadStatus",verifyToken,roomController.updateNotificationReadStatus);
roomRouter.post("/inviteUser",verifyOauthClientToken,roomController.inviteUser);
roomRouter.post("/scheduledMeetings",roomController.scheduledMeetings);
roomRouter.get("/getScheduledMeetingonly",roomController.getScheduledMeetingonly);
roomRouter.post("/checkMeetingPayment",verifyToken,roomController.checkMeetingPayment);
roomRouter.delete("/deleteScheduleMeeting/:id",verifyOauthClientToken,roomController.deleteScheduleMeeting);
roomRouter.get("/fetch_room_scheduled_meetings/:id",verifyToken,roomController.getRoomScheduledMeetings);
// for admin 
roomRouter.get("/getAll", verifyToken,getZoomToken, roomController.getAllRooms);
// Routes
roomRouter.get('/google/authorize', googleCalenderController.generateAuthUrl);
roomRouter.get('/google/oauth2callback', googleCalenderController.handleOAuthCallback);
roomRouter.post('/google/calendar/create-event', googleCalenderController.createEvent);

//For LMS
roomRouter.post('/create-room',upload.single('image'),lmsController.create_room);

export default roomRouter;
