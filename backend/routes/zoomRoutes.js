import express from "express";
const zoomRouter = express.Router();
import zoomController from "../controller/zoomController.js";
import { getZoomToken } from "../services/Zoom/ZoomToken.js";
import { verifyToken } from "../verifyToken.js";
import { verifyOauthClientToken } from "../verifyOauthClientToken.js";

zoomRouter.post('/generate-signature', zoomController.generateZoomSignature);
zoomRouter.post("/create-meeting",getZoomToken,zoomController.createZoomMeeting);
zoomRouter.get("/start-meeting/:id",verifyOauthClientToken,zoomController.startZoomMeeting);
zoomRouter.post("/join-meeting/:id",zoomController.joinZoomMeeting);
// zoomRouter.post("/create-session",getZoomToken,zoomController.createZoomSession);


//for akartech zoom meeting link creation
zoomRouter.post("/create-zoom-meeting-link",getZoomToken,zoomController.createZoomMeetingLink);



export default zoomRouter;

