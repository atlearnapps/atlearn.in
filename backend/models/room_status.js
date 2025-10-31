import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Room_Status extends Model {}

Room_Status.init(
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
    date: {
      type: DataTypes.DATE,
    },
    last_session: {
      type: DataTypes.STRING,
    },
    participants: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "room_status",
    timestamps: true,
  }
);

export default Room_Status;
