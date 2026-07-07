const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiResponse');

const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const details = result.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));

    return next(new ApiError(400, 'VALIDATION_ERROR', 'Request validation failed', details));
  }

  return next();
};

module.exports = validate;
