const express = require('express');
const reportController = require('../controllers/report.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  idParam,
  createReportValidator,
  updateReportValidator,
  myReportsValidator,
  managerReportsValidator
} = require('../validators/report.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', requireRole('team_member'), createReportValidator, validate, reportController.createReport);
router.get('/me', myReportsValidator, validate, reportController.getMyReports);
router.get('/', requireRole('manager'), managerReportsValidator, validate, reportController.listReports);
router.put('/:id', updateReportValidator, validate, reportController.updateReport);
router.post('/:id/submit', idParam, validate, reportController.submitReport);
router.get('/:id', idParam, validate, reportController.getReport);

module.exports = router;
