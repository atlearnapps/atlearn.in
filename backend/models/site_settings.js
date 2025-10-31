import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Settings from "./settings.js";
class Site_settings extends Model {}

Site_settings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    setting_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "site_settings",
    timestamps: true, 
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        fields: ["setting_id"],
        name: "index_site_settings_on_setting_id",
      },
    ],
  }
);

Site_settings.belongsTo(Settings, {
  foreignKey: "setting_id",
  constraints: true,
});

export default Site_settings;
