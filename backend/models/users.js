import mySequelize from "sequelize";
import bcrypt from "bcryptjs";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Roles from "./roles.js";
import Pricing from "./pricing.js";
import Bank_details from "./bank_details.js";

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bank_details_id:{
      type: DataTypes.UUID,
    },
    external_id: {
      type: DataTypes.STRING,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    role_id: {
      type: DataTypes.UUID,
    },
    subscription_id: {
      type: DataTypes.UUID,
    },
    subscription_start_date: {
      type: DataTypes.STRING,
    },
    subscription_expiry_date: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_digest: {
      type: DataTypes.STRING,
    },
    reset_sent_at: {
      type: DataTypes.DATE,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_digest: {
      type: DataTypes.STRING,
    },
    verification_sent_at: {
      type: DataTypes.DATE,
    },
    session_token: {
      type: DataTypes.STRING,
    },
    session_expiry: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    avatarPath: {
      type: DataTypes.STRING,
    },
    approve: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    trial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subscription_pending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    duration_spent: {
      type: DataTypes.BIGINT,
    },
    storage_used: {
      type: DataTypes.BIGINT,
    },
    addon_duration: {
      type: DataTypes.INTEGER,
    },
    addon_storage: {
      type: DataTypes.INTEGER,
    },
    expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email", "provider"],
        name: "index_users_on_email_and_provider",
      },
      {
        unique: true,
        fields: ["reset_digest"],
        name: "index_users_on_reset_digest",
      },
      {
        fields: ["role_id"],
        name: "index_users_on_role_id",
      },
      {
        unique: true,
        fields: ["session_token"],
        name: "index_users_on_session_token",
      },
      {
        unique: true,
        fields: ["verification_digest"],
        name: "index_users_on_verification_digest",
      },
    ],
  }
);

Users.belongsTo(Roles, {
  foreignKey: "role_id",
  as: "role",
  constraints: true,
});
Users.belongsTo(Pricing, {
  foreignKey: "subscription_id",
  as: "subscription",
  constraints: true,
});
Users.belongsTo(Bank_details, {
  foreignKey: "bankDetailsId",
  as: "bankDetails",
  constraints: true,
});

export default Users;
