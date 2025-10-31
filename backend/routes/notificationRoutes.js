import express from "express";
const notificationRoutes = express.Router();
import { verifyToken } from "../verifyToken.js";
import notificationController from "../controller/notificationController.js";

notificationRoutes.get("/get_notification",verifyToken,notificationController.getNotification);
notificationRoutes.get("/markAsRead",verifyToken,notificationController.markReadNotification);
notificationRoutes.post("/createNotification",verifyToken,notificationController.createNewNotification);
// notificationRoutes.get("/checkmoment",notificationController.checkMoments);
notificationRoutes.post("/deleteNotification",verifyToken,notificationController.deleteNotification);
// notificationRoutes.get("/checkScheduleMeetings",notificationController.checkScheduleMeeting);
notificationRoutes.get("/deleteAllNotificationById",verifyToken,notificationController.deleteAllNotificationById)

export default notificationRoutes;