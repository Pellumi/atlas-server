import express from "express";
import authRoutes from "./auth.js";
import faqRoutes from "./faq.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/faq", faqRoutes);

export default router;