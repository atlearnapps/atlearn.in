import express from "express";
const roomConfigRouter = express.Router();
import { verifyToken } from "../verifyToken.js";
import { verifyOauthClientToken } from "../verifyOauthClientToken.js";
import roomConfigController from "../controller/roomConfigController.js";

roomConfigRouter.get("/getAll",verifyToken, roomConfigController.getAllRoomConfig);
roomConfigRouter.put("/update/:id",verifyOauthClientToken,roomConfigController.patchRoomConfigById);

export default roomConfigRouter;