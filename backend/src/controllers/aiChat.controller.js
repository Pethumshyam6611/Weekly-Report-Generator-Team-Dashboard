const aiChatService = require('../services/aiChat.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const query = asyncHandler(async (req, res) => {
  const data = await aiChatService.queryReportsWithAi(req.user.id, req.body.question);
  return successResponse(res, data, 'AI answer generated successfully');
});

const history = asyncHandler(async (req, res) => {
  const data = await aiChatService.getHistory(req.user.id, req.query);
  return successResponse(res, data, 'AI query history fetched successfully');
});

module.exports = {
  query,
  history
};
