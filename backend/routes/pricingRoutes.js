import express from "express";
const pricingRouter = express.Router();
import pricingController from "../controller/pricingController.js";
import { verifyToken } from "../verifyToken.js"

pricingRouter.get("/",pricingController.getPricing);
pricingRouter.post("/update",verifyToken,pricingController.updatePlans);
pricingRouter.post("/create_plan",verifyToken,pricingController.createPlan);
pricingRouter.delete("/delete_plan/:id",verifyToken,pricingController.deletePlan);
pricingRouter.get("/get_addon_plan",verifyToken,pricingController.getAddonPlan)
pricingRouter.post("/update_addon_plan",verifyToken,pricingController.updateAddonPlan)

export default pricingRouter;