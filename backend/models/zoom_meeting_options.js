import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class Zoom_meeting_options extends Model {}

Zoom_meeting_options.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        meeting_id:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "zoom_meeting_options",
        timestamps: true,
        updatedAt: "updated_at", 
        createdAt: "created_at",
    }
);

export default Zoom_meeting_options;