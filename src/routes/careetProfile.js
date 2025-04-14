import express from "express";

import { protect } from "../middlewares/auth.js";
import {
  createOrUpdateCareerProfile,
  getUserCareerProfile,
  testUpload,
} from "../controllers/careerProfile.js";
import { upload, uploadToFirebase } from "../middlewares/firebaseMulter.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadToFirebase,
  createOrUpdateCareerProfile
);

router.get("/", protect, getUserCareerProfile);

router.post(
  "/test",
  protect,
  upload.single("file"),
  uploadToFirebase,
  testUpload
);

export default router;
