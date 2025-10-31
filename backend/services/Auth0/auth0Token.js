import axios from "axios";

export async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://dev-yqj2guchohe24jhn.us.auth0.com/oauth/token",
      {
        client_id: "b8J2V8zENcfQOZZLQ4plLXGPhZ5rVvPK",
        client_secret:
          "lmlUaVThNZGYpHRKIq8eIH0kU_hmkqTv78437T5XrspCGiB7BUwUxFA3tp5qt972",
        audience: "https://dev-yqj2guchohe24jhn.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
      },
      { headers: { "content-type": "application/json" } }
    );

    return {
      token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}
