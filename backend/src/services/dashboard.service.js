const { Op, fn, col, literal } = require('sequelize');
const { User, Project, Report, UserProject } = require('../models');
const { parsePagination } = require('./report.service');

const dateOnly = (value) => String(value).slice(0, 10);

const getWeekStart = (value = new Date()) => {
  const date = new Date(value);
  const dayOffset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayOffset);
  return date.toISOString().slice(0, 10);
};

const getSummary = async ({ week, projectId } = {}) => {
  const weekStart = week ? dateOnly(week) : getWeekStart();
  const selectedProjectId = projectId ? Number(projectId) : null;
  const assignmentWhere = selectedProjectId ? { project_id: selectedProjectId } : {};
  const reportWhere = {
    week_start: weekStart,
    ...(selectedProjectId ? { project_id: selectedProjectId } : {})
  };

  const expectedReports = await UserProject.count({
    where: assignmentWhere,
    include: [
      {
        model: User,
        as: 'user',
        where: { role: 'team_member' },
        required: true
      }
    ]
  });

  const submittedReports = await Report.count({
    where: {
      ...reportWhere,
      status: {
        [Op.in]: ['submitted', 'late']
      }
    }
  });

  const openBlockers = await Report.count({
    where: {
      ...reportWhere,
      [Op.and]: [
        { blockers: { [Op.not]: null } },
        { blockers: { [Op.ne]: '' } }
      ]
    }
  });

  return {
    weekStart,
    expectedReports,
    submittedReports,
    complianceRate: expectedReports === 0 ? 0 : Number((submittedReports / expectedReports).toFixed(2)),
    openBlockers
  };
};

const getSubmissionStatus = async ({ week, projectId } = {}) => {
  const weekStart = week ? dateOnly(week) : getWeekStart();
  const selectedProjectId = projectId ? Number(projectId) : null;
  const members = await User.findAll({
    where: { role: 'team_member' },
    attributes: ['id', 'name', 'email', 'role'],
    include: [
      {
        model: Project,
        as: 'projects',
        attributes: ['id', 'name'],
        where: {
          is_active: true,
          ...(selectedProjectId ? { id: selectedProjectId } : {})
        },
        through: { attributes: [] },
        required: Boolean(selectedProjectId)
      }
    ],
    order: [['name', 'ASC']]
  });

  const reports = await Report.findAll({
    where: {
      week_start: weekStart,
      user_id: members.map((member) => member.id),
      ...(selectedProjectId ? { project_id: selectedProjectId } : {})
    }
  });

  return {
    weekStart,
    members: members.map((member) => {
      const projectStatuses = member.projects.map((project) => {
        const report = reports.find(
          (item) => item.user_id === member.id && item.project_id === project.id
        );

        return {
          projectId: project.id,
          projectName: project.name,
          status: report ? (report.status === 'draft' ? 'pending' : report.status) : 'pending',
          reportId: report ? report.id : null,
          submittedAt: report ? report.submitted_at : null
        };
      });

      const statuses = projectStatuses.map((item) => item.status);
      const overallStatus = statuses.includes('late')
        ? 'late'
        : statuses.length > 0 && statuses.every((status) => status === 'submitted')
          ? 'submitted'
          : 'pending';

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        status: overallStatus,
        projects: projectStatuses
      };
    })
  };
};

const getTasksTrend = async ({ userId, projectId, startDate, endDate } = {}) => {
  const defaultEnd = getWeekStart();
  const defaultStartDate = new Date(`${defaultEnd}T00:00:00.000Z`);
  defaultStartDate.setUTCDate(defaultStartDate.getUTCDate() - 49);
  const defaultStart = defaultStartDate.toISOString().slice(0, 10);

  const where = {
    week_start: {
      [Op.between]: [startDate ? dateOnly(startDate) : defaultStart, endDate ? dateOnly(endDate) : defaultEnd]
    }
  };

  if (userId) {
    where.user_id = Number(userId);
  }

  if (projectId) {
    where.project_id = Number(projectId);
  }

  const rows = await Report.findAll({
    attributes: [
      'week_start',
      [fn('COUNT', col('Report.id')), 'reportCount'],
      [fn('SUM', col('hours_worked')), 'totalHours']
    ],
    where,
    group: ['week_start'],
    order: [['week_start', 'ASC']]
  });

  return rows.map((row) => ({
    weekStart: row.week_start,
    reportCount: Number(row.get('reportCount')),
    totalHours: Number(row.get('totalHours') || 0)
  }));
};

const getWorkloadDistribution = async ({ week, projectId } = {}) => {
  const where = {};
  if (week) {
    where.week_start = dateOnly(week);
  }
  if (projectId) {
    where.project_id = Number(projectId);
  }

  const rows = await Report.findAll({
    attributes: [
      [col('project.id'), 'projectId'],
      [col('project.name'), 'projectName'],
      [fn('COUNT', col('Report.id')), 'reportCount'],
      [fn('SUM', col('hours_worked')), 'totalHours'],
      [literal("SUM(CASE WHEN blockers IS NOT NULL AND blockers <> '' THEN 1 ELSE 0 END)"), 'openBlockers']
    ],
    include: [
      {
        model: Project,
        as: 'project',
        attributes: []
      }
    ],
    where,
    group: ['project.id', 'project.name'],
    order: [[literal('reportCount'), 'DESC']]
  });

  return rows.map((row) => ({
    projectId: row.get('projectId'),
    projectName: row.get('projectName'),
    reportCount: Number(row.get('reportCount')),
    totalHours: Number(row.get('totalHours') || 0),
    openBlockers: Number(row.get('openBlockers') || 0)
  }));
};

const getRecentActivity = async (filters = {}) => {
  const pagination = parsePagination(filters);
  const where = {
    submitted_at: {
      [Op.not]: null
    }
  };

  if (filters.projectId) {
    where.project_id = Number(filters.projectId);
  }

  const { rows, count } = await Report.findAndCountAll({
    where,
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }
    ],
    order: [['submitted_at', 'DESC']],
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
    activity: rows
  };
};

module.exports = {
  getWeekStart,
  getSummary,
  getSubmissionStatus,
  getTasksTrend,
  getWorkloadDistribution,
  getRecentActivity
};
