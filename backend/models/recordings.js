import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";
class Recordings extends Model {}

Recordings.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    record_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    protectable: {
      type: DataTypes.BOOLEAN,
    },
    recorded_at: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "recordings",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
    indexes: [
      {
        fields: ["room_id"],
        name: "index_recordings_on_room_id",
      },
    ],
  }
);
Recordings.belongsTo(Rooms, { foreignKey: "room_id", constraints: true,  onDelete: "CASCADE", });

export default Recordings;
