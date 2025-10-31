import express from "express";
const dashboardRouter = express.Router();
import dashboardController from "../controller/dashboardController.js";
import { verifyToken } from "../verifyToken.js"
import { getZoomToken } from "../services/Zoom/ZoomToken.js";

dashboardRouter.get("/liveroom",verifyToken,getZoomToken,dashboardController.liveRooms);
dashboardRouter.post("/rooms_count",verifyToken,dashboardController.roomcount);
dashboardRouter.get("/room_updates",verifyToken,dashboardController.roomsUpdates);
dashboardRouter.post("/room_status",verifyToken,dashboardController.roomStatus);
dashboardRouter.get("/subscription_count",verifyToken,dashboardController.subscriptionCount)
dashboardRouter.get("/scheduleMeetingOrder",verifyToken,dashboardController.scheduleMeetingOrder);
dashboardRouter.get("/invitesSent",verifyToken,dashboardController.invitesSent);
dashboardRouter.get("/get_feedback",verifyToken,dashboardController.getFeedback);
dashboardRouter.delete("/delete_feedback/:id",verifyToken,dashboardController.deleteFeedback);
dashboardRouter.get("/get_all_transaction",verifyToken,dashboardController.allTransaction);
dashboardRouter.delete("/delete_transaction/:id",verifyToken,dashboardController.delete_Transaction);
dashboardRouter.get("/allusers",verifyToken,dashboardController.allUsers);
dashboardRouter.get("/roomShared",verifyToken,dashboardController.roomShareDetails);
dashboardRouter.post("/send_mails",verifyToken,dashboardController.sendMail);
export default dashboardRouter;

