const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticate);

router.get('/me', userController.me);

module.exports = router;
