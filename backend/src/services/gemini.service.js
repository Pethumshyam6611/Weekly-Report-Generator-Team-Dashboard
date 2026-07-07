const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const { ApiError } = require('../utils/apiResponse');

const getModel = () => {
  if (!env.geminiApiKey) {
    throw new ApiError(503, 'GEMINI_NOT_CONFIGURED', 'Gemini API key is not configured');
  }

  const client = new GoogleGenerativeAI(env.geminiApiKey);
  return client.getGenerativeModel({ model: env.geminiModel });
};

const stripJsonFence = (text) => {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
};

const generateText = async (prompt) => {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateJson = async (prompt) => {
  const text = await generateText(prompt);
  try {
    return JSON.parse(stripJsonFence(text));
  } catch (error) {
    throw new ApiError(502, 'GEMINI_PARSE_ERROR', 'Gemini returned a response that could not be parsed as JSON');
  }
};

module.exports = {
  generateText,
  generateJson
};
