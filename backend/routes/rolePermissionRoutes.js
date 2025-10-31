import express from "express";
const rolePermissionRouter = express.Router();
import { verifyToken } from "../verifyToken.js";
import rolePermissionController from "../controller/rolePermissionController.js";

rolePermissionRouter.get("/getAll",verifyToken, rolePermissionController.getAllRolePermission);
rolePermissionRouter.get("/get/:id",verifyToken, rolePermissionController.getRolePermissionById);
rolePermissionRouter.put("/update",verifyToken, rolePermissionController.patchRolePermission);

export default rolePermissionRouter;