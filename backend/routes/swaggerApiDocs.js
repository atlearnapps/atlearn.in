/**
 * @swagger
 * tags:
 *   name: Users
 *   description:
 */

// /**
//  * @swagger
//  * /api/user/getAll:
//  *   get:
//  *     summary: Get all users
//  *     tags: [Users]
//  */
// /**
//      * @swagger
//      * /api/user/create:
//      *   post:
//      *     summary: Add User
//      *     tags: [Users]
//      *     parameters:
//    *       - in: query
//    *         name: name
//    *         schema:
//    *           type: string
//    *         required: true
//    *         description: 
//     *       - in: query
//    *         name: email
//    *         schema:
//    *           type: string
//    *         required: true
//    *         description: 
//    *       - in: query
//    *         name: password
//    *         schema:
//    *           type: string
//    *         required: true
//    *         description: 
//      */

 /**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get particular users
 *     tags: [Users]
 */  
  /**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update users
 *     tags: [Users]
 */ 
/**
     * @swagger
     * /api/user/change_password/{id}:
     *   post:
     *     summary: Change User Password
     *     tags: [Users]
     *     parameters:
   *       - in: query
   *         name: old_password
   *         schema:
   *           type: string
   *         required: true
   *         description: 
    *       - in: query
   *         name: new_password
   *         schema:
   *           type: string
   *         required: true
   *         description: 
   *       - in: query
   *         name: confirm_password
   *         schema:
   *           type: string
   *         required: true
   *         description: 
     */
//   /**
//  * @swagger
//  * /api/user/remove/{id}:
//  *   delete:
//  *     summary: delete users
//  *     tags: [Users]
//  */ 

//Meetings API's

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description:
 */
  /**
 * @swagger
 * /api/bbb/start/{id}:
 *   post:
 *     summary: Start meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */  
  /**
 * @swagger
 * /api/bbb/end/{id}:
 *   get:
 *     summary: End meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/bbb/join/{id}:
 *   get:
 *     summary: Join meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/bbb/record/{id}:
 *   get:
 *     summary: Get Recordings
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/bbb/runningInfo/{id}:
 *   get:
 *     summary: Get Meeting Info
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/bbb/record/{id}:
 *   delete:
 *     summary: Delete Recording
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the room's friendly ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */

//   /**
//  * @swagger
//  * /api/bbb/recordings/getAll:
//  *   get:
//  *     summary: Get All Recordings
//  *     tags: [Meetings]
//  *     responses:
//  *       200:
//  *         description: Successful response
//  *       401:
//  *         description: Unauthorized
//   *     parameters:
//    *       - in: query
//    *         name: page
//    *         schema:
//    *           type: number
//    *         required: true
//    *         description: 
//     *       - in: query
//    *         name: perPage
//    *         schema:
//    *           type: number
//    *         required: true
//    *         description: 
//    * 
//  */

// // Roles API's

// /**
//  * @swagger
//  * tags:
//  *   name: Roles
//  *   description: 
//  */
// /**
//  * @swagger
//  * /api/user/roles/getAll:
//  *   get:
//  *     summary: Get All Roles
//  *     tags: [Roles]
//  */
//   /**
//  * @swagger
//  * /api/user/roles/add:
//  *   post:
//  *     summary: Add Role
//  *     tags: [Roles]
//  *     requestBody:
//  *       description: Request body for creating roles
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               color:
//  *                 type: string
//  *               provider:
//  *                 type: string
//  */


// Auth API's

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 
 */

//   /**
//  * @swagger
//  * /api/user/login:
//  *   post:
//  *     summary: Login
//  *     tags: [Auth]
//  *     requestBody:
//  *       description: Request body for login
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  */
  /**
 * @swagger
 * /api/oauth/generate:
 *   post:
 *     summary: Generate client credentials
 *     tags: [Auth] 
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/oauth/regenerate-secret:
 *   put:
 *     summary: Re-generate client seceret
 *     tags: [Auth] 
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/oauth/revoke:
 *   delete:
 *     summary: Delete client credentials
 *     tags: [Auth] 
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
  /**
 * @swagger
 * /api/oauth/generate-token:
 *   post:
 *     summary: Generate token using client credentials
 *     tags: [Auth]
*     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: string
 *               client_secret:
 *                 type: string
*     responses:
 *       200:
 *         description: Success 
 */

