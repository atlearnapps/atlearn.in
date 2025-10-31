import Meeting_options from "../models/meeting_options.js";
import Pricing from "../models/pricing.js";
import Roles from "../models/roles.js";
import Room_meeting_options from "../models/room_meeting_options.js";
import Rooms from "../models/rooms.js";
import Schedule_room_meeting from "../models/schedule_room_meeting.js";
import Shared_accesses from "../models/shared_accesses.js";
import Transaction from "../models/transaction.js";
import Users from "../models/users.js";
import auth0Service from "../services/Auth0/auth0Service.js";
import calculateDates from "../utils/calculateDates.js";

export async function getUsers(req, res) {
  try {
    const { search } = req.query;
    const users = await auth0Service.getAllUsers(req.auth0Token, search);
    res.json(users);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
}

export async function getUser(req, res) {
  try {
    const user = await auth0Service.getUserById(req.auth0Token, req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const user = await auth0Service.createUser(req.auth0Token, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
}

// export async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     const body = req.body;

//     // Build update payload only with provided fields
//     const updatePayload = {};
//     if (body?.name !== undefined && body?.name !== null) {
//       updatePayload.name = body.name;
//     }
//     if (body?.email !== undefined && body?.email !== null) {
//       updatePayload.email = body.email;
//     }
//     if (body?.email_verified !== undefined && body?.email_verified !== null) {
//       updatePayload.email_verified = body.email_verified;
//     }

//     // Update Auth0 user only if payload is not empty
//     // let updatedAuth0User = null;
//     if (Object.keys(updatePayload).length > 0) {
//       await auth0Service.updateUser(req.auth0Token, id, updatePayload);
//     }

//     // If no app_metadata provided → skip DB logic
//     if (body?.app_metadata) {
//       const dbUser = await Users.findOne({ where: { external_id: id } });
//       if (!dbUser) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const { subscription_id } = body.app_metadata;
//       if (subscription_id) {
//         const plan = await Pricing.findOne({ where: { id: subscription_id } });
//         if (!plan) {
//           return res.status(400).json({ error: "Invalid subscription_id" });
//         }

//         const subscriptionChanged =
//           plan.id !== dbUser.subscription_id ||
//           dbUser.trial === true ||
//           (plan.id === dbUser.subscription_id && dbUser.expired);

//         if (subscriptionChanged) {
//           // Expire active transactions
//           const activeTransactions = await Transaction.findAll({
//             where: { user_id: dbUser.id, status: "active" },
//           });

//           await Promise.all(
//             activeTransactions.map((t) => {
//               t.status = "expired";
//               return t.save();
//             })
//           );

//           // Disable recordings if plan disallows
//           if (plan.recording === "false") {
//             const meetingOption = await Meeting_options.findOne({
//               where: { name: "record" },
//             });

//             const rooms = await Rooms.findAll({
//               where: { user_id: dbUser.id },
//             });

//             await Promise.all(
//               rooms.map(async (room) => {
//                 const setting = await Room_meeting_options.findOne({
//                   where: {
//                     room_id: room.id,
//                     meeting_option_id: meetingOption.id,
//                   },
//                 });

//                 if (setting?.value === "true") {
//                   setting.value = "false";
//                   await setting.save();
//                 }
//               })
//             );
//           }

//           // Calculate subscription dates
//           const startDate = new Date();
//           const endDate = new Date(startDate);

//           let validationPeriodInDays;
//           if (plan.period === "month") {
//             const { numberOfDays } = await calculateDates(plan.Validity);
//             validationPeriodInDays = numberOfDays;
//           } else {
//             validationPeriodInDays = plan.Validity;
//           }
//           endDate.setDate(startDate.getDate() + validationPeriodInDays);

//           // Update user in DB
//           dbUser.subscription_id = plan.id;
//           dbUser.subscription_start_date = startDate
//             .toISOString()
//             .split("T")[0];
//           dbUser.subscription_expiry_date = endDate.toISOString().split("T")[0];
//           dbUser.expired = false;
//           dbUser.trial = plan.name === "Free";

//           await dbUser.save();

//           // Sync metadata back to Auth0
//         }
//         const { role_id } = body.app_metadata;
//         const roleRecord = await Roles.findOne({
//           where: { id: role_id },
//         });
//         if (!roleRecord) {
//           return res.status(404).json({ message: "Role not found" });
//         }
//         const roleChnages = dbUser.role_id !== roleRecord.id;
//         if (roleChnages) {
//           dbUser.role_id = roleRecord.id;
//           if(roleRecord.name === "Guest"){
//             dbUser.subscription_id = null;
//             dbUser.subscription_start_date = null;
//             dbUser.subscription_expiry_date = null;
//             dbUser.trial = false;
//             dbUser.expired = false;
//           }
//           await dbUser.save();
//         }

//         await auth0Service.updateAuth0UserMetadata(dbUser.external_id, {
//           role:
//             roleRecord.name === "Moderator"
//               ? "Teacher"
//               : roleRecord.name === "Guest"
//               ? "Student"
//               : roleRecord.name,
//           plan: roleRecord.name === "Guest" ? null : plan.name,
//           subscription_start_date:
//             roleRecord.name === "Guest" ? null : dbUser.subscription_start_date,
//           subscription_expiry_date:
//             roleRecord.name === "Guest"
//               ? null
//               : dbUser.subscription_expiry_date,
//           trial: roleRecord.name === "Guest" ? false : dbUser.trial,
//           expired: roleRecord.name === "Guest" ? false : dbUser.expired,
//         });
//       }
//     }

//     res.json({ message: "User updated successfully" });
//   } catch (err) {
//     res.status(500).json(err.response?.data || { error: err.message });
//   }
// }
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    // --- Step 1: Auth0 user updates ---
    const updatePayload = ["name", "email", "email_verified"].reduce(
      (acc, key) => {
        if (body?.[key] !== undefined && body?.[key] !== null) {
          acc[key] = body[key];
        }
        return acc;
      },
      {}
    );

    if (Object.keys(updatePayload).length > 0) {
      await auth0Service.updateUser(req.auth0Token, id, updatePayload);
    }

    // --- Step 2: DB updates only if app_metadata provided ---
    if (!body?.app_metadata) {
      return res.json({ message: "User updated successfully" });
    }

    const dbUser = await Users.findOne({ where: { external_id: id } });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { subscription_id, role_id } = body.app_metadata;

    // --- Step 2a: Handle subscription updates ---
    let plan = null;
    if (subscription_id) {
      plan = await Pricing.findOne({ where: { id: subscription_id } });
      if (!plan)
        return res.status(400).json({ error: "Invalid subscription_id" });

      const subscriptionChanged =
        plan.id !== dbUser.subscription_id ||
        dbUser.trial === true ||
        (plan.id === dbUser.subscription_id && dbUser.expired);

      if (subscriptionChanged) {
        // Expire active transactions
        const activeTransactions = await Transaction.findAll({
          where: { user_id: dbUser.id, status: "active" },
        });
        await Promise.all(
          activeTransactions.map((t) => t.update({ status: "expired" }))
        );

        // Disable recordings if plan disallows
        if (plan.recording === "false") {
          const meetingOption = await Meeting_options.findOne({
            where: { name: "record" },
          });
          const rooms = await Rooms.findAll({ where: { user_id: dbUser.id } });

          await Promise.all(
            rooms.map(async (room) => {
              const setting = await Room_meeting_options.findOne({
                where: {
                  room_id: room.id,
                  meeting_option_id: meetingOption.id,
                },
              });
              if (setting?.value === "true") {
                await setting.update({ value: "false" });
              }
            })
          );
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        const validityDays =
          plan.period === "month"
            ? (await calculateDates(plan.Validity)).numberOfDays
            : plan.Validity;
        endDate.setDate(startDate.getDate() + validityDays);

        // Update DB user subscription
        Object.assign(dbUser, {
          subscription_id: plan.id,
          subscription_start_date: startDate.toISOString().split("T")[0],
          subscription_expiry_date: endDate.toISOString().split("T")[0],
          expired: false,
          trial: plan.name === "Free",
        });

        await dbUser.save();
      }
    }

    // --- Step 2b: Handle role updates ---
    const roleRecord = await Roles.findOne({ where: { id: role_id } });
    if (!roleRecord) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (dbUser.role_id !== roleRecord.id) {
      dbUser.role_id = roleRecord.id;

      if (roleRecord.name === "Guest") {
        Object.assign(dbUser, {
          subscription_id: null,
          subscription_start_date: null,
          subscription_expiry_date: null,
          trial: false,
          expired: false,
        });
      }

      await dbUser.save();
    }

    // --- Step 3: Sync metadata back to Auth0 ---
    await auth0Service.updateAuth0UserMetadata(dbUser.external_id, {
      role:
        roleRecord.name === "Moderator"
          ? "Teacher"
          : roleRecord.name === "Guest"
          ? "Student"
          : roleRecord.name,
      plan: roleRecord.name === "Guest" ? null : plan?.name,
      subscription_start_date:
        roleRecord.name === "Guest" ? null : dbUser.subscription_start_date,
      subscription_expiry_date:
        roleRecord.name === "Guest" ? null : dbUser.subscription_expiry_date,
      trial: roleRecord.name === "Guest" ? false : dbUser.trial,
      expired: roleRecord.name === "Guest" ? false : dbUser.expired,
    });

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
}

// export async function deleteUser(req, res) {
//   try {
//     const result = await auth0Service.deleteUser(req.auth0Token, req.params.id);
//     const user = await Users.findOne({ where: { external_id: req.params.id } });
//     if (user) {
//     const rooms = await Rooms.findAll({ where: { user_id: user.id } }); // Find all rooms associated with the user

//     if (rooms.length > 0) {
//       for (const room of rooms) {
//         // Delete meeting options for each room
//         await Room_meeting_options.destroy({ where: { room_id: room.id } });

//         // Delete schedule meeting for each room
//         await Schedule_room_meeting.destroy({ where: { room_id: room.id } });

//         await Shared_accesses.destroy({ where: { room_id: room.id } });
//         // await Shared_accesses.destroy({where: {user_id: id}})
//         // await Shared_accesses.destroy({
//         //   where: {
//         //     [Op.or]: [
//         //       { room_id: room.id },
//         //       { user_id: id }
//         //     ]
//         //   }
//         // });
//         // Delete the room
//         await Rooms.destroy({ where: { id: room.id } });

//         // Here you can include additional logic to handle history rooms if needed
//       }
//     }
//     await Shared_accesses.destroy({ where: { user_id: id } });

//     const roomdelete = await Rooms.destroy({ where: { user_id: id } });
//     const user = await Users.findOne({ where: { id: id } });

//     const deletedRowCount = await Users.destroy({ where: { id: id } });
//     if (deletedRowCount === 0) {
//       res.json({ message: "User not found", success: false });
//     } else {
//       res.send({ message: "User Deleted", success: true });
//     }
//     }
//     res.json(result);
//   } catch (err) {
//     res.status(500).json(err.response?.data || { error: err.message });
//   }
// }

export async function deleteUser(req, res) {
  try {
    const { id: externalId } = req.params;

    // 1. Delete user from Auth0 first
    const auth0Result = await auth0Service.deleteUser(
      req.auth0Token,
      externalId
    );

    // 2. Find the user in our DB
    const user = await Users.findOne({ where: { external_id: externalId } });
    if (!user) {
      return res.json({ message: "User not found in DB", success: false });
    }

    const userId = user.id;

    // 3. Get all rooms owned by this user
    const rooms = await Rooms.findAll({ where: { user_id: userId } });

    if (rooms.length > 0) {
      for (const room of rooms) {
        const roomId = room.id;

        // Delete related entities in parallel
        await Promise.all([
          Room_meeting_options.destroy({ where: { room_id: roomId } }),
          Schedule_room_meeting.destroy({ where: { room_id: roomId } }),
          Shared_accesses.destroy({ where: { room_id: roomId } }),
          Rooms.destroy({ where: { id: roomId } }),
        ]);
      }
    } else {
      console.log(`No rooms found for user ${userId}`);
    }

    // 4. Delete any shared accesses directly linked to the user
    await Shared_accesses.destroy({ where: { user_id: userId } });

    // 5. Finally, delete the user record
    const deletedRowCount = await Users.destroy({ where: { id: userId } });

    if (deletedRowCount === 0) {
      return res.json({ message: "User not found", success: false });
    }

    // 6. Success response
    return res.json({
      message: "User Deleted",
      success: true,
      auth0: auth0Result,
    });
  } catch (err) {
    return res.status(500).json(err.response?.data || { error: err.message });
  }
}

export async function updateAuth0UserMetadata(req, res) {
  try {
    const user = await auth0Service.updateAuth0UserMetadata(
      req.params.id,
      req.body
    );
    res.json(user);
  } catch (err) {
    res.status(500).json(err.response?.data || { error: err.message });
  }
}
