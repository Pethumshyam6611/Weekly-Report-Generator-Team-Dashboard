const { query } = require('express-validator');
const { paginationQuery } = require('./report.validator');

const dashboardFilterValidator = [
  query('week').optional().isISO8601({ strict: true }).withMessage('week must be an ISO date'),
  query('projectId').optional().isInt({ min: 1 }).toInt()
];

const tasksTrendValidator = [
  query('userId').optional().isInt({ min: 1 }).toInt(),
  query('projectId').optional().isInt({ min: 1 }).toInt(),
  query('startDate').optional().isISO8601({ strict: true }).withMessage('startDate must be an ISO date'),
  query('endDate').optional().isISO8601({ strict: true }).withMessage('endDate must be an ISO date')
];

const recentActivityValidator = [
  query('projectId').optional().isInt({ min: 1 }).toInt(),
  ...paginationQuery
];

module.exports = {
  dashboardFilterValidator,
  tasksTrendValidator,
  recentActivityValidator
};
