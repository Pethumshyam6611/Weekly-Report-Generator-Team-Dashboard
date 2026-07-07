const jwt = require('jsonwebtoken');
const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const { ApiError, errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return errorResponse(res, error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof UniqueConstraintError) {
    return errorResponse(res, 409, 'CONFLICT', 'A record with these values already exists');
  }

  if (error instanceof ForeignKeyConstraintError) {
    return errorResponse(res, 400, 'INVALID_REFERENCE', 'Referenced record does not exist');
  }

  if (error instanceof ValidationError) {
    const details = error.errors.map((item) => ({
      field: item.path,
      message: item.message
    }));
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Request validation failed', details);
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    return errorResponse(res, 401, 'INVALID_TOKEN', 'Token is invalid or expired');
  }

  const details = env.nodeEnv === 'production' ? null : { stack: error.stack };
  return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Something went wrong', details);
};

module.exports = errorHandler;
