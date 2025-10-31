import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Active_storage_blobs from "./active_storage_blobs.js";
class Active_storage_attachments extends Model {}

Active_storage_attachments.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    record_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    record_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blob_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "active_storage_attachments",
    timestamps: false,
    indexes: [
      {
        fields: ["blob_id"],
        name: "index_active_storage_attachments_on_blob_id",
      },
      {
        unique: true,
        fields: ["record_type", "record_id", "name", "blob_id"],
        name: "index_active_storage_attachments_uniqueness",
      },
    ],
  }
);
Active_storage_attachments.belongsTo(Active_storage_blobs, {
  foreignKey: "blob_id",
  constraints: true,
});

export default Active_storage_attachments;
