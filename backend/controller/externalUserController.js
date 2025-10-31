import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import jwt from "jsonwebtoken";
import Users from "../models/users.js";
import Roles from "../models/roles.js";
import Site_settings from "../models/site_settings.js";
import Settings from "../models/settings.js";
import Pricing from "../models/pricing.js";
import { notifyAdminsOfNewUser } from "../services/Notifications/notifications.js";
import calculateDates from "../utils/calculateDates.js";
import welcomeEmail from "../SendEmail/welcomeEmail.js";
import auth0Service from "../services/Auth0/auth0Service.js";

const externalUerRouter = express.Router();

// Configure Passport with Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google OAuth client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google OAuth client secret
      callbackURL: process.env.GOOGLE_CLIENT_REDIRECT_URL, // Update with your actual callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // This is the callback function that gets called after a successful authentication.
      // You can save user data to your database or perform other actions here.
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
        emailVerified: profile.emails[0].verified,
      };
      return done(null, newUser);
    }
  )
);

// Serialization and deserialization logic (saving and retrieving user data from the session)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initialize Passport and use express-session for session management
externalUerRouter.use(
  session({ secret: "farlanes", resave: true, saveUninitialized: true })
);
externalUerRouter.use(passport.initialize());
externalUerRouter.use(passport.session());

// Define routes for Google authentication
externalUerRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

externalUerRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/profile", // Redirect after successful sign-in
    failureRedirect: "/", // Redirect after failed sign-in
  })
);

// Protected route that requires authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

externalUerRouter.get("/", (req, res) => {
  res.send('<a href="/auth/google">Log in with Google</a>');
});

externalUerRouter.get("/profile", ensureAuthenticated, async (req, res) => {
  let userData = {
    name: req?.user?.displayName,
    provider: "google",
    external_id: req?.user?.googleId,
    email: req?.user?.email,
    verified: req?.user?.emailVerified,
  };
  const userdata = await Users.findOne({ where: { email: userData.email } });
  const registration = "RegistrationMethod";
  const siteSettingsValues = await Site_settings.findOne({
    include: [
      {
        model: Settings,
        where: {
          name: registration,
        },
      },
    ],
  });
  if (userdata) {
    if (siteSettingsValues.value === "invite") {
      if (userdata?.provider !== "google") {
        return res.redirect(
          `${process.env.CLIENT_URL}?message=You're not logged in with Google`
        );
      }
    }
    const token = jwt.sign(
      {
        user_id: userdata.id,
        username: userdata.name,
        email: userdata.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1d", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
      }
    );
    return res.redirect(`${process.env.CLIENT_URL}?auth=${token}`);
    // return res.send(`Welcome, ${req.user.displayName} ${token}! <a href="/logout">Logout</a> and already registered in DB`);
  } else {
    if (siteSettingsValues.value === "invite") {
      return res.redirect(
        `${process.env.CLIENT_URL}?message=You're not logged in with Google`
      );
    }
    if (!userData.provider) {
      userData.provider = "farlance";
    }
    if (!userData.language) {
      userData.language = "english";
    }
    if (!userData.approve) {
      userData.approve = true;
    }

    // if (!userData.role_id) {
    //   const name = "DefaultRole";
    //   const siteSettingsValues = await Site_settings.findOne({
    //     include: [
    //       {
    //         model: Settings,
    //         where: {
    //           name: name,
    //         },
    //       },
    //     ],
    //   });

    //   if (siteSettingsValues) {
    //     const role = siteSettingsValues.value;
    //     const roleId = await Roles.findOne({ where: { name: role } });
    //     if (roleId) {
    //       userData.role_id = roleId.id;
    //     } else {
    //       res.status(201).json({ message: "Not found Role" });
    //     }
    //   }
    // }

    if (userData?.role) {
      const role = userData?.role;
      const roleId = await Roles.findOne({ where: { name: role } });
      if (roleId) {
        userData.role_id = roleId.id;
      } else {
        res.status(201).json({ message: "Not found Role" });
      }
    }

    // if (!userData.subscription_id) {
    //   const plan = await Pricing.findOne({ where: { name: "Free" } });
    //   if(plan){
    //     userData.subscription_id = plan.id;
    //     userData.subscription_start_date = new Date().toISOString().split('T')[0];
    //   }
    // }

    if (!userData.subscription_id) {
      if (userData?.role !== "Guest" && userData?.role) {
        const plan = await Pricing.findOne({ where: { name: "Enterprise" } });

        if (plan) {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 3);

          userData.subscription_id = plan.id;
          userData.subscription_start_date = startDate
            .toISOString()
            .split("T")[0];
          userData.subscription_expiry_date = endDate
            .toISOString()
            .split("T")[0];

          userData.trial = true;
        }
      }
    }
    const user = await Users.create(userData);
    await notifyAdminsOfNewUser(user);
    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.name,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1d", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
      }
    );
    return res.redirect(`${process.env.CLIENT_URL}?auth=${token}`);
    // return res.send(`Welcome, ${user.name}${token}! <a href="/logout">Logout</a>`);
  }
});

