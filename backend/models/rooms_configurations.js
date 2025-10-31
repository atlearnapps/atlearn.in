import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Meeting_options from "./meeting_options.js";
class Rooms_configurations extends Model {}

Rooms_configurations.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    meeting_option_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "rooms_configurations",
    timestamps: true,
    updatedAt: "updated_at", 
    createdAt: "created_at",
    indexes: [
      {
        unique: true,
        fields: ["meeting_option_id", "provider"],
        name: "index_rooms_configurations_on_meeting_option_id_and_provider",
      },
      {
        fields: ["meeting_option_id"],
        name: "index_rooms_configurations_on_meeting_option_id",
      },
    ],
  }
);
Rooms_configurations.belongsTo(Meeting_options, {
  foreignKey: "meeting_option_id",
  constraints: true,
});

export default Rooms_configurations;
