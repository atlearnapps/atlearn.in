import express from 'express';
const aiAssistantRouter = express.Router();
import aiAssistantController from '../controller/aiAssistantController.js';



aiAssistantRouter.post('/createChatSession', aiAssistantController.createChatSession);
aiAssistantRouter.get('/getChatSession/:userId/:assistantCode', aiAssistantController.getChatSession);
aiAssistantRouter.get('/getMessages/:sessionId', aiAssistantController.getMessages);
aiAssistantRouter.post('/createMessage', aiAssistantController.createMessage);
aiAssistantRouter.patch('/renameSession/:sessionId', aiAssistantController.renameChatSession);
aiAssistantRouter.delete('/deleteChatSession/:sessionId', aiAssistantController.deleteChatSession);


export default aiAssistantRouter;