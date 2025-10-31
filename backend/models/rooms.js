import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Users from "./users.js";
import Zoom_meeting_options from "./zoom_meeting_options.js";
// import Schedule_room_meeting from "./schedule_room_meeting.js";
class Rooms extends Model {}

Rooms.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    zoom_meeting_setting_id:{
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendly_id: {
      type: DataTypes.STRING,
    },
    meeting_id: {
      type: DataTypes.STRING,
    },
    room_duration: {
      type: DataTypes.STRING,
    },
    last_session: {
      type: DataTypes.STRING,
    },
    recordings_processing: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    participants: {
      type: DataTypes.STRING,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    price:{
      type: DataTypes.INTEGER,
    },
    cover_image_url: {
      type: DataTypes.STRING,
    },
    room_type:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "online_class", 
    },
    provider:{
      type:DataTypes.STRING,
      defaultValue: "bbb", 
    }
  },
  {
    sequelize,
    modelName: "rooms",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["friendly_id"],
        name: "index_rooms_on_friendly_id",
      },
      {
        unique: true,
        fields: ["meeting_id"],
        name: "index_rooms_on_meeting_id",
      },
      {
        fields: ["user_id"],
        name: "index_rooms_on_user_id",
      },
    ],
  }
);
Rooms.belongsTo(Users, { foreignKey: "user_id", constraints: true });
Rooms.belongsTo(Zoom_meeting_options, { foreignKey: "zoom_meeting_setting_id", constraints: true, });


export default Rooms;
