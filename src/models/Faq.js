import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

faqSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
