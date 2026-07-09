const projectService = require('../services/project.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjectsForUser(req.user);
  return successResponse(res, { projects }, 'Projects fetched successfully');
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  return successResponse(res, { project }, 'Project created successfully', 201);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(Number(req.params.id), req.body);
  return successResponse(res, { project }, 'Project updated successfully');
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.softDeleteProject(Number(req.params.id));
  return successResponse(res, { project }, 'Project deactivated successfully');
});

const assignProject = asyncHandler(async (req, res) => {
  const result = await projectService.assignUserToProject(Number(req.params.id), Number(req.body.userId));
  const statusCode = result.created ? 201 : 200;
  const message = result.created ? 'User assigned to project successfully' : 'User is already assigned to this project';
  return successResponse(res, { assignment: result.assignment }, message, statusCode);
});

const unassignProject = asyncHandler(async (req, res) => {
  const assignment = await projectService.unassignUserFromProject(Number(req.params.id), Number(req.params.userId));
  return successResponse(res, { assignment }, 'User unassigned from project successfully');
});

const listMembers = asyncHandler(async (req, res) => {
  const members = await projectService.listProjectMembers(Number(req.params.id));
  return successResponse(res, { members }, 'Project members fetched successfully');
});

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  assignProject,
  unassignProject,
  listMembers
};
