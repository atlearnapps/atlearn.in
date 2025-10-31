// controllers/calendarController.js
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
const { OAuth2 } = google.auth;

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'profile', 'email'];

// Load OAuth2 credentials
let oAuth2Client;
function loadCredentials() {
  oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CLIENT_ALTERNATIVE_REDIRECT_URL);
}

// Authorize function
async function authorize(email) {
  return new Promise((resolve, reject) => {
    const filePath = path.join('token', `${email}.json`);
    console.log('filePath', filePath)
    fs.readFile(filePath, (err, token) => {
      if (err) return reject('Error reading token, user needs to authorize.');
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });
}

// Create a calendar event
async function createEvent(req, res) {
  const { summary, location, description, startTime, endTime, attendees, email } = req.body;
    console.log('summary', summary);
  if (!summary || !startTime || !endTime || !email) {
    return res.status(400).send('Missing required fields: summary, startTime, endTime, email');
  }

  try {
    const auth = await authorize(email);
    console.log('auth', auth);
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: summary,
      location: location,
      description: description,
      start: {
        dateTime: startTime, // Example: '2024-11-15T09:00:00-07:00'
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endTime, // Example: '2024-11-15T10:00:00-07:00'
        timeZone: 'America/Los_Angeles',
      },
      attendees: attendees || [],
      reminders: {
        useDefault: true,
      },
    };

    calendar.events.insert(
      {
        calendarId: 'primary',
        resource: event,
      },
      (err, event) => {
        if (err) {
          return res.status(500).send('Error creating event: ' + err);
        }
        res.status(200).send({
          message: 'Event created successfully!',
          eventLink: event.data.htmlLink,
        });
      }
    );
  } catch (err) {
    res.status(500).send('Authorization error: ' + err);
  }
}

// Generate authorization URL
function generateAuthUrl(req, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.send({ authUrl });
}

// Callback for handling OAuth2 token exchange
async function handleOAuthCallback(req, res) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('No code found');
    }
  
    try {
      // Get the tokens from Google
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
        console.log('oAuth2Client', tokens)
      // Save tokens to the database
      
    // Now we can retrieve the user's email and profile info using the People API
    const peopleAPI = google.people({ version: 'v1', auth: oAuth2Client });

    const me = await peopleAPI.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses', // Specify that we want email addresses
    });
    console.log('me', me);
    const userEmail = me.data.emailAddresses[0].value; // Extract email from response
      fs.writeFileSync(`token/${userEmail}.json`, JSON.stringify(tokens));
  
    //   if (user) {
    //     // Update existing user with new tokens
    //     user.accessToken = tokens.access_token;
    //     user.refreshToken = tokens.refresh_token;
    //     user.tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);
    //     await user.save();
    //   } else {
    //     // Create a new user record
    //     await User.create({
    //       email: userEmail,
    //       accessToken: tokens.access_token,
    //       refreshToken: tokens.refresh_token,
    //       tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
    //     });
    //   }
  
      res.send('Authentication successful! You can now create events.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during authentication');
    }
//   const code = req.query.code;

//   oAuth2Client.getToken(code, (err, token) => {
//     console.log('err', err);
//     if (err) return res.status(500).send('Error retrieving access token');
//     oAuth2Client.setCredentials(token);
//     fs.writeFileSync('token.json', JSON.stringify(token));
//     res.send('Authorization successful! You can now create events.');
//   });
}

// Load credentials when starting the app
loadCredentials();

// Export controller functions
export default {
  createEvent,
  generateAuthUrl,
  handleOAuthCallback,
};
