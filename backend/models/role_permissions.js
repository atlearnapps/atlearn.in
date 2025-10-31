import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Permissions from "./permissions.js";
import Roles from "./roles.js";
class Role_permissions extends Model {}

Role_permissions.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "role_permissions",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        fields: ["permission_id"],
        name: "index_role_permissions_on_permission_id",
      },
      {
        fields: ["role_id"],
        name: "index_role_permissions_on_role_id",
      },
    ],
  }
);
Role_permissions.belongsTo(Roles, { foreignKey: "role_id", constraints: true });
Role_permissions.belongsTo(Permissions, { foreignKey: "permission_id", constraints: true });

export default Role_permissions;
