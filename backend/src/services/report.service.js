const { Op } = require('sequelize');
const env = require('../config/env');
const { Report, Project, User, UserProject } = require('../models');
const { ApiError } = require('../utils/apiResponse');

const parsePagination = ({ page = 1, perPage = 20 }) => {
  const parsedPage = Number(page) || 1;
  const parsedPerPage = Number(perPage) || 20;
  return {
    page: parsedPage,
    perPage: parsedPerPage,
    limit: parsedPerPage,
    offset: (parsedPage - 1) * parsedPerPage
  };
};

const dateOnly = (value) => String(value).slice(0, 10);

const validateWeekRange = (weekStart, weekEnd) => {
  if (new Date(weekStart) > new Date(weekEnd)) {
    throw new ApiError(400, 'INVALID_WEEK_RANGE', 'weekStart must be before or equal to weekEnd');
  }
};

const assertProjectAssignment = async (userId, projectId) => {
  const project = await Project.findByPk(projectId);
  if (!project || !project.is_active) {
    throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }

  const assignment = await UserProject.findOne({
    where: {
      user_id: userId,
      project_id: projectId
    }
  });

  if (!assignment) {
    throw new ApiError(403, 'PROJECT_NOT_ASSIGNED', 'You are not assigned to this project');
  }
};

const mapReportPayload = (payload) => {
  const mapped = {};
  const fieldMap = {
    projectId: 'project_id',
    weekStart: 'week_start',
    weekEnd: 'week_end',
    tasksCompleted: 'tasks_completed',
    tasksPlanned: 'tasks_planned',
    hoursWorked: 'hours_worked'
  };

  Object.entries(fieldMap).forEach(([apiField, dbField]) => {
    if (payload[apiField] !== undefined) {
      mapped[dbField] = payload[apiField];
    }
  });

  ['blockers', 'notes'].forEach((field) => {
    if (payload[field] !== undefined) {
      mapped[field] = payload[field];
    }
  });

  return mapped;
};

const buildReportWhere = (filters = {}, userId = null) => {
  const where = {};

  if (userId) where.user_id = userId;
  if (filters.userId) where.user_id = Number(filters.userId);
  if (filters.projectId) where.project_id = Number(filters.projectId);
  if (filters.week) where.week_start = dateOnly(filters.week);

  if (filters.startDate || filters.endDate) {
    where.week_start = {
      ...(where.week_start && typeof where.week_start === 'object' ? where.week_start : {}),
      ...(filters.startDate ? { [Op.gte]: dateOnly(filters.startDate) } : {}),
      ...(filters.endDate ? { [Op.lte]: dateOnly(filters.endDate) } : {})
    };
  }

  return where;
};

const createReport = async (userId, payload) => {
  validateWeekRange(payload.weekStart, payload.weekEnd);
  await assertProjectAssignment(userId, payload.projectId);

  return Report.create({
    user_id: userId,
    ...mapReportPayload(payload),
    status: 'draft',
    submitted_at: null
  });
};

const updateReport = async (userId, reportId, payload) => {
  const report = await Report.findByPk(reportId);

  if (!report) {
    throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found');
  }

  if (report.user_id !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only edit your own reports');
  }

  if (report.status !== 'draft') {
    throw new ApiError(409, 'REPORT_LOCKED', 'Only draft reports can be edited');
  }

  const mapped = mapReportPayload(payload);
  const nextWeekStart = mapped.week_start || report.week_start;
  const nextWeekEnd = mapped.week_end || report.week_end;
  validateWeekRange(nextWeekStart, nextWeekEnd);

  if (mapped.project_id && mapped.project_id !== report.project_id) {
    await assertProjectAssignment(userId, mapped.project_id);
  }

  Object.assign(report, mapped);
  await report.save();
  return report;
};

const submitReport = async (userId, reportId) => {
  const report = await Report.findByPk(reportId);

  if (!report) {
    throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found');
  }

  if (report.user_id !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only submit your own reports');
  }

  if (report.status !== 'draft') {
    throw new ApiError(409, 'REPORT_ALREADY_SUBMITTED', 'Report has already been submitted');
  }

  const submittedAt = new Date();
  const dueAt = new Date(`${report.week_end}T23:59:59.999Z`);
  dueAt.setUTCDate(dueAt.getUTCDate() + env.reportGraceDays);

  report.status = submittedAt > dueAt ? 'late' : 'submitted';
  report.submitted_at = submittedAt;
  await report.save();
  return report;
};

const getMyReports = async (userId, filters) => {
  const pagination = parsePagination(filters);
  const where = buildReportWhere(filters, userId);

  const { rows, count } = await Report.findAndCountAll({
    where,
    include: [{ model: Project, as: 'project' }],
    order: [['week_start', 'DESC'], ['created_at', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true
  });

  const byWeek = rows.reduce((acc, report) => {
    const key = report.week_start;
    if (!acc[key]) acc[key] = [];
    acc[key].push(report);
    return acc;
  }, {});

  return {
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage,
      total: count,
      totalPages: Math.ceil(count / pagination.perPage)
    },
    weeks: Object.entries(byWeek).map(([weekStart, reports]) => ({
      weekStart,
      reports
    }))
  };
};

const listReportsForManager = async (filters) => {
  const pagination = parsePagination(filters);
  const where = buildReportWhere(filters);

  const { rows, count } = await Report.findAndCountAll({
    where,
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role', 'created_at', 'updated_at'] }
    ],
    order: [['week_start', 'DESC'], ['created_at', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true
  });

  return {
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage,
      total: count,
      totalPages: Math.ceil(count / pagination.perPage)
    },
    reports: rows
  };
};

const getReportById = async (reportId, requester) => {
  const report = await Report.findByPk(reportId, {
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role', 'created_at', 'updated_at'] }
    ]
  });

  if (!report) {
    throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found');
  }

  if (requester.role !== 'manager' && report.user_id !== requester.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only view your own reports');
  }

  return report;
};

module.exports = {
  parsePagination,
  buildReportWhere,
  createReport,
  updateReport,
  submitReport,
  getMyReports,
  listReportsForManager,
  getReportById
};
