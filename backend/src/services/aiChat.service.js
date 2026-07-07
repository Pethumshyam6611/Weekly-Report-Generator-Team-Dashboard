const { Op } = require('sequelize');
const { Report, Project, User, AiQueryLog } = require('../models');
const { ApiError } = require('../utils/apiResponse');
const geminiService = require('./gemini.service');
const { parsePagination } = require('./report.service');

const dateOnly = (value) => String(value).slice(0, 10);

const buildFilterPrompt = (question) => `
Extract report filters from the manager question below.
Return only valid JSON with these optional keys:
{
  "projectName": "string",
  "teamMemberName": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "week": "YYYY-MM-DD"
}
If a value is not clearly present, omit that key.

Question: ${question}
`;

const sanitizeFilters = (filters = {}) => {
  const allowed = {};
  ['projectName', 'teamMemberName'].forEach((key) => {
    if (typeof filters[key] === 'string' && filters[key].trim()) {
      allowed[key] = filters[key].trim();
    }
  });

  ['startDate', 'endDate', 'week'].forEach((key) => {
    if (typeof filters[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(filters[key])) {
      allowed[key] = filters[key];
    }
  });

  return allowed;
};

const getReportsForAi = async (filters) => {
  const where = {};
  const include = [
    {
      model: Project,
      as: 'project',
      attributes: ['id', 'name'],
      ...(filters.projectName
        ? { where: { name: { [Op.like]: `%${filters.projectName}%` } } }
        : {})
    },
    {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'role'],
      ...(filters.teamMemberName
        ? { where: { name: { [Op.like]: `%${filters.teamMemberName}%` } } }
        : {})
    }
  ];

  if (filters.week) {
    where.week_start = dateOnly(filters.week);
  } else if (filters.startDate || filters.endDate) {
    where.week_start = {
      ...(filters.startDate ? { [Op.gte]: dateOnly(filters.startDate) } : {}),
      ...(filters.endDate ? { [Op.lte]: dateOnly(filters.endDate) } : {})
    };
  }

  return Report.findAll({
    where,
    include,
    order: [['week_start', 'DESC'], ['created_at', 'DESC']],
    limit: 50
  });
};

const mapReportForGemini = (report) => ({
  id: report.id,
  user: report.user ? { id: report.user.id, name: report.user.name, role: report.user.role } : null,
  project: report.project ? { id: report.project.id, name: report.project.name } : null,
  weekStart: report.week_start,
  weekEnd: report.week_end,
  tasksCompleted: report.tasks_completed,
  tasksPlanned: report.tasks_planned,
  blockers: report.blockers,
  hoursWorked: report.hours_worked,
  notes: report.notes,
  status: report.status,
  submittedAt: report.submitted_at
});

const buildAnswerPrompt = (question, reports) => `
You are a concise team reporting assistant for managers.
Answer the question using only the report context provided.
If the context is insufficient, say what is missing.
Do not reveal sensitive information.

Question:
${question}

Report context JSON:
${JSON.stringify(reports, null, 2)}
`;

const queryReportsWithAi = async (managerId, question) => {
  const extractedFilters = sanitizeFilters(await geminiService.generateJson(buildFilterPrompt(question)));
  const reports = await getReportsForAi(extractedFilters);
  const safeReports = reports.map(mapReportForGemini);

  if (safeReports.length === 0) {
    const responseText = 'No matching reports were found for that question.';
    await AiQueryLog.create({
      manager_id: managerId,
      query_text: question,
      response_text: responseText,
      context_meta: {
        filters: extractedFilters,
        reportIds: []
      }
    });

    return {
      answer: responseText,
      filters: extractedFilters,
      reportCount: 0
    };
  }

  const answer = await geminiService.generateText(buildAnswerPrompt(question, safeReports));

  await AiQueryLog.create({
    manager_id: managerId,
    query_text: question,
    response_text: answer,
    context_meta: {
      filters: extractedFilters,
      reportIds: safeReports.map((report) => report.id)
    }
  });

  return {
    answer,
    filters: extractedFilters,
    reportCount: safeReports.length
  };
};

const getHistory = async (managerId, filters = {}) => {
  const pagination = parsePagination(filters);
  const { rows, count } = await AiQueryLog.findAndCountAll({
    where: {
      manager_id: managerId
    },
    order: [['created_at', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset
  });

  return {
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage,
      total: count,
      totalPages: Math.ceil(count / pagination.perPage)
    },
    history: rows
  };
};

module.exports = {
  queryReportsWithAi,
  getHistory
};
