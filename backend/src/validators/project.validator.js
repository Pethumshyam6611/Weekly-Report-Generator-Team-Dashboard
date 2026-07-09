const { body, param } = require('express-validator');

const projectIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Project id must be a positive integer')
];

const projectMemberParam = [
  ...projectIdParam,
  param('userId').isInt({ min: 1 }).withMessage('User id must be a positive integer')
];

const createProjectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString()
];

const updateProjectValidator = [
  ...projectIdParam,
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty').isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
];

const assignProjectValidator = [
  ...projectIdParam,
  body('userId').isInt({ min: 1 }).withMessage('User id must be a positive integer')
];

module.exports = {
  projectIdParam,
  projectMemberParam,
  createProjectValidator,
  updateProjectValidator,
  assignProjectValidator
};
