import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";
import Meeting_options from "./meeting_options.js";
class Room_meeting_options extends Model {}

Room_meeting_options.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    meeting_option_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "room_meeting_options",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        fields: ["meeting_option_id"],
        name: "index_room_meeting_options_on_meeting_option_id",
      },
      {
        fields: ["room_id"],
        name: "index_room_meeting_options_on_room_id",
      },
    ],
  }
);
Room_meeting_options.belongsTo(Rooms, {
  foreignKey: "room_id",
  constraints: true,
});
Room_meeting_options.belongsTo(Meeting_options, {
  foreignKey: "meeting_option_id",
  constraints: true,
});

export default Room_meeting_options;
