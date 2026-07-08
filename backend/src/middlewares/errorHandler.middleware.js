const jwt = require('jsonwebtoken');
const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const { ApiError, errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');

const getUniqueConstraintResponse = (error) => {
  const fields = Object.keys(error.fields || {});
  const hasFields = (...requiredFields) => requiredFields.every((field) => fields.includes(field));

  if (hasFields('email')) {
    return {
      code: 'EMAIL_EXISTS',
      message: 'An account with this email already exists. Please log in or use another email.'
    };
  }

  if (hasFields('user_id', 'project_id', 'week_start')) {
    return {
      code: 'REPORT_ALREADY_EXISTS',
      message: 'You already have a report for this project and week. Please open the existing report and edit the draft instead.'
    };
  }

  if (hasFields('user_id', 'project_id')) {
    return {
      code: 'PROJECT_ASSIGNMENT_EXISTS',
      message: 'This team member is already assigned to this project.'
    };
  }

  return {
    code: 'DUPLICATE_RECORD',
    message: 'This item already exists. Please check the existing record before trying again.'
  };
};

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return errorResponse(res, error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof UniqueConstraintError) {
    const conflict = getUniqueConstraintResponse(error);
    return errorResponse(res, 409, conflict.code, conflict.message);
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
