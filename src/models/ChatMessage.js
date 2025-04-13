import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: { type: String, enum: ["student", "admin", "guest"], required: true },
  question: { type: String, required: true, trim: true },
  ai_response: { type: String, required: true, trim: true },
  matched_faq_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faq",
    default: null,
  },
  source: { type: String, enum: ["faq", "ai", "manual"], required: true },
  confidence: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;
