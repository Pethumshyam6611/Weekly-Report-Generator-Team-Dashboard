const { User, Project, UserProject } = require('../models');
const { ApiError } = require('../utils/apiResponse');
const { sanitizeUser } = require('./auth.service');

const listActiveProjects = async () => {
  return Project.findAll({
    where: { is_active: true },
    order: [['name', 'ASC']]
  });
};

const createProject = async (managerId, payload) => {
  return Project.create({
    name: payload.name,
    description: payload.description || null,
    created_by: managerId,
    is_active: true
  });
};

const updateProject = async (projectId, payload) => {
  const project = await Project.findByPk(projectId);
  if (!project || !project.is_active) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }

  if (payload.name !== undefined) project.name = payload.name;
  if (payload.description !== undefined) project.description = payload.description;
  if (payload.isActive !== undefined) project.is_active = payload.isActive;

  await project.save();
  return project;
};

const softDeleteProject = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (!project || !project.is_active) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }

  project.is_active = false;
  await project.save();
  return project;
};

const assignUserToProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project || !project.is_active) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
  }

  const [assignment, created] = await UserProject.findOrCreate({
    where: {
      user_id: userId,
      project_id: projectId
    },
    defaults: {
      user_id: userId,
      project_id: projectId
    }
  });

  return {
    assignment,
    created
  };
};

const listProjectMembers = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [
      {
        model: User,
        as: 'members',
        through: { attributes: ['assigned_at'] }
      }
    ]
  });

  if (!project || !project.is_active) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }

  return project.members.map(sanitizeUser);
};

module.exports = {
  listActiveProjects,
  createProject,
  updateProject,
  softDeleteProject,
  assignUserToProject,
  listProjectMembers
};
