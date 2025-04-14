import express from "express";
import {
  bulkCreateFaqs,
  createFaq,
  deleteFaq,
  getAllFaqs,
  getFaqById,
  testSearch,
  updateFaq,
} from "../controllers/faq.js";

const router = express.Router();

router.post("/create", createFaq);
router.post("/create-bulk", bulkCreateFaqs);
router.get("/get", getAllFaqs);
router.get("/:id/get", getFaqById);
router.put("/:id/update", updateFaq);
router.delete("/:id/delete", deleteFaq);
router.post("/test", testSearch);

export default router;
