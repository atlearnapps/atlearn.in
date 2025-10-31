import express from "express";
const userRouter = express.Router();
import userController from "../controller/userController.js";
import { verifyToken } from "../verifyToken.js";
import upload from "../multer/Multer.js";
import lmsController from "../controller/lmsController.js";
// userRouter.get("/getAllUsers",verifyToken, userController.getAllUsers);
// userRouter.get("/:id",verifyToken, userController.getUserById);
// userRouter.post("/", userController.postUser);
// userRouter.patch("/:id",verifyToken, userController.patchUserById);
// userRouter.delete("/:id",verifyToken, userController.deleteUserById);
// userRouter.post("/login",userController.login);

// new user
userRouter.post("/create",userController.createNewUser);
userRouter.delete("/remove/:id",verifyToken,userController.deleteNewUser);
userRouter.put("/update/:id",verifyToken,userController.patchNewUser);
userRouter.post("/uploadProfile/:id",verifyToken,upload.single('image'),userController.uploadProfile);
userRouter.delete("/delete_profile/:id",verifyToken,userController.deleteProfile);
userRouter.get("/transaction_details",verifyToken,userController.get_transactions);
userRouter.post("/contact",userController.contact);
userRouter.post("/change-plan",verifyToken,userController.changePlan);
userRouter.get("/expired-plan",verifyToken,userController.expiredPlan);
userRouter.post('/add_bank_details',verifyToken,userController.addBankDeails);
// userRouter.get("/all-teachers",userController.getAllTeachers);
// userRouter.post("/login",userController.newLogin);
// userRouter.post("/change_password/:id",verifyToken,userController.changePwdByUserId);
// userRouter.post("/forgetpassword",userController.forgetPassword);
// userRouter.post("/restpassword/:id",userController.resetPassword);
// userRouter.post("/room_payment",userController.createPayment);

// for admin 
userRouter.get("/getAll",verifyToken,userController.getAllNewUsers);
userRouter.get("/banned",verifyToken,userController.bannedUsers);
userRouter.get("/pending_user",verifyToken,userController.pendingUser);
userRouter.post("/invite_user",verifyToken,userController.inviteUser);
userRouter.get("/verify_invite_user/:id",userController.verifyInviteUser);

//roles
userRouter.post("/roles/add",verifyToken,userController.createRole);
userRouter.get("/roles/getAll",verifyToken,userController.getRoles);
userRouter.get("/roles/:id",verifyToken,userController.getRoleById);
userRouter.patch("/roles/update/:id",verifyToken,userController.updateRole);
userRouter.delete("/roles/remove/:id",verifyToken,userController.deleteRole);
userRouter.post("/add-role",userController.addRole)


//verifyEmail

userRouter.get("/verifyemail/:id",userController.verifyEmail)

//for LMS 

userRouter.post('/update_profile',lmsController.updateUserProfile)

export default userRouter;