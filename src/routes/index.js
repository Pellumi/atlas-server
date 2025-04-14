import express from "express";
import authRoutes from "./auth.js";
import faqRoutes from "./faq.js";
import conversationRoutes from "./conversations.js";
import careerProfileRoutes from "./careetProfile.js";
import careerConversationRoutes from "./careerConversation.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/faq", faqRoutes);
router.use("/conversation", conversationRoutes);
router.use("/career-profile", careerProfileRoutes);
router.use("/career-conversation", careerConversationRoutes);

export default router;
