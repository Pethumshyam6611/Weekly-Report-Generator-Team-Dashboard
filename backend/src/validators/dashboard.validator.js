const { query } = require('express-validator');
const { paginationQuery } = require('./report.validator');

const weekQueryValidator = [
  query('week').optional().isISO8601({ strict: true }).withMessage('week must be an ISO date')
];

const tasksTrendValidator = [
  query('userId').optional().isInt({ min: 1 }).toInt(),
  query('startDate').optional().isISO8601({ strict: true }).withMessage('startDate must be an ISO date'),
  query('endDate').optional().isISO8601({ strict: true }).withMessage('endDate must be an ISO date')
];

const recentActivityValidator = [
  ...paginationQuery
];

module.exports = {
  weekQueryValidator,
  tasksTrendValidator,
  recentActivityValidator
};
