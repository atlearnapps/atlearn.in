import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Users from "./users.js";

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      // allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    plan: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    subscription_start: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    subscription_expiry: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    payment_status: {
      type: DataTypes.STRING,
    },
    plan_grade:{
      type:DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: "transaction",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["user_id"],
    //     name: "index_token_on_user_id",
    //   },
    // ],
  }
);

Transaction.belongsTo(Users, {
  foreignKey: "user_id",
  constraints: true,
  onDelete: "CASCADE",
});

export default Transaction;
