import mongoose from "mongoose";

const careerChatMessageSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareerChatConversation",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: { type: String, trim: true }, // Only for user
  ai_response: { type: String, trim: true }, // Only for AI

  resume_context_used: { type: Boolean, default: true },
  type: {
    type: [String],
    default: [],
  },
  resources: {
    type: String,
    trim: true,
  },
  resumeRetouch: {
    type: String,
    trim: true,
  },

  created_at: { type: Date, default: Date.now },
});

const CareerChatMessage = mongoose.model(
  "CareerChatMessage",
  careerChatMessageSchema
);

export default CareerChatMessage;
