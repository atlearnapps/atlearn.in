import express from "express";
const sessionRoutes = express.Router();
import { verifyToken } from "../verifyToken.js";
import sessionController from "../controller/sessionController.js";

sessionRoutes.get("/",verifyToken,sessionController.session);


export default sessionRoutes;