import { getAccessToken } from "./auth0Token.js";

let cachedToken = null;
let tokenExpiry = 0;

export async function authMiddleware(req, res, next) {
  try {
    const now = Date.now();

    if (!cachedToken || now >= tokenExpiry) {
      const { token, expires_in } = await getAccessToken();
      cachedToken = token;
      tokenExpiry = now + (expires_in - 60) * 1000; // buffer 1 min
    }

    req.auth0Token = cachedToken;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get access token", details: error.message });
  }
}
