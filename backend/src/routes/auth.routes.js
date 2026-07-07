const express = require('express');
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { ApiError } = require('../utils/apiResponse');
const {
  registerValidator,
  loginValidator,
  refreshValidator,
  logoutValidator
} = require('../validators/auth.validator');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'RATE_LIMITED', 'Too many auth attempts. Please try again later.'));
  }
});

router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/refresh', authLimiter, refreshValidator, validate, authController.refresh);
router.post('/logout', authenticate, logoutValidator, validate, authController.logout);
router.get('/me', authenticate, authController.me);

module.exports = router;
