import { where } from "sequelize";
import AI_chat_session from "../models/ai_chat_session.js";
import AI_message from "../models/ai_message.js";
import moment from "moment-timezone";


const createChatSession = async (req, res) => {
  try {
    const { title, user_id, assistant_id, assistant_name, assistant_role,assistant_code } =
      req.body;
    const session = await AI_chat_session.create({
      title,
      user_id,
      assistant_id,
      assistant_name,
      assistant_role,
      assistant_code
    });
    res.status(201).json({
      message: "Chat session created successfully",
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
     res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getChatSession = async (req, res) => {
  try {
    const { userId, assistantCode } = req.params;
    const sessions = await AI_chat_session.findAll({
      where: {
        user_id: userId,
        assistant_code: assistantCode,
      },
      order: [["updated_at", "DESC"]],
    });
    res.status(200).json({
      message: "Chat sessions retrieved successfully",
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error retrieving chat sessions:", error);
     res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await AI_message.findAll({
      where: { session_id: sessionId },
      order: [["created_at", "ASC"]],
    });
    res.status(200).json({
      message: "Messages retrieved successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
     res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const createMessage = async (req, res) => {
    try {
      const { session_id, sender, text } = req.body;
  
      // Get current time in Asia/Kolkata timezone as a string
      const currentTime = moment().tz("Asia/Kolkata").toString();
  
      // Create the message
      const message = await AI_message.create({ session_id, sender, text });
  
      // Update session's last message timestamp
      await AI_chat_session.update(
        { last_messgae_updated: currentTime },
        { where: { id: session_id } }
      );
  
      res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await AI_chat_session.destroy({
      where: { id: sessionId },
    });
    res.status(200).json({
      message: "Chat session deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
     res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const renameChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const session = await AI_chat_session.findOne({where: { id: sessionId }});
    if (!session) {
      return res.status(404).json({
        message: "Chat session not found",
        success: false,
      });
    }
    session.title = title;
    await session.save();
    res.status(200).json({
      message: "Chat session renamed successfully",
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error renaming chat session:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


export default {
  createChatSession,
  getChatSession,
  getMessages,
  createMessage,
  deleteChatSession,
  renameChatSession,
};
