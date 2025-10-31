import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Oauth_clients from "../models/oauth_clients.js";
import Users from "../models/users.js";

// Generate a new Client ID & Secret
export const generateClient = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // const { email } = req.body;

    const user = await Users.findOne({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user already has a client ID
    const existingClient = await Oauth_clients.findOne({
      where: { user_id: user.id },
    });
    if (existingClient) {
      return res.status(400).json({ error: "User already has a client ID" });
    }

    // const client_id = `client_${crypto.randomUUID()}`;
    const client_secret = crypto.randomBytes(32).toString("hex");
    const hashedSecret = await bcrypt.hash(client_secret, 10);

    const client = await Oauth_clients.create({
      client_secret: hashedSecret,
      user_id: user.id,
    });

    res.json({
      client_id: client.client_id,
      client_secret: client_secret,
      updated_at: client.updated_at,
      created_at: client.updated_at,
    });
  } catch (error) {
    console.error("Error generating client ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Revoke Client ID
export const revokeClient = async (req, res) => {
  try {
    // const { email } = req.body;
    const userId = req.user.user_id;
    const user = await Users.findOne({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const deleted = await Oauth_clients.destroy({
      where: { user_id: user.id },
    });

    if (!deleted)
      return res.status(404).json({ error: "No active client ID found" });

    res.json({ message: "Client ID revoked successfully" });
  } catch (error) {
    console.error("Error revoking client ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Re-generate Client Secret
export const regenerateSecret = async (req, res) => {
  try {
    // const { email } = req.body;
    const userId = req.user.user_id;
    const user = await Users.findOne({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const client = await Oauth_clients.findOne({ where: { user_id: user.id } });
    if (!client) return res.status(404).json({ error: "Client ID not found" });

    const newSecret = crypto.randomBytes(32).toString("hex");
    const hashedSecret = await bcrypt.hash(newSecret, 10);

    await Oauth_clients.update(
      { client_secret: hashedSecret },
      { where: { user_id: user.id } }
    );

    res.json({ client_id: client.client_id, new_client_secret: newSecret });
  } catch (error) {
    console.error("Error regenerating client secret:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateOauthToken = async (req, res) => {
  try {
    const { client_id, client_secret } = req.body;

    // Validate client
    const client = await Oauth_clients.findOne({
      where: { client_id },
      include: [{ model: Users, as: "user" }],
    });
    if (!client) {
      console.log("lient.dataValues.user_id", client.dataValues.user_id);
      return res.status(401).json({ error: "Invalid client credentials" });
    }

    const isMatch = await bcrypt.compare(client_secret, client.client_secret);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid client credentials" });

    // Generate a token with `client_id` and `user_id`
    const token = jwt.sign(
      { client_id, user_id: client.user_id },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );

    res.json({ access_token: token, token_type: "Bearer", expires_in: 3600 });
  } catch (error) {
    console.error("OAuth Token Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCredential = async (req, res) => {
  try {
    const { user_id: userId } = req.user;

    const user = await Users.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const client = await Oauth_clients.findOne({ where: { user_id: userId } });
    if (!client) return res.status(404).json({ error: "Client ID not found" });

    res.json({
      client_id: client.client_id,
    });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
