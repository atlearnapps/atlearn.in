import express from "express";
const bigbluebuttonRouter = express.Router();
import { verifyToken } from "../verifyToken.js";
import { verifyOauthClientToken } from "../verifyOauthClientToken.js";

import bigbluebuttonController from "../controller/bigbluebuttonController.js";

bigbluebuttonRouter.post('/start/:id',verifyOauthClientToken,bigbluebuttonController.createMeetingUrl);
bigbluebuttonRouter.post('/join/:id',bigbluebuttonController.viewerJoinMeetingUrl);
bigbluebuttonRouter.get('/record/:id',bigbluebuttonController.getRecord);
bigbluebuttonRouter.get('/recordings/getAll',verifyToken,bigbluebuttonController.getAllRecords);
bigbluebuttonRouter.delete('/record/:id',verifyOauthClientToken,bigbluebuttonController.deleteRecord);
bigbluebuttonRouter.get('/runningInfo/:id',verifyOauthClientToken,bigbluebuttonController.meetingRunningInfo);
bigbluebuttonRouter.get('/end/:id',verifyOauthClientToken,bigbluebuttonController.endMeeting);
bigbluebuttonRouter.get("/user_records/:id",verifyOauthClientToken,bigbluebuttonController.user_getRecord);
bigbluebuttonRouter.post("/record_dummy/:id",verifyOauthClientToken,bigbluebuttonController.updateRecording);
export default bigbluebuttonRouter;