import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
// import Users from "./users.js";

class Analytics_dashboard extends Model {}

Analytics_dashboard.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    meeting_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    internal_id: {
      type: DataTypes.STRING,
      // allowNull: false,
      //   unique: true,
    },
    dashboard_access_token: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    duration: {
      type: DataTypes.BIGINT,
    },
    created_on: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ended_on: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    learning_dashboard_data: {
      type: DataTypes.JSON, // Use DataTypes.JSON for JSON columns
      allowNull: true, // Adjust according to your needs
    },
    participants_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    zoom_uuid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "analytics_dashboard",
    timestamps: true,
    paranoid: true,
  }
);

// Analytics_dashboard.belongsTo(Users, { foreignKey: "meetingId", as: 'user', constraints: true });

export default Analytics_dashboard;
