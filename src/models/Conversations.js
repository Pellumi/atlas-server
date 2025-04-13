import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

conversationSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
