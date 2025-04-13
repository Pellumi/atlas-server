import ErrorHandler from "../utils/ErrorHandler.js";
import Faq from "../models/Faq.js";

const createFaq = async (req, res, next) => {
  const { question, answer, keywords, tags } = req.body;

  if (!question || !answer || !keywords) {
    return next(
      ErrorHandler.BadRequest("Question, answer, and keywords are required.")
    );
  }

  const existingFaq = await Faq.findOne({ question });

  if (existingFaq) {
    return next(
      ErrorHandler.Conflict("Faq with this question already exists.")
    );
  }

  const newFaq = new Faq({ question, answer, keywords, tags });
  await newFaq.save();

  res.status(201).json({ message: "Faq created successfully", faq: newFaq });
};

const bulkCreateFaqs = async (req, res) => {
  const faqs = req.body;

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return next(
      ErrorHandler.BadRequest("Request body must be a non-empty array.")
    );
  }

  for (const entry of faqs) {
    if (!entry.question || !entry.answer) {
      return next(
        ErrorHandler.BadRequest(
          "Each FAQ must have a 'question' and an 'answer'."
        )
      );
    }
  }

  const insertedFaqs = await Faq.insertMany(faqs);

  return res.status(201).json({
    message: `${insertedFaqs.length} FAQs successfully added.`,
    data: insertedFaqs,
  });
};

const getAllFaqs = async (req, res, next) => {
  const faqs = await Faq.find();
  res.status(200).json({ success: true, faqs });
};

const getFaqById = async (req, res, next) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return next(ErrorHandler.NotFound("Faq"));
  }
  res.status(200).json({ success: true, faq });
};

const updateFaq = async (req, res, next) => {
  const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!faq) {
    return next(ErrorHandler.NotFound("Faq"));
  }
  res
    .status(200)
    .json({ success: true, message: "Faq updated successfully", data: faq });
};

const deleteFaq = async (req, res, next) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);
  if (!faq) {
    return next(ErrorHandler.NotFound("Faq"));
  }
  res.status(200).json({ success: true, message: "Faq deleted successfully" });
};

export {
  createFaq,
  bulkCreateFaqs,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
