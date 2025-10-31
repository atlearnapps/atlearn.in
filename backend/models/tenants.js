import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Tenants extends Model {}

Tenants.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "tenants",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["name"],
        name: "index_tenants_on_name",
      },
    ],
  }
);

export default Tenants;
