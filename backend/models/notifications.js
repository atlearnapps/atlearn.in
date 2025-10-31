import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js"; // Ensure this is properly configured

class Notifications extends Model {}

Notifications.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING, // In case message content can be long
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
  },
  {
    sequelize, // Make sure this comes from a valid Sequelize instance
    modelName: "notifications",
    timestamps: true, // auto-manages createdAt and updatedAt
    updatedAt: "updated_at", // explicitly renaming the field
    createdAt: "created_at", // explicitly renaming the field
  }
);

export default Notifications;
