import express from "express";
const checkoutRouter = express.Router();
import checkoutController from "../controller/checkoutController.js";
import { verifyToken } from "../verifyToken.js";

checkoutRouter.post("/",verifyToken,checkoutController.checkOut);
checkoutRouter.post("/verifyPayment",verifyToken,checkoutController.verifyPayment);
checkoutRouter.post("/createaccount",verifyToken,checkoutController.createAccount);
checkoutRouter.post(
  "/create-checkout-session",verifyToken,checkoutController.checkoutSession
);
checkoutRouter.post("/addTransaction",verifyToken, checkoutController.addTransaction);
checkoutRouter.post("/payment-success", verifyToken,checkoutController.paymentSuccess);
checkoutRouter.post("/cancelTransaction",verifyToken,checkoutController.cancelTransaction);
checkoutRouter.post("/get_details",verifyToken,checkoutController.getTransationDetails);
checkoutRouter.post("/failed_transaction",verifyToken,checkoutController.failedTransation);
checkoutRouter.post("/addonPaymentVerification",checkoutController.addonpaymentVerification);
checkoutRouter.post("/roomPayment",verifyToken,checkoutController.scheduleMeetingPaymentVerification)
export default checkoutRouter;