// // Site Settings API's

// /**
//  * @swagger
//  * tags:
//  *   name: Site Settings
//  *   description: 
//  */

//   /**
//  * @swagger
//  * /api/site_settings/get:
//  *   post:
//  *     summary: Get site settings
//  *     tags: [Site Settings]
// *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["John", "Doe"]
// *     responses:
//  *       200:
//  *         description: Success 
//  */
//   /**
//  * @swagger
//  * /api/site_settings/update/{id}:
//  *   put:
//  *     summary: Update site settings
//  *     tags: [Site Settings]
//   *     parameters:
//     *       - in: query
//    *         name: value
//    *         schema:
//    *           type: string
//    *         required: true
//    *         description: 
//  */

// // Room Configuration API's

// /**
//  * @swagger
//  * tags:
//  *   name: Room Configuration
//  *   description: 
//  */

//   /**
//  * @swagger
//  * /api/room_configuration/getAll:
//  *   get:
//  *     summary: Get room configuration
//  *     tags: [Room Configuration] 
//  *     responses:
//  *       200:
//  *         description: Successful response
//  *       401:
//  *         description: Unauthorized
//  */
//   /**
//  * @swagger
//  * /api/room_configuration/update/{id}:
//  *   put:
//  *     summary: Update room configuration
//  *     tags: [Room Configuration]
//   *     parameters:
//     *       - in: query
//    *         name: value
//    *         schema:
//    *           type: string
//    *         required: true
//    *         description: 
//  */

// // Role Permissions API's

// /**
//  * @swagger
//  * tags:
//  *   name: Role Permissions
//  *   description: 
//  */

//   /**
//  * @swagger
//  * /api/role_permission/getAll:
//  *   get:
//  *     summary: Get role permissions
//  *     tags: [Role Permissions]
//  */
//   /**
//  * @swagger
//  * /api/role_permission/get/{id}:
//  *   get:
//  *     summary: Get particular role permissions
//  *     tags: [Role Permissions]
//  */
//   /**
//  * @swagger
//  * /api/role_permission/update/{role_id}:
//  *   put:
//  *     summary: Update role permissions
//  *     tags: [Role Permissions]
//  *     requestBody:
//  *       description: Request body for getting role permissions
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               role_id:
//  *                 type: string
//  *               permission_id:
//  *                 type: string
//  *               value:
//  *                 type: string
//  */

// Rooms API's

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: 
 */
//   /**
//  * @swagger
//  * /api/room/create:
//  *   post:
//  *     summary: Create Room
//  *     tags: [Rooms]
//  *     requestBody:
//  *       description: Request body for creating room
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  */
/**
 * @swagger
 * /api/room/create:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the room
 *               room_type:
 *                 type: string
 *                 description: Type of room
 *               provider:
 *                 type: string
 *                 description: Provider of the room (bbb or zoom)
 *     responses:
 *       '200':
 *         description: Room created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
 /**
 * @swagger
 * /api/room/getAllRooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 */
 /**
 * @swagger
 * /api/room/remove/{id}:
 *   delete:
 *     summary: Delete room
 *     tags: [Rooms]
 */
 /**
 * @swagger
 * /api/room/settings/getAll/{id}:
 *   get:
 *     summary: Get all room settings
 *     tags: [Rooms]
 */
/**
 * @swagger
 * /api/room/settings/update/{id}:
 *   patch:
 *     summary: Update room settings
 *     tags: [Rooms]
 */
/**
 * @swagger
 * /api/room/update:
 *   post:
 *     summary: Update an existing room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Room ID
 *               name:
 *                 type: string
 *                 description: Name of the room
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the room
 *               room_type:
 *                 type: string
 *                 description: Type of room
 *               provider:
 *                 type: string
 *                 description: Provider of the room (bbb or zoom)
 *     responses:
 *       '200':
 *         description: Room created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
  /**
 * @swagger
 * /api/room/share_access/create:
 *   post:
 *     summary: Create shared access room
 *     tags: [Rooms]
 *     requestBody:
 *       description: Request body for creating shared access room
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
  *               room_id:
 *                 type: string
 */
 /**
 * @swagger
 * /api/room/share_access/getAll:
 *   get:
 *     summary: Get shared access room
 *     tags: [Rooms]
 */
 /**
 * @swagger
 * /api/room/share_access/delete/{id}:
 *   delete:
 *     summary: Delete share access
 *     tags: [Rooms]
 */

