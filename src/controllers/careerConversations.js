import CareerChatConversation from "../models/CareerChatConversation.js";
import CareerChatMessage from "../models/CareerChatMessage.js";

const createCareerChatConversation = async (req, res, next) => {
  const user_id = req.user._id;
  const { question } = req.body;

  // Call your AI function
  const { answer, type } = await generateCareerAdvice(question, user_id);

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
  });

  res.status(201).json({
    conversation_id: conversation._id,
    title: question,
    messages: [
      {
        id: message._id,
        question: message.question,
        answer: message.ai_response,
        type: message.type,
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
    return next(ErrorReturn.NotFound("Conversation not found"));
  }

  const { answer, type } = await generateCareerAdvice(question, user_id);

  const message = await CareerChatMessage.create({
    conversation_id,
    user_id,
    question,
    ai_response: answer,
    type,
  });

  res.status(201).json({
    id: message._id,
    question: message.question,
    answer: message.ai_response,
    type: message.type,
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
  const { conversation_id } = req.params;

  const conversation = await CareerConversation.findOne({
    _id: conversation_id,
    user_id,
  });
  if (!conversation) {
    return next(ErrorReturn.NotFound("Conversation not found"));
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

  res.status(200).json({ conversation_id, messages: formatted });
};
