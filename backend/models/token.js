import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Token extends Model {}

Token.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    email:{
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "token",
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

export default Token;