import ChatMessage from "../models/ChatMessage.js";
import Conversation from "../models/Conversations.js";
import Faq from "../models/Faq.js";
import { generateAnswerWithAI } from "../utils/AIUtilities.js";

const createConversation = async (req, res, next) => {
  const userId = req.user._id; // Assuming you’re using middleware for auth
  const role = req.user.role;
  const { question } = req.body;

  if (!question) {
    return next(ErrorHandler.BadRequest("Question is required."));
  }

  // Step 1: Try to find similar FAQ
  //   const matchedFaq = await Faq.findOne({ $text: { $search: question } });
  const matchedFaq = false;

  let answer,
    source,
    matchedFaqId = null,
    tags = [],
    keywords = [];

  if (matchedFaq) {
    answer = matchedFaq.answer;
    tags = matchedFaq.tags || [];
    source = "faq";
    matchedFaqId = matchedFaq._id;
  } else {
    // Step 2: Call Gemini API to generate a new answer
    const aiResult = await generateAnswerWithAI(question);
    answer = aiResult.answer;
    tags = aiResult.tags || [];
    keywords = aiResult.keywords || [];
    source = "ai";

    // Step 3: Save new FAQ
    const newFaq = new Faq({
      question,
      answer,
      tags,
      keywords,
    });
    await newFaq.save();
    matchedFaqId = newFaq._id;
  }

  // Step 4: Create conversation
  const conversation = new Conversation({
    user_id: userId,
    title: question,
  });

  await conversation.save();

  // Step 5: Create initial chat message
  const chatMessage = new ChatMessage({
    conversation_id: conversation._id,
    user_id: userId,
    role,
    question,
    ai_response: answer,
    matched_faq_id: matchedFaqId,
    source,
  });

  await chatMessage.save();

  res.status(201).json({
    message: "Conversation created.",
    conversation_id: conversation._id,
    conversation_title: conversation.title,
    question,
    answer,
    tags,
    source,
  });
};

const sendMessageToConversation = async (req, res, next) => {
  const userId = req.user._id;
  const role = req.user.role;
  const { conversation_id, question } = req.body;

  if (!conversation_id || !question) {
    return next(
      ErrorHandler.BadRequest("Conversation ID and question are required.")
    );
  }

  const conversation = await Conversation.findOne({
    _id: conversation_id,
    user_id: userId,
  });
  if (!conversation) {
    return next(
      ErrorHandler.NotFound("Conversation not found or unauthorized.")
    );
  }

  // Check for similar FAQ
  //   const matchedFaq = await Faq.findOne({ $text: { $search: question } });
  const matchedFaq = false;

  let answer,
    source,
    matchedFaqId = null,
    tags = [],
    keywords = [];

  if (matchedFaq) {
    answer = matchedFaq.answer;
    tags = matchedFaq.tags || [];
    source = "faq";
    matchedFaqId = matchedFaq._id;
  } else {
    const aiResult = await generateAnswerWithAI(question);
    answer = aiResult.answer;
    tags = aiResult.tags || [];
    keywords = aiResult.keywords || [];
    source = "ai";

    // Save the generated answer as a new FAQ
    const newFaq = new Faq({ question, answer, tags, keywords });
    await newFaq.save();
    matchedFaqId = newFaq._id;
  }

  // Save the message to the conversation
  const chatMessage = new ChatMessage({
    conversation_id,
    user_id: userId,
    role,
    question,
    ai_response: answer,
    matched_faq_id: matchedFaqId,
    source,
  });
  await chatMessage.save();

  res.status(201).json({
    message: "Message added to conversation.",
    question,
    answer,
    tags,
    source,
  });
};

const testAi = async (req, res) => {
  const { question } = req.body;
  const aiResult = await generateAnswerWithAI(question);
  res.status(200).json(aiResult);
};

const getUserConversations = async (req, res, next) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({ user_id: userId })
    .select("_id title created_at updated_at")
    .sort({ updated_at: -1 });

  res.status(200).json(conversations);
};

const getMessagesInConversation = async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    return res.status(400).json({ message: "Conversation ID is required." });
  }

  const messages = await ChatMessage.find({ conversation_id: conversationId })
    .sort({ created_at: 1 })
    .populate("matched_faq_id", "tags") // we want tags from related faq
    .lean(); // return plain JS objects

  if (!messages.length) {
    return res
      .status(404)
      .json({ message: "No messages found in this conversation." });
  }

  // Transform each message
  const formatted = messages.map((msg) => ({
    id: msg._id.toString(),
    question: msg.question,
    answer: msg.ai_response,
    tags: msg.matched_faq_id?.tags || [],
    source: msg.source,
  }));

  res.status(200).json({ messages: formatted });
};

export {
  createConversation,
  testAi,
  sendMessageToConversation,
  getUserConversations,
  getMessagesInConversation,
};
