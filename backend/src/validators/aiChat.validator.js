const { body } = require('express-validator');
const { paginationQuery } = require('./report.validator');

const aiQueryValidator = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ max: 1000 })
    .withMessage('Question must be 1000 characters or fewer')
];

const aiHistoryValidator = [
  ...paginationQuery
];

module.exports = {
  aiQueryValidator,
  aiHistoryValidator
};
