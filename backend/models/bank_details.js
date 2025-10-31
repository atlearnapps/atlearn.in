import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Bank_details extends Model {}

Bank_details.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "bank_details",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);



export default Bank_details;
