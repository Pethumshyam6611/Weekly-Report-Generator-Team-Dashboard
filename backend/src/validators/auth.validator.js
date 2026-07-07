const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isIn(['team_member', 'manager'])
    .withMessage('Role must be team_member or manager'),
  body('managerInviteCode').optional().isString().isLength({ max: 120 })
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required')
];

const refreshValidator = [
  body('refreshToken').isString().notEmpty().withMessage('Refresh token is required')
];

const logoutValidator = refreshValidator;

module.exports = {
  registerValidator,
  loginValidator,
  refreshValidator,
  logoutValidator
};
