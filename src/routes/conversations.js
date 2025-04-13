import express from "express";
import {
  createConversation,
  getMessagesInConversation,
  getUserConversations,
  sendMessageToConversation,
  testAi,
} from "../controllers/conversation.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", protect, createConversation);
router.post("/send-message", protect, sendMessageToConversation);
router.get("/get", protect, getUserConversations);
router.get("/:conversationId/get-message", protect, getMessagesInConversation);
router.post("/test", testAi);

export default router;
