import CareerChatConversation from "../models/CareerChatConversation.js";
import CareerChatMessage from "../models/CareerChatMessage.js";
import UserCareerProfile from "../models/UserCareerProfile.js";
import { generateCareerGuidanceAI } from "../utils/AIUtilities.js";

const createCareerChatConversation = async (req, res, next) => {
  const user_id = req.user._id;
  const { question } = req.body;

  const profile = await UserCareerProfile.findOne({ user_id });

  if (!profile) {
    return next(ErrorReturn.NotFound("Career profile"));
  }

  const { answer, type, resources, resumeRetouch } =
    await generateCareerGuidanceAI(profile, question);

  const conversation = await CareerChatConversation.create({
    user_id,
    title: question,
  });

  const message = await CareerChatMessage.create({
    conversation_id: conversation._id,
    user_id,
    question,
    ai_response: answer,
    type,
    resources: JSON.stringify(resources),
    resumeRetouch,
  });

  res.status(201).json({
    message: "Conversation created.",
    conversation_id: conversation._id,
    conversation_title: question,
    messages: [
      {
        id: message._id,
        question: message.question,
        answer: message.ai_response,
        type: message.type,
        resources: JSON.parse(message.resources),
        resumeRetouch: message.resumeRetouch,
      },
    ],
  });
};

const sendCareerMessage = async (req, res, next) => {
  const user_id = req.user._id;
  const { conversation_id, question } = req.body;

  const conversation = await CareerChatConversation.findOne({
    _id: conversation_id,
    user_id,
  });

  if (!conversation) {
    return next(ErrorReturn.NotFound("Conversation"));
  }

  const messages = await CareerChatMessage.find({ conversation_id }).sort({
    created_at: 1,
  });

  const profile = await UserCareerProfile.findOne({ user_id });

  if (!profile) {
    return next(ErrorReturn.NotFound("Career profile"));
  }

  const { answer, type, resources, resumeRetouch } =
    await generateCareerGuidanceAI(profile, question, messages);

  const message = await CareerChatMessage.create({
    conversation_id,
    user_id,
    question,
    ai_response: answer,
    type,
    resources: JSON.stringify(resources),
    resumeRetouch,
  });

  res.status(201).json({
    id: message._id,
    question: message.question,
    answer: message.ai_response,
    type: message.type,
    resources: JSON.parse(message.resources),
    resumeRetouch: message.resumeRetouch,
  });
};

const getUserCareerChatConversations = async (req, res, next) => {
  const user_id = req.user._id;
  const conversations = await CareerChatConversation.find({ user_id }).sort({
    created_at: -1,
  });
  res.status(200).json(conversations);
};

const getCareerConversationMessages = async (req, res, next) => {
  const user_id = req.user._id;
  const { conversationId } = req.params;

  const conversation = await CareerChatConversation.findOne({
    _id: conversationId,
    user_id,
  });
  if (!conversation) {
    return next(ErrorReturn.NotFound("Conversation"));
  }

  const messages = await CareerChatMessage.find({ conversation_id: conversationId }).sort({
    created_at: 1,
  });

  const formatted = messages.map((msg) => ({
    id: msg._id,
    question: msg.question,
    answer: msg.ai_response,
    type: msg.type,
    resources: JSON.parse(msg.resources),
    resumeRetouch: msg.resumeRetouch,
  }));

  res
    .status(200)
    .json({ conversation_id: conversationId, messages: formatted });
};

const testAi = async (req, res) => {
  const user_id = req.user._id;
  const { question, conversation_id } = req.body;

  const profile = await UserCareerProfile.findOne({ user_id });

  if (!profile) {
    return next(ErrorReturn.NotFound("Career profile"));
  }

  const conversation = await CareerChatConversation.findOne({
    _id: conversation_id,
    user_id,
  });

  if (!conversation) {
    return next(ErrorReturn.NotFound("Conversation"));
  }

  const messages = await CareerChatMessage.find({ conversation_id }).sort({
    created_at: 1,
  });

  const formatted = messages.map((msg) => ({
    id: msg._id,
    question: msg.question,
    answer: msg.ai_response,
    type: msg.type,
  }));

  const aiResult = await generateCareerGuidanceAI(profile, question, messages);
  res.status(200).json({ aiResult, messages });
};

export {
  createCareerChatConversation,
  sendCareerMessage,
  getCareerConversationMessages,
  getUserCareerChatConversations,
  testAi,
};
