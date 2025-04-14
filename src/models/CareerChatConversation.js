import mongoose from "mongoose";

const careerChatConversationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true }, // E.g. “Data Analyst Journey Plan”
  created_at: { type: Date, default: Date.now },
});

const CareerChatConversation = mongoose.model(
  "CareerChatConversation",
  careerChatConversationSchema
);

export default CareerChatConversation;
