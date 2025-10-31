import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";
import Users from "./users.js";
class Oauth_clients extends Model {}

Oauth_clients.init(
    {
        client_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        client_secret: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
        },
    },
    {
        sequelize,
        modelName: "oauth_clients",
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: "created_at",
      }
);

Oauth_clients.belongsTo(Users, { foreignKey: "user_id", constraints: true });

export default Oauth_clients;