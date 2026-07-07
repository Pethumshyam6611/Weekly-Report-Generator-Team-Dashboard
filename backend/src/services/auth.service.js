const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, RefreshToken } = require('../models');
const env = require('../config/env');
const { ApiError } = require('../utils/apiResponse');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry
} = require('../utils/tokenUtils');

const sanitizeUser = (user) => {
  const plain = user.toJSON ? user.toJSON() : user;
  const { password_hash, ...safeUser } = plain;
  return safeUser;
};

const issueTokenPair = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    user_id: user.id,
    token_hash: hashToken(refreshToken),
    expires_at: getRefreshTokenExpiry()
  });

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: env.jwt.accessExpiresIn
  };
};

const register = async ({ name, email, password, role = 'team_member', managerInviteCode }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ where: { email: normalizedEmail } });

  if (existing) {
    throw new ApiError(409, 'EMAIL_EXISTS', 'A user with this email already exists');
  }

  let finalRole = 'team_member';
  if (role === 'manager') {
    if (!env.managerInviteCode || managerInviteCode !== env.managerInviteCode) {
      throw new ApiError(403, 'INVALID_MANAGER_INVITE', 'A valid manager invite code is required');
    }
    finalRole = 'manager';
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password_hash: passwordHash,
    role: finalRole
  });

  return sanitizeUser(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const tokens = await issueTokenPair(user);

  return {
    user: sanitizeUser(user),
    tokens
  };
};

const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
  }

  const storedToken = await RefreshToken.findOne({
    where: {
      user_id: payload.id,
      token_hash: hashToken(refreshToken),
      expires_at: {
        [Op.gt]: new Date()
      }
    }
  });

  if (!storedToken) {
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token user no longer exists');
  }

  return {
    accessToken: signAccessToken(user),
    tokenType: 'Bearer',
    expiresIn: env.jwt.accessExpiresIn
  };
};

const logout = async (userId, refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
  }

  if (payload.id !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Refresh token does not belong to the authenticated user');
  }

  await RefreshToken.destroy({
    where: {
      user_id: userId,
      token_hash: hashToken(refreshToken)
    }
  });
};

const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
  }
  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  sanitizeUser
};
