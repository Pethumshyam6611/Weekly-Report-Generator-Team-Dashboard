const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  weekQueryValidator,
  tasksTrendValidator,
  recentActivityValidator
} = require('../validators/dashboard.validator');

const router = express.Router();

router.use(authenticate, requireRole('manager'));

router.get('/summary', weekQueryValidator, validate, dashboardController.summary);
router.get('/submission-status', weekQueryValidator, validate, dashboardController.submissionStatus);
router.get('/tasks-trend', tasksTrendValidator, validate, dashboardController.tasksTrend);
router.get('/workload-distribution', weekQueryValidator, validate, dashboardController.workloadDistribution);
router.get('/recent-activity', recentActivityValidator, validate, dashboardController.recentActivity);

module.exports = router;
