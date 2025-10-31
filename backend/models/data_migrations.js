import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Data_migrations extends Model {}

Data_migrations.init(
  {
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "data_migrations",
    timestamps: false,
  }
);

export default Data_migrations