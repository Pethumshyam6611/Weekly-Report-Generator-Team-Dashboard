const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.user.id, req.body);
  return successResponse(res, { report }, 'Report created successfully', 201);
});

const updateReport = asyncHandler(async (req, res) => {
  const report = await reportService.updateReport(req.user.id, Number(req.params.id), req.body);
  return successResponse(res, { report }, 'Report updated successfully');
});

const submitReport = asyncHandler(async (req, res) => {
  const report = await reportService.submitReport(req.user.id, Number(req.params.id));
  return successResponse(res, { report }, 'Report submitted successfully');
});

const getMyReports = asyncHandler(async (req, res) => {
  const data = await reportService.getMyReports(req.user.id, req.query);
  return successResponse(res, data, 'Report history fetched successfully');
});

const listReports = asyncHandler(async (req, res) => {
  const data = await reportService.listReportsForManager(req.query);
  return successResponse(res, data, 'Reports fetched successfully');
});

const getReport = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(Number(req.params.id), req.user);
  return successResponse(res, { report }, 'Report fetched successfully');
});

module.exports = {
  createReport,
  updateReport,
  submitReport,
  getMyReports,
  listReports,
  getReport
};
