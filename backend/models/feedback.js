import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Feedback extends Model {}

Feedback.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date:{
        type: DataTypes.STRING, 
        allowNull: false,
    }

  },
  {
    sequelize,
    modelName: "feedback",
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

export default Feedback;
