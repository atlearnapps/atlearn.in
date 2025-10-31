import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Rooms from "./rooms.js";
import Users from "./users.js";

class RoomPayments extends Model {}

RoomPayments.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    schedule_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING, // e.g., 'paid', 'pending', 'failed'
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "room_payments",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
    // indexes: [
    //   {
    //     fields: ["room_id"],
    //     name: "index_room_payments_on_room_id",
    //   },
    // ],
  }
);

// Associations
RoomPayments.belongsTo(Rooms, {
  foreignKey: "room_id",
  constraints: true,
  onDelete: "CASCADE",
});
RoomPayments.belongsTo(Users, {
  foreignKey: "user_id",
  constraints: true,
  onDelete: "CASCADE",
});

// Rooms.hasMany(RoomPayments, { foreignKey: "room_id" });

export default RoomPayments;
