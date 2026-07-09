const express = require('express');
const projectController = require('../controllers/project.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  projectIdParam,
  projectMemberParam,
  createProjectValidator,
  updateProjectValidator,
  assignProjectValidator
} = require('../validators/project.validator');

const router = express.Router();

router.use(authenticate);

router.get('/', projectController.listProjects);
router.post('/', requireRole('manager'), createProjectValidator, validate, projectController.createProject);
router.put('/:id', requireRole('manager'), updateProjectValidator, validate, projectController.updateProject);
router.delete('/:id', requireRole('manager'), projectIdParam, validate, projectController.deleteProject);
router.post('/:id/assign', requireRole('manager'), assignProjectValidator, validate, projectController.assignProject);
router.delete('/:id/members/:userId', requireRole('manager'), projectMemberParam, validate, projectController.unassignProject);
router.get('/:id/members', requireRole('manager'), projectIdParam, validate, projectController.listMembers);

module.exports = router;
