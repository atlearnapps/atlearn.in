import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Roles extends Model {}

Roles.init(
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
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "roles",
    timestamps: true, 
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["name", "provider"],
        name: "index_roles_on_name_and_provider",
      },
    ],
  }
);

export default Roles;
