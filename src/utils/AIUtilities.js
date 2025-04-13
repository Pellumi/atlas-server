import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateAnswerWithAI = async (question) => {
  const prompt = `
      Please provide an answer to the following question regarding Babcock University. 
      Make sure to provide accurate and relevant information about the university.
      If the information is not available, provide a general response based on your knowledge.
  
      Question: ${question}
  
      Format the answer in the following structure:
      {
        "answer": "<The generated answer>",
        "tags": ["<Tag1>", "<Tag2>", ...],
        "keywords": ["<Keyword1>", "<Keyword2>", ...]
      }
    `;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  const resultText = result.response.text().trim();
  let formattedResult = {};

  try {
    formattedResult = JSON.parse(resultText);
  } catch (e) {
    formattedResult = {
      answer: resultText,
      tags: [],
      keywords: [],
    };
  }

  return formattedResult;
};
