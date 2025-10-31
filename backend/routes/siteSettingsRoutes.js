import express from "express";
const siteSettingsRouter = express.Router();
import { verifyToken } from "../verifyToken.js";
import siteSettingsController from "../controller/siteSettingsController.js";

siteSettingsRouter.post("/get",siteSettingsController.getSiteSettings);
siteSettingsRouter.put("/update/:id",verifyToken,siteSettingsController.patchSiteSettingsById);
siteSettingsRouter.put("/delete/:id",verifyToken,siteSettingsController.deleteSettingsById)

export default siteSettingsRouter;