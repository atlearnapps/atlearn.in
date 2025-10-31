import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Active_storage_blobs extends Model {}

Active_storage_blobs.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_type: {
      type: DataTypes.STRING,
    },
    metadata: {
      type: DataTypes.TEXT,
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    byte_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    checksum: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "active_storage_blobs",
    timestamps: false,
    indexes: [
        {
          unique: true,
          fields: ['key'],
          name: 'index_active_storage_blobs_on_key',
        },
      ],
  }
);


export default Active_storage_blobs;