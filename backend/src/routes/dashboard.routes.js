const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  dashboardFilterValidator,
  tasksTrendValidator,
  recentActivityValidator
} = require('../validators/dashboard.validator');

const router = express.Router();

router.use(authenticate, requireRole('manager'));

router.get('/summary', dashboardFilterValidator, validate, dashboardController.summary);
router.get('/submission-status', dashboardFilterValidator, validate, dashboardController.submissionStatus);
router.get('/tasks-trend', tasksTrendValidator, validate, dashboardController.tasksTrend);
router.get('/workload-distribution', dashboardFilterValidator, validate, dashboardController.workloadDistribution);
router.get('/recent-activity', recentActivityValidator, validate, dashboardController.recentActivity);

module.exports = router;