externalUerRouter.get("/tokenVerify", async (req, res) => {
  try {
    const config = process.env;
    const bearerToken =
      req.body.token || req.query.token || req.headers["authorization"];
    // console.log('token', token);
    // const bearer = token?.split(' ');
    // const bearerToken = bearer?.[1];
    if (!bearerToken) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(bearerToken, config.TOKEN_KEY);
    const user = await Users.findOne({
      where: { id: decoded?.user_id },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });
    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }
    user.dataValues.subscription_plan = user.dataValues?.subscription?.name;
    delete user.dataValues?.password;
    delete user.dataValues?.subscription_id;
    delete user.dataValues?.subscription;
    const accessToken = jwt.sign(
      {
        user_id: user.id,
        username: user.name,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res.json({
      message: "success",
      data: user,
      token: accessToken,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      success: false,
      message: "Server Error! Please try again later",
      error: err,
    });
  }
});

externalUerRouter.get("/logout", (req, res) => {
  // req.logout();
  res.redirect("/");
});

// externalUerRouter.post("/auth_verify", async (req, res) => {
//   try {
//     const userinfo = req.body;
//     const userdata = await Users.findOne({
//       where: { email: userinfo?.email },
//       include: [
//         { model: Roles, as: "role" },
//         { model: Pricing, as: "subscription" },
//       ],
//     });
//     if (userdata) {
//       if (userinfo.external_id) {
//         userdata.external_id = userinfo.external_id;
//         await userdata.save();
//       }

//       return res.json({
//         message: "Login success,already login",
//         data: userdata,
//       });
//     } else {
//       // verified: req?.user?.emailVerified,
//       if (userinfo.verified) {
//         userinfo.verified = true;
//       }
//       if (!userinfo.provider) {
//         userinfo.provider = "auth0";
//       }
//       if (!userinfo.language) {
//         userinfo.language = "english";
//       }
//       if (!userinfo.approve) {
//         userinfo.approve = true;
//       }
//       if (userinfo?.role?.length) {
//         if (userinfo?.role) {
//           const role = userinfo?.role;
//           const roleId = await Roles.findOne({ where: { name: role } });
//           if (roleId) {
//             userinfo.role_id = roleId.id;
//           } else {
//             res.status(201).json({ message: "Not found Role" });
//           }
//         }
//         if (!userinfo.subscription_id) {
//           if (userinfo?.role !== "Guest" && userinfo?.role) {
//             const plan = await Pricing.findOne({ where: { name: "Free" } });
//             if (plan) {
//               const startDate = new Date();
//               let validationPeriodInDays;
//               if (plan?.period === "month") {
//                 const calculateDateValue = await calculateDates(plan?.Validity);
//                 validationPeriodInDays = calculateDateValue.numberOfDays;
//               } else {
//                 validationPeriodInDays = plan?.Validity;
//               }
//               const endDate = new Date(startDate);
//               endDate.setDate(startDate.getDate() + validationPeriodInDays);

//               userinfo.subscription_id = plan.id;
//               userinfo.subscription_start_date = startDate
//                 .toISOString()
//                 .split("T")[0];
//                 userinfo.subscription_expiry_date = endDate.toISOString().split("T")[0];
//                 userinfo.addon_duration = null;
//                 userinfo.addon_storage = null;
//                 userinfo.duration_spent = null;
//                 userinfo.storage_used = null;
//                 userinfo.trial = true;

//             }
//       await auth0Service.updateAuth0UserMetadata(userinfo?.external_id, {
//           role: roleName,
//           plan: plan?.name || "Free",
//           subscription_start_date: userinfo.subscription_start_date,
//           subscription_expiry_date: userinfo.subscription_expiry_date,
//         });
//           }
//         }
//       }
//       const user = await Users.create(userinfo);

//       await notifyAdminsOfNewUser(user);
//        welcomeEmail(user.email)

//       return res.json({
//         message: "Login success",
//         data: user,
//         // token: token,
//       });

//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server Error! Please try again later",
//       error: error,
//     });
//   }
// });

externalUerRouter.post("/auth_verify", async (req, res) => {
  try {
    const userinfo = req.body;

    let userdata = await Users.findOne({
      where: { email: userinfo?.email },
      include: [
        { model: Roles, as: "role" },
        { model: Pricing, as: "subscription" },
      ],
    });

    // ✅ User already exists
    if (userdata) {
      if (userinfo.external_id ) {
        userdata.external_id = userinfo.external_id;
        await userdata.save();
      }

      return res.json({
        message: "Login success, already registered",
        data: userdata,
      });
    }

    // ✅ New user registration
    if (userinfo.verified === undefined) userinfo.verified = true;
    if (!userinfo.provider) userinfo.provider = "auth0";
    if (!userinfo.language) userinfo.language = "english";
    if (userinfo.approve === undefined) userinfo.approve = true;

    let plan = null;

    if (userinfo?.role) {
      const roleRecord = await Roles.findOne({
        where: { name: userinfo.role },
      });
      if (!roleRecord) {
        return res.status(404).json({ message: "Role not found" });
      }

      userinfo.role_id = roleRecord.id;

      // ✅ Assign Free plan if not Guest
      if (!userinfo.subscription_id && userinfo.role !== "Guest") {
        plan = await Pricing.findOne({ where: { name: "Free" } });
        if (plan) {
          const startDate = new Date();
          let validationPeriodInDays;

          if (plan?.period === "month") {
            const calculateDateValue = await calculateDates(plan?.Validity);
            validationPeriodInDays = calculateDateValue.numberOfDays;
          } else {
            validationPeriodInDays = plan?.Validity;
          }

          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + validationPeriodInDays);

          userinfo.subscription_id = plan.id;
          userinfo.subscription_start_date = startDate
            .toISOString()
            .split("T")[0];
          userinfo.subscription_expiry_date = endDate
            .toISOString()
            .split("T")[0];
          userinfo.addon_duration = null;
          userinfo.addon_storage = null;
          userinfo.duration_spent = null;
          userinfo.storage_used = null;
          userinfo.trial = true;
        }
      }
    }

    // ✅ Save new user
    userdata = await Users.create(userinfo);

    // ✅ Sync Auth0 metadata
    if (userinfo.external_id && userinfo?.role) {
      await auth0Service.updateAuth0UserMetadata(userinfo.external_id, {
        role: userinfo?.role ,
        plan: plan?.name || null,
        subscription_start_date: userinfo?.subscription_start_date || null,
        subscription_expiry_date: userinfo.subscription_expiry_date || null,
      });
    }

    // ✅ Notify + welcome email
    await notifyAdminsOfNewUser(userdata);
    await welcomeEmail(userdata.email);

    return res.json({
      message: "Login success",
      data: userdata,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error! Please try again later",
      error: error.message,
    });
  }
});

export default externalUerRouter;
