import express from "express";
import {
    createCareerChatConversation,
    getCareerConversationMessages,
    getUserCareerChatConversations,
    sendCareerMessage,
    testAi,
} from "../controllers/careerConversations.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", protect, createCareerChatConversation);
router.post("/send-message", protect, sendCareerMessage);
router.get("/get", protect, getUserCareerChatConversations);
router.get(
  "/:conversationId/get-message",
  protect,
  getCareerConversationMessages
);
router.post("/test", protect, testAi);

export default router;
