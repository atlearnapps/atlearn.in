import express from "express";
const oauthClientsRoutes = express.Router();
import { verifyToken } from "../verifyToken.js";
import { generateClient, revokeClient, regenerateSecret, generateOauthToken,getCredential } from "../controller/oauthClientsController.js";

oauthClientsRoutes.post("/generate", verifyToken, generateClient);
oauthClientsRoutes.delete("/revoke", verifyToken, revokeClient);
oauthClientsRoutes.put("/regenerate-secret",verifyToken, regenerateSecret);
oauthClientsRoutes.post("/generate-token", generateOauthToken);
oauthClientsRoutes.get('/get-credential',verifyToken,getCredential)

export default oauthClientsRoutes;