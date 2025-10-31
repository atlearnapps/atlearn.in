import mySequelize from "sequelize";
const { Model, DataTypes } = mySequelize;
import sequelize from "../database.js";
import AI_chat_session from "./ai_chat_session.js";

class AI_message extends Model {}

AI_message.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        session_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    },
    {
        sequelize,
        modelName: "ai_message",
        timestamps: true,
        updatedAt: "updated_at", 
        createdAt: "created_at",
    }
);

AI_message.belongsTo(AI_chat_session, { foreignKey: "session_id", constraints: true,  onDelete: "CASCADE", });

export default AI_message;