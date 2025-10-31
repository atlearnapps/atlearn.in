import express from "express";

import { authMiddleware } from "../services/Auth0/authMiddleware.js";
import { createUser, deleteUser, getUser, getUsers, updateAuth0UserMetadata, updateUser } from "../controller/auth0Controller.js";
import { auth } from "express-oauth2-jwt-bearer";


const auth0Router = express.Router();

auth0Router.use(authMiddleware); // 👈 protect all user routes

auth0Router.get("/", getUsers);
auth0Router.get("/:id", getUser);
auth0Router.post("/", createUser);
auth0Router.patch("/:id", updateUser);
auth0Router.delete("/:id", deleteUser);
auth0Router.patch("/metadata/:id", updateAuth0UserMetadata);

export default auth0Router;
