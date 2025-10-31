import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";
import Users from "./users.js";
class Shared_accesses extends Model {}

Shared_accesses.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "shared_accesses",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        fields: ["room_id"],
        name: "index_shared_accesses_on_room_id",
      },
      {
        unique: true,
        fields: ["user_id", "room_id"],
        name: "index_shared_accesses_on_user_id_and_room_id",
      },
      {
        fields: ["user_id"],
        name: "index_shared_accesses_on_user_id",
      },
    ],
  }
);
Shared_accesses.belongsTo(Rooms, { foreignKey: "room_id", constraints: true });
Shared_accesses.belongsTo(Users, { foreignKey: "user_id", constraints: true });

export default Shared_accesses;
