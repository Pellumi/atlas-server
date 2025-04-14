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

export const generateCareerGuidanceAI = async (
  userCareerProfile,
  question,
  conversationHistory = []
) => {
  const prompt = `
      You are a professional career guidance AI trained on modern hiring practices, resume curation strategies, and job market trends.

      Context:
    - User Career Profile: ${JSON.stringify(userCareerProfile)}
    - Dream Job Description: ${userCareerProfile.dream_job || "N/A"}
    - Resume Summary: ${userCareerProfile.resume_text}...
    - Conversation History: ${conversationHistory
      .map((m) => `User: ${m.question}\nAI: ${m.ai_response}`)
      .join("\n\n")}
    - User Question: ${question}

      Instruction:
    Answer the user's question with career guidance. If the question relates to:
    - **Resume**: Suggest improvements based on the dream job.
    - **Skills**: Identify gaps and suggest paths to bridge them.
    - **Learning**: Provide a weekly or monthly plan including free/paid resources (include links).
    - **Career Choices**: Recommend next steps based on their background.

      Always format your response in this JSON schema:

    {
      "answer": "Primary response to the user",
      "type": ["skill_advice",
      "timeline",
      "resume_review",
      "resource",
      "general",],
      "resources": [
        { "type": "course", "title": "React for Beginners", "link": "https://..." },
        { "type": "video", "title": "Career Advice for Developers", "link": "https://..." }
      ],
      "resumeRetouch": "Optional: Suggested improved version of the resume",
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
      aanswer: text,
      tags: [],
      keywords: [],
      resources: [],
      resumeRetouch: "",
      learningTimeline: {},
    };
  }

  return formattedResult;
};
