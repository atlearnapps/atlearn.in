import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";

class AI_chat_session extends Model {}

AI_chat_session.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title:{
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        assistant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assistant_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        assistant_role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_messgae_updated: {
            type: DataTypes.STRING,
        },
        assistant_code:{
            type: DataTypes.STRING,
        }

    },
    {
        sequelize,
        modelName: "ai_chat_session",
        timestamps: true,
        updatedAt: "updated_at", 
        createdAt: "created_at",
    }
);

export default AI_chat_session;