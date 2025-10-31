import bcrypt from "bcryptjs";
import Roles from "./models/roles.js";
import Users from "./models/users.js";
import Settings from "./models/settings.js";
import Site_settings from "./models/site_settings.js";
import Meeting_options from "./models/meeting_options.js";
import Rooms_configurations from "./models/rooms_configurations.js";
import Permissions from "./models/permissions.js";
import Role_permissions from "./models/role_permissions.js";
import Pricing from "./models/pricing.js";
import AddonPlan from "./models/add_on_plan.js";

export async function Data() {
  async function addInitialRoles() {
    try {
      const existingRoles = await Roles.findAll();
      if (existingRoles.length === 0) {
        const roles = [
          { name: "Administrator", color: "#FF5733", provider: "atlearn" },
          { name: "Moderator", color: "#5E2AEB", provider: "atlearn" },
          { name: "Guest", color: "#1adb4e", provider: "atlearn" },
          { name: "Super Admin", color: "#34ebe8", provider: "atlearn" },
        ];

        await Roles.bulkCreate(roles);
        console.log("Initial roles added successfully.");
      } else {
        console.log("Roles already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial roles:", error);
    }
  }
  async function addInitialPermission() {
    try {
      const existingPermissions = await Permissions.findAll();
      if (existingPermissions.length === 0) {
        const PermissionsValues = [
          { name: "CreateRoom" },
          { name: "ManageUsers" },
          { name: "ManageRooms" },
          { name: "ManageRecordings" },
          { name: "ManageSiteSettings" },
          { name: "ManageRoles" },
          { name: "SharedList" },
          { name: "CanRecord" },
          { name: "RoomLimit" },
        ];

        await Permissions.bulkCreate(PermissionsValues);
        console.log("Initial Permissions added successfully.");
      } else {
        console.log("Permissions already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Permissions:", error);
    }
  }

  async function addInitialUser() {
    try {
      const existingUsers = await Users.findAll();
      const plan = await Pricing.findOne({ where: { name: "Enterprise" } });
      const validationPeriodInDays = await plan?.Validity;
      const subscriptiondate = new Date().toISOString().split("T")[0];
      const expiryDate = new Date(subscriptiondate);
      expiryDate.setDate(expiryDate.getDate() + validationPeriodInDays); // Fix here
      if (existingUsers.length === 0) {
        const users = [
          {
            name: "Admin",
            email: process.env.USER_ADMIN_EMAIL,
            password: await bcrypt.hash(process.env.USER_ADMIN_PASSWORD, 10),
            language: "English",
            verified: true,
            role_id: (await Roles.findOne({ where: { name: "Administrator" } }))
              ?.id,
            subscription_id: (
              await Pricing.findOne({ where: { name: "Enterprise" } })
            )?.id,
            subscription_start_date: subscriptiondate,
            provider: "atlearn",
            approve: true,
          },
          {
            name: "Super Admin",
            email: process.env.USER_SUPER_ADMIN_EMAIL,
            password: await bcrypt.hash(
              process.env.USER_SUPER_ADMIN_PASSWORD,
              10
            ),
            language: "English",
            verified: true,
            role_id: (await Roles.findOne({ where: { name: "Super Admin" } }))
              ?.id,
            subscription_id: (
              await Pricing.findOne({ where: { name: "Enterprise" } })
            )?.id,
            subscription_start_date: subscriptiondate,
            provider: "atlearn",
            approve: true,
          },
        ];

        await Users.bulkCreate(users);
        console.log("Initial Users added successfully.");
      } else {
        console.log("Users already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Users:", error);
    }
  }

  async function addInitialRolePermissions() {
    try {
      const existingRolePermissions = await Role_permissions.findAll();
      if (existingRolePermissions.length === 0) {
        const admin = await Roles.findOne({ where: { name: "Administrator" } });
        const moderator = await Roles.findOne({ where: { name: "Moderator" } });
        const guest = await Roles.findOne({ where: { name: "Guest" } });
        const super_admin = await Roles.findOne({
          where: { name: "Super Admin" },
        });

        const create_room = await Permissions.findOne({
          where: { name: "CreateRoom" },
        });
        const manage_users = await Permissions.findOne({
          where: { name: "ManageUsers" },
        });
        const manage_rooms = await Permissions.findOne({
          where: { name: "ManageRooms" },
        });
        const manage_recordings = await Permissions.findOne({
          where: { name: "ManageRecordings" },
        });
        const manage_site_settings = await Permissions.findOne({
          where: { name: "ManageSiteSettings" },
        });
        const manage_roles = await Permissions.findOne({
          where: { name: "ManageRoles" },
        });
        const shared_list = await Permissions.findOne({
          where: { name: "SharedList" },
        });
        const can_record = await Permissions.findOne({
          where: { name: "CanRecord" },
        });
        const room_limit = await Permissions.findOne({
          where: { name: "RoomLimit" },
        });

        const rolePermissionValues = [
          {
            role_id: super_admin?.id,
            permission_id: create_room?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: manage_users?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: manage_rooms?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: manage_recordings?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: manage_site_settings?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: manage_roles?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: shared_list?.id,
            value: "false",
          },
          {
            role_id: super_admin?.id,
            permission_id: can_record?.id,
            value: "true",
          },
          {
            role_id: super_admin?.id,
            permission_id: room_limit?.id,
            value: "50",
          },

          { role_id: admin?.id, permission_id: create_room?.id, value: "true" },
          {
            role_id: admin?.id,
            permission_id: manage_users?.id,
            value: "true",
          },
          {
            role_id: admin?.id,
            permission_id: manage_rooms?.id,
            value: "true",
          },
          {
            role_id: admin?.id,
            permission_id: manage_recordings?.id,
            value: "true",
          },
          {
            role_id: admin?.id,
            permission_id: manage_site_settings?.id,
            value: "true",
          },
          {
            role_id: admin?.id,
            permission_id: manage_roles?.id,
            value: "true",
          },
          {
            role_id: admin?.id,
            permission_id: shared_list?.id,
            value: "false",
          },
          { role_id: admin?.id, permission_id: can_record?.id, value: "true" },
          { role_id: admin?.id, permission_id: room_limit?.id, value: "50" },

          {
            role_id: moderator?.id,
            permission_id: create_room?.id,
            value: "true",
          },
          {
            role_id: moderator?.id,
            permission_id: manage_users?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: manage_rooms?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: manage_recordings?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: manage_site_settings?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: manage_roles?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: shared_list?.id,
            value: "false",
          },
          {
            role_id: moderator?.id,
            permission_id: can_record?.id,
            value: "true",
          },
          {
            role_id: moderator?.id,
            permission_id: room_limit?.id,
            value: "30",
          },

          {
            role_id: guest?.id,
            permission_id: create_room?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: manage_users?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: manage_rooms?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: manage_recordings?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: manage_site_settings?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: manage_roles?.id,
            value: "false",
          },
          {
            role_id: guest?.id,
            permission_id: shared_list?.id,
            value: "false",
          },
          { role_id: guest?.id, permission_id: can_record?.id, value: "true" },
          { role_id: guest?.id, permission_id: room_limit?.id, value: "10" },
        ];

        await Role_permissions.bulkCreate(rolePermissionValues);
        console.log("Initial Role Permission added successfully.");
      } else {
        console.log("Role Permission already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Role Permission:", error);
    }
  }
  async function addInitialSettings() {
    try {
      const existingSettings = await Settings.findAll();
      if (existingSettings.length === 0) {
        const settingValues = [
          { name: "PrimaryColor" },
          { name: "PrimaryColorLight" },
          { name: "PrimaryColorDark" },
          { name: "BrandingImage" },
          { name: "Terms" },
          { name: "PrivacyPolicy" },
          { name: "RegistrationMethod" },
          { name: "ShareRooms" },
          { name: "PreuploadPresentation" },
          { name: "RoleMapping" },
          { name: "DefaultRole" },
        ];

        await Settings.bulkCreate(settingValues);
        console.log("Initial settings added successfully.");
      } else {
        console.log("settings already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial settings:", error);
    }
  }
  async function addInitialSiteSettings() {
    try {
      const existingSiteSettings = await Site_settings.findAll();
      if (existingSiteSettings.length === 0) {
        const settingValues = [
          {
            setting_id: (
              await Settings.findOne({ where: { name: "PrimaryColor" } })
            )?.id,
            value: "#467fcf",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "PrimaryColorDark" } })
            )?.id,
            value: "#316cbe",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "BrandingImage" } })
            )?.id,
            value: "",
            provider: "atlearn",
          },
          {
            setting_id: (await Settings.findOne({ where: { name: "Terms" } }))
              ?.id,
            value: "",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "PrivacyPolicy" } })
            )?.id,
            value: "",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "RegistrationMethod" } })
            )?.id,
            value: "open",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "ShareRooms" } })
            )?.id,
            value: "true",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({
                where: { name: "PreuploadPresentation" },
              })
            )?.id,
            value: "true",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "RoleMapping" } })
            )?.id,
            value: "",
            provider: "atlearn",
          },
          {
            setting_id: (
              await Settings.findOne({ where: { name: "DefaultRole" } })
            )?.id,
            value: "Moderator",
            provider: "atlearn",
          },
        ];

        await Site_settings.bulkCreate(settingValues);
        console.log("Initial Site_settings added successfully.");
      } else {
        console.log("Site_settings already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Site_settings:", error);
    }
  }
  async function addInitialMeetingOptions() {
    try {
      const existingMappingOptions = await Meeting_options.findAll();
      if (existingMappingOptions.length === 0) {
        const meetingOptionsValues = [
          // BBB parameters:
          { name: "record", default_value: "false" }, // true | false
          { name: "muteOnStart", default_value: "false" }, // true | false
          { name: "guestPolicy", default_value: "ALWAYS_ACCEPT" }, // ALWAYS_ACCEPT | ALWAYS_DENY | ASK_MODERATOR
          // GL only options:
          { name: "glAnyoneCanStart", default_value: "false" }, // true | false
          { name: "glAnyoneJoinAsModerator", default_value: "false" }, // true | false
          { name: "glRequireAuthentication", default_value: "false" }, // true | false
          { name: "glModeratorAccessCode", default_value: "" },
          { name: "glViewerAccessCode", default_value: "" },
        ];

        await Meeting_options.bulkCreate(meetingOptionsValues);
        console.log("Initial Meeting Options added successfully.");
      } else {
        console.log("Meeting Options already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Meeting Options:", error);
    }
  }
  async function addInitialRoomConfig() {
    try {
      const existingRoomConfig = await Rooms_configurations.findAll();
      if (existingRoomConfig.length === 0) {
        const roomConfigValues = [
          {
            meeting_option_id: (
              await Meeting_options.findOne({ where: { name: "record" } })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({ where: { name: "muteOnStart" } })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({ where: { name: "guestPolicy" } })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({
                where: { name: "glAnyoneCanStart" },
              })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({
                where: { name: "glAnyoneJoinAsModerator" },
              })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({
                where: { name: "glRequireAuthentication" },
              })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({
                where: { name: "glModeratorAccessCode" },
              })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
          {
            meeting_option_id: (
              await Meeting_options.findOne({
                where: { name: "glViewerAccessCode" },
              })
            )?.id,
            value: "false",
            provider: "atlearn",
          },
        ];

        await Rooms_configurations.bulkCreate(roomConfigValues);
        console.log("Initial Room Configurations added successfully.");
      } else {
        console.log("Room Configurations already exist. Skipping addition.");
      }
    } catch (error) {
      console.error("Error adding initial Room Configurations:", error);
    }
  }

  const createPricingOptions = async () => {
    const pricingOptions = [
      {
        name: "Free",
        price: 0,
        participants: 2,
        duration: 1,
        Validity: 7,
        recording: "false",
        chat: "true",
        sharedNotes: "true",
        breakout: "false",
        screenshare: "true",
        multiuserwhiteboard: "false",
        sharedRoomAccess: "true",
        storage: 0,
        period: "day",
        //LMS
        freelms: "true",
        courseManagement: "true",
        efficientDigitalBookManagement: "true",
        bulkEnrollment: "true",
        communicationTools: "true",
        studentManagement: "true",
        reportsAndAnalytics: "true",
        customizationAndPersonalization: "true",
        assessmentAndGrading: "true",
        //AI
        multipleChoiceQuestions: "false",
        rubricGenerator: "false",
        studentWorkFeedback: "false",
        professionalEmailCommunication: "false",
        depthOfKnowledgeQuizGenerator: "false",
        careerOrCollegeCounselor: "false",
        ideaGenerator: "false",
        learnCoding: "false",
        syllabus: "false",
        assessmentOutline: "false",
        lessonPlan5Es: "false",
        claimEvidenceReasoning: "false",
        debate: "false",
        mockInterview: "false",
        projectBasedLearning: "false",
        teamBasedActivity: "false",
        battleshipStyle: "false",
        fillInTheBlankQuestions: "false",
        scenarioBasedQuestions: "false",
        trueFalseQuestions: "false",
        timelyRelevantActionableFeedback: "false",
      },
      {
        name: "Basic",
        price: 550,
        participants: 25,
        duration: 15,
        Validity: 1,
        recording: "true",
        chat: "true",
        sharedNotes: "true",
        breakout: "true",
        screenshare: "true",
        multiuserwhiteboard: "true",
        sharedRoomAccess: "true",
        storage: 15,
        period: "month",
        //LMS
        freelms: "true",
        courseManagement: "true",
        efficientDigitalBookManagement: "true",
        bulkEnrollment: "true",
        communicationTools: "true",
        studentManagement: "true",
        reportsAndAnalytics: "true",
        customizationAndPersonalization: "true",
        assessmentAndGrading: "true",
        //AI
        multipleChoiceQuestions: "false",
        rubricGenerator: "false",
        studentWorkFeedback: "false",
        professionalEmailCommunication: "false",
        depthOfKnowledgeQuizGenerator: "false",
        careerOrCollegeCounselor: "false",
        ideaGenerator: "false",
        learnCoding: "false",
        syllabus: "false",
        assessmentOutline: "false",
        lessonPlan5Es: "false",
        claimEvidenceReasoning: "false",
        debate: "false",
        mockInterview: "false",
        projectBasedLearning: "false",
        teamBasedActivity: "false",
        battleshipStyle: "false",
        fillInTheBlankQuestions: "false",
        scenarioBasedQuestions: "false",
        trueFalseQuestions: "false",
        timelyRelevantActionableFeedback: "false",
      },
      {
        name: "Pro",
        price: 1375,
        participants: 50,
        duration: 30,
        Validity: 3,
        recording: "true",
        chat: "true",
        sharedNotes: "true",
        breakout: "true",
        screenshare: "true",
        multiuserwhiteboard: "true",
        sharedRoomAccess: "true",
        storage: 25,
        period: "month",
        //LMS
        freelms: "true",
        courseManagement: "true",
        efficientDigitalBookManagement: "true",
        bulkEnrollment: "true",
        communicationTools: "true",
        studentManagement: "true",
        reportsAndAnalytics: "true",
        customizationAndPersonalization: "true",
        assessmentAndGrading: "true",
        //AI
        multipleChoiceQuestions: "true",
        rubricGenerator: "true",
        studentWorkFeedback: "true",
        professionalEmailCommunication: "true",
        depthOfKnowledgeQuizGenerator: "true",
        careerOrCollegeCounselor: "true",
        ideaGenerator: "true",
        learnCoding: "true",
        syllabus: "true",
        assessmentOutline: "true",
        lessonPlan5Es: "true",
        claimEvidenceReasoning: "true",
        debate: "true",
        mockInterview: "true",
        projectBasedLearning: "true",
        teamBasedActivity: "true",
        battleshipStyle: "true",
        fillInTheBlankQuestions: "true",
        scenarioBasedQuestions: "true",
        trueFalseQuestions: "true",
        timelyRelevantActionableFeedback: "true",
      },
      {
        name: "Enterprise",
        price: 2750,
        participants: 50,
        duration: 50,
        Validity: 6,
        recording: "true",
        chat: "true",
        sharedNotes: "true",
        breakout: "true",
        screenshare: "true",
        multiuserwhiteboard: "true",
        sharedRoomAccess: "true",
        storage: 50,
        period: "month",
        //LMS
        freelms: "true",
        courseManagement: "true",
        efficientDigitalBookManagement: "true",
        bulkEnrollment: "true",
        communicationTools: "true",
        studentManagement: "true",
        reportsAndAnalytics: "true",
        customizationAndPersonalization: "true",
        assessmentAndGrading: "true",
        //AI
        multipleChoiceQuestions: "true",
        rubricGenerator: "true",
        studentWorkFeedback: "true",
        professionalEmailCommunication: "true",
        depthOfKnowledgeQuizGenerator: "true",
        careerOrCollegeCounselor: "true",
        ideaGenerator: "true",
        learnCoding: "true",
        syllabus: "true",
        assessmentOutline: "true",
        lessonPlan5Es: "true",
        claimEvidenceReasoning: "true",
        debate: "true",
        mockInterview: "true",
        projectBasedLearning: "true",
        teamBasedActivity: "true",
        battleshipStyle: "true",
        fillInTheBlankQuestions: "true",
        scenarioBasedQuestions: "true",
        trueFalseQuestions: "true",
        timelyRelevantActionableFeedback: "true",
      },
    ];

    const existingPricingOptions = await Pricing.findAll();

    if (existingPricingOptions.length === 0) {
      await Pricing.bulkCreate(pricingOptions);
      console.log("Pricing options created successfully.");
    } else {
      console.log("Pricing options already exist. Skipping creation.");
    }
  };

  async function createAddonPlan() {
    try {
      const addonplan = [
        {
          add_on_plan_name: "duration",
          price: 5,
          min_range: 1,
          max_range: 10,
        },
        {
          add_on_plan_name: "storage",
          price: 5,
          min_range: 1,
          max_range: 10,
        },
      ];
      const existingAddonPlan = await AddonPlan.findAll();
      if (existingAddonPlan?.length === 0) {
        await AddonPlan.bulkCreate(addonplan);
        console.log("Addon plan created successfully.");
      } else {
        console.log("Addon plan already exist. Skipping creation.");
      }
    } catch (error) {
      console.error("Error initial AddonPlan:", error);
    }
  }
  await addInitialSettings();
  await addInitialSiteSettings();
  await addInitialMeetingOptions();
  await createAddonPlan();
  await createPricingOptions();
  await addInitialRoles();
  await addInitialPermission();
  await addInitialRolePermissions();
  await addInitialRoomConfig();
  await addInitialUser();
}
