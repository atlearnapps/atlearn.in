import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";

class Schedule_room_meeting extends Model {}

Schedule_room_meeting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    room_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guestEmail: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notifications: {
      type: DataTypes.JSONB, // You can use JSONB for PostgreSQL or JSON for other databases
      defaultValue: [], // Default value is an empty array
    },
    public_view:{
      type:DataTypes.BOOLEAN,
      defaultValue: false,
    },
    price:{
      type: DataTypes.INTEGER,
    }
  },
  {
    sequelize,
    modelName: "schedule_room_meeting",
    timestamps: true,
  }

);

Schedule_room_meeting.belongsTo(Rooms, { foreignKey: "room_id", constraints: true })

export default Schedule_room_meeting;
