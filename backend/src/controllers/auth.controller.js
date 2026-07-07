const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return successResponse(res, { user }, 'User registered successfully', 201);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return successResponse(res, data, 'Logged in successfully');
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken);
  return successResponse(res, { tokens }, 'Access token refreshed successfully');
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id, req.body.refreshToken);
  return successResponse(res, null, 'Logged out successfully');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return successResponse(res, { user }, 'Current user fetched successfully');
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
};
