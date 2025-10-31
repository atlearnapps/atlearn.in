import axios from "axios";
import { getAccessToken } from "./auth0Token.js";

const BASE_URL = "https://dev-yqj2guchohe24jhn.us.auth0.com/api/v2";

async function getAllUsers(token, search = "") {
  const params = {};
  if (search) {
    params.q = search; // Example: "email:*gmail.com" OR "name:John"
    params.search_engine = "v3"; // Auth0 requires this
  }
  const res = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
}

async function getUserById(token, userId) {
  const res = await axios.get(
    `${BASE_URL}/users/${encodeURIComponent(userId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

async function createUser(token, userData) {
  const res = await axios.post(`${BASE_URL}/users`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function updateUser(token, userId, userData) {
  const res = await axios.patch(
    `${BASE_URL}/users/${encodeURIComponent(userId)}`,
    userData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

async function deleteUser(token, userId) {
  await axios.delete(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { message: "User deleted successfully" };
}

async function updateAuth0UserMetadata(userId, metadata) {
  try {
    const { token } = await getAccessToken();

    const response = await axios.patch(
      `${BASE_URL}/users/${encodeURIComponent(userId)}`,
      {
        app_metadata: metadata, // 👈 stored in Auth0 metadata
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating Auth0 metadata:",
      error.response?.data || error
    );
    throw new Error("Unable to update Auth0 user metadata");
  }
}
async function updateprofile(userId, data) {
  try {
    const { token } = await getAccessToken();

    const response = await axios.patch(
      `${BASE_URL}/users/${encodeURIComponent(userId)}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Auth0 ", error.response?.data || error);
    throw new Error("Unable to update Auth0 user ");
  }
}
async function deleteAccount(userId) {
  try {
    const { token } = await getAccessToken();

    const response = await axios.delete(
      `${BASE_URL}/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting Auth0 ", error.response?.data || error);
    throw new Error("Unable to delete Auth0 user ");
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateAuth0UserMetadata,
  updateprofile,
  deleteAccount,
};