//   /**
//  * @swagger
//  * /api/room/getAll:
//  *   get:
//  *     summary: Get all rooms
//  *     tags: [Rooms]
//   *     parameters:
//     *       - in: query
//    *         name: page
//    *         schema:
//    *           type: number
//    *         required: true
//    *         description: 
//    *       - in: query
//    *         name: perPage
//    *         schema:
//    *           type: number
//    *         required: true
//    *         description: 
//  */

   /**
 * @swagger
 * /api/room/schedule_meeting:
 *   post:
 *     summary: Create a scheduled meeting
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *               - guestEmail
 *               - roomid
 *               - public_view
 *             properties:
 *               title:
 *                 type: string
 *                 description: Meeting title
 *               description:
 *                 type: string
 *                 description: Meeting description
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Meeting start date and time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Meeting end date and time
 *               guestEmail:
 *                 type: string
 *                 description: Guest email
 *               roomid:
 *                 type: string
 *                 description: Room ID
 *               public_view:
 *                 type: boolean
 *                 description: Public view status
 *     responses:
 *       '200':
 *         description: Meeting created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/room/updateScheduleMeeting/{id}:
 *   post:
 *     summary: Update a scheduled meeting
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *               - guestEmail
 *               - roomid
 *               - public_view
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               guestEmail:
 *                 type: string
 *               roomid:
 *                 type: string
 *               url:
 *                 type: string
 *                 description: Meeting URL
 *               public_view:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Meeting updated successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/room/getSingleScheduleMeeting/{id}:
 *   get:
 *     summary: Get a single scheduled meeting
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled meeting ID
 *     responses:
 *       '200':
 *         description: Meeting details retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
 /**
 * @swagger
 * /api/room/getScheduledMeetingonly:
 *   get:
 *     summary: Get all scheduled meetings
 *     tags: [Rooms]
 *     responses:
 *       '200':
 *         description: Meetings retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
 /**
 * @swagger
 * /api/room/fetch_room_scheduled_meetings/{id}:
 *   get:
 *     summary: Fetch scheduled meetings for a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room
 *     responses:
 *       '200':
 *         description: Successfully retrieved scheduled meetings
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Room not found
 *       '500':
 *         description: Internal Server Error
 */
 /**
 * @swagger
 * /api/room/deleteScheduleMeeting/{id}:
 *   delete:
 *     summary: Delete a scheduled meeting
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled meeting ID
 *     responses:
 *       '200':
 *         description: Meeting deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * tags:
 *   name: Zoom
 *   description: 
 */
/**
 * @swagger
 * /api/zoom/start-meeting/{id}:
 *   post:
 *     summary: Start a Zoom meeting
 *     tags: [Zoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The friendly ID of the Room
 *     responses:
 *       '200':
 *         description: Meeting started successfully
 *       '401':
 *         description: Unauthorized - Invalid or missing token
 *       '404':
 *         description: Meeting not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/zoom/join-meeting/{id}:
 *   post:
 *     summary: Join a Zoom meeting
 *     tags: [Zoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the Zoom meeting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Your name (required)
 *               access_code:
 *                 type: string
 *                 description: Access code if required (optional)
 *     responses:
 *       '200':
 *         description: Successfully joined the Zoom meeting
 *       '400':
 *         description: Bad request (missing required fields)
 *       '401':
 *         description: Unauthorized (invalid token)
 *       '404':
 *         description: Meeting not found
 *       '500':
 *         description: Internal Server Error
 */

// // External Auth API's

// /**
//  * @swagger
//  * tags:
//  *   name: External Auth
//  *   description: 
//  */
//  /**
//  * @swagger
//  * /api/auth/google:
//  *   get:
//  *     summary: Google auth
//  *     tags: [External Auth]
//  */
//  /**
//  * @swagger
//  * /api/tokenVerify:
//  *   get:
//  *     summary: verify user token
//  *     tags: [External Auth]
//  */
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello, Swagger!" });
});

export default router;
