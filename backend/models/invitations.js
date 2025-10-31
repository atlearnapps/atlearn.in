import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Invitations extends Model {}

Invitations.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "invitations",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["email", "provider"],
    //     name: "index_invitations_on_email_and_provider",
    //   },
    //   {
    //     unique: true,
    //     fields: ["token"],
    //     name: "index_invitations_on_token",
    //   },
    // ],
  }
);
export default Invitations;
