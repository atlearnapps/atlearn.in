import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Recordings from "./recordings.js";
class Formats extends Model {}

Formats.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    record_id: {
      type: DataTypes.STRING,
    },
    recording_id: {
      type: DataTypes.STRING,
    },
    recording_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "formats",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        fields: ["recording_id"],
        name: "index_formats_on_recording_id",
      },
    ],
  }
);

Formats.belongsTo(Recordings, { foreignKey: "record_id", constraints: true, onDelete: 'CASCADE' });

export default Formats;
