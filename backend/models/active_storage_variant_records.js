import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import Active_storage_blobs from "./active_storage_blobs.js";
class Active_storage_variant_record extends Model {}

Active_storage_variant_record.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blob_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variation_digest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "active_storage_variant_record",
    timestamps: false,
    indexes: [
        {
          unique: true,
          fields: ['blob_id', 'variation_digest'],
          name: 'index_active_storage_variant_records_uniqueness',
        },
      ],
  }
);
Active_storage_variant_record.belongsTo(Active_storage_blobs, { foreignKey: "blob_id", constraints: true });


export default Active_storage_variant_record;