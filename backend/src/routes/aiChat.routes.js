const express = require('express');
const aiChatController = require('../controllers/aiChat.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { aiQueryValidator, aiHistoryValidator } = require('../validators/aiChat.validator');

const router = express.Router();

router.use(authenticate, requireRole('manager'));

router.post('/query', aiQueryValidator, validate, aiChatController.query);
router.get('/history', aiHistoryValidator, validate, aiChatController.history);

module.exports = router;
