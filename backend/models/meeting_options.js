import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Meeting_options extends Model {}

Meeting_options.init(
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
    default_value: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "meeting_options",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["name"],
        name: "index_meeting_options_on_name",
      },
    ],
  }
);

export default Meeting_options;
