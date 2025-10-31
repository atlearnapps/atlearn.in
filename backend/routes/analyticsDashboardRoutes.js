import express from "express";
const analyticsDashboardRoutes = express.Router();
import { verifyToken } from "../verifyToken.js";
import analyticsDashboardController from "../controller/analyticsDashbaordController.js";

analyticsDashboardRoutes.post("/", analyticsDashboardController.postAnalyticsDashboard);
analyticsDashboardRoutes.get("/total_duration",verifyToken, analyticsDashboardController.getTotalDurationForUser);
analyticsDashboardRoutes.get("/total_duration/:id",verifyToken, analyticsDashboardController.getTotalDurationForRoom);
analyticsDashboardRoutes.get("/get_all", verifyToken, analyticsDashboardController.getAllAnalyticsDashboard);
analyticsDashboardRoutes.get("/get_all/:id", verifyToken,analyticsDashboardController.getAllByMeetingIdAnalyticsDashboard);

export default analyticsDashboardRoutes;
