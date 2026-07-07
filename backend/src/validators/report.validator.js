const { body, param, query } = require('express-validator');

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('Report id must be a positive integer')
];

const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('perPage').optional().isInt({ min: 1, max: 100 }).toInt()
];

const reportQueryFilters = [
  query('projectId').optional().isInt({ min: 1 }).toInt(),
  query('userId').optional().isInt({ min: 1 }).toInt(),
  query('week').optional().isISO8601({ strict: true }).withMessage('week must be an ISO date'),
  query('startDate').optional().isISO8601({ strict: true }).withMessage('startDate must be an ISO date'),
  query('endDate').optional().isISO8601({ strict: true }).withMessage('endDate must be an ISO date')
];

const createReportValidator = [
  body('projectId').isInt({ min: 1 }).withMessage('Project id must be a positive integer'),
  body('weekStart').isISO8601({ strict: true }).withMessage('weekStart must be an ISO date'),
  body('weekEnd').isISO8601({ strict: true }).withMessage('weekEnd must be an ISO date'),
  body('tasksCompleted').optional({ nullable: true }).isString(),
  body('tasksPlanned').optional({ nullable: true }).isString(),
  body('blockers').optional({ nullable: true }).isString(),
  body('hoursWorked').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('notes').optional({ nullable: true }).isString()
];

const updateReportValidator = [
  ...idParam,
  body('projectId').optional().isInt({ min: 1 }).withMessage('Project id must be a positive integer'),
  body('weekStart').optional().isISO8601({ strict: true }).withMessage('weekStart must be an ISO date'),
  body('weekEnd').optional().isISO8601({ strict: true }).withMessage('weekEnd must be an ISO date'),
  body('tasksCompleted').optional({ nullable: true }).isString(),
  body('tasksPlanned').optional({ nullable: true }).isString(),
  body('blockers').optional({ nullable: true }).isString(),
  body('hoursWorked').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('notes').optional({ nullable: true }).isString()
];

const myReportsValidator = [
  ...paginationQuery,
  query('projectId').optional().isInt({ min: 1 }).toInt(),
  query('startDate').optional().isISO8601({ strict: true }).withMessage('startDate must be an ISO date'),
  query('endDate').optional().isISO8601({ strict: true }).withMessage('endDate must be an ISO date')
];

const managerReportsValidator = [
  ...paginationQuery,
  ...reportQueryFilters
];

module.exports = {
  idParam,
  paginationQuery,
  createReportValidator,
  updateReportValidator,
  myReportsValidator,
  managerReportsValidator
};
