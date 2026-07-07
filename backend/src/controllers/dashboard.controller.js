const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.query);
  return successResponse(res, data, 'Dashboard summary fetched successfully');
});

const submissionStatus = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSubmissionStatus(req.query);
  return successResponse(res, data, 'Submission status fetched successfully');
});

const tasksTrend = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTasksTrend(req.query);
  return successResponse(res, { trend: data }, 'Tasks trend fetched successfully');
});

const workloadDistribution = asyncHandler(async (req, res) => {
  const data = await dashboardService.getWorkloadDistribution(req.query);
  return successResponse(res, { distribution: data }, 'Workload distribution fetched successfully');
});

const recentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity(req.query);
  return successResponse(res, data, 'Recent activity fetched successfully');
});

module.exports = {
  summary,
  submissionStatus,
  tasksTrend,
  workloadDistribution,
  recentActivity
};
