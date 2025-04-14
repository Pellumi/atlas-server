import Faq from "../models/Faq.js";
import Fuse from "fuse.js";

export const searchFaqSmart = async (question) => {
  if (!question || question.trim() === "") {
    throw new Error("Question is required");
  }

  const allFaqs = await Faq.find({}, "question answer tags keywords");

  const fuse = new Fuse(allFaqs, {
    includeScore: true,
    threshold: 0.3,
    keys: ["question", "keywords", "tags"],
  });

  const results = fuse.search(question);

  if (results.length === 0) {
    return null;
  }

  const { item, score } = results[0];

  if (score > 0.4) {
    return null;
  }

  return {
    matchedFaq: item,
    confidence: parseFloat((1 - score).toFixed(2)),
  };
};
