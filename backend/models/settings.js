import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Settings extends Model {}

Settings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "settings",
    timestamps: true, 
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["name"],
        name: "index_settings_on_name",
      },
    ],
  }
);
export default Settings;
