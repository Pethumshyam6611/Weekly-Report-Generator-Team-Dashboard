const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return successResponse(res, { user }, 'Current user fetched successfully');
});

const listTeamMembers = asyncHandler(async (_req, res) => {
  const users = await userService.listTeamMembers();
  return successResponse(res, { users }, 'Team members fetched successfully');
});

module.exports = {
  me,
  listTeamMembers
};
