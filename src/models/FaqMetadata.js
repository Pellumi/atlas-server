import mongoose from "mongoose";

const faqMetaSchema = new mongoose.Schema({
  faq_id: { type: mongoose.Schema.Types.ObjectId, ref: "Faq", required: true },
  generated_by: { type: String, enum: ["ai", "admin"], required: true },
  confidence: { type: Number },
  source_question: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const FaqMetadata = mongoose.model("FaqMetadata", faqMetaSchema);

export default FaqMetadata;
