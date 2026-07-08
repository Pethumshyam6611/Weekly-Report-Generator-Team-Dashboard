const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticate);

router.get('/me', userController.me);
router.get('/team-members', requireRole('manager'), userController.listTeamMembers);

module.exports = router;
