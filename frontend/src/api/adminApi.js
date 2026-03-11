/**
 * Admin API — maps to AdminAuthController (/api/admin) and AdminDashboardController (/api)
 */
import api from './axiosConfig';

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/login
 * Authenticate admin with email + plain-text password.
 * Returns { success, message, name }
 */
export const adminLogin = (email, password) =>
  api.post('/api/admin/login', { email, password });

/**
 * POST /api/admin/add
 * Create a new admin account.
 */
export const addAdmin = (email, password, name) =>
  api.post('/api/admin/add', { email, password, name });

// ── Dashboard KPIs ────────────────────────────────────────────────────────────

/**
 * GET /api/kpi
 * Returns admin KPI metrics (totalAUM, totalClients, etc.)
 */
export const getKpi = () =>
  api.get('/api/kpi');

/**
 * GET /api/charts/sip
 * SIP chart data { labels: [], data: [] }
 */
export const getSipChart = () =>
  api.get('/api/charts/sip');

/**
 * GET /api/charts/risk
 * Risk profile distribution chart data
 */
export const getRiskChart = () =>
  api.get('/api/charts/risk');

/**
 * GET /api/charts/goals
 * Goals chart data
 */
export const getGoalChart = () =>
  api.get('/api/charts/goals');

/**
 * GET /api/leaderboard
 * RM performance leaderboard [ { name, aum }, ... ]
 */
export const getLeaderboard = () =>
  api.get('/api/leaderboard');

/**
 * GET /api/alerts
 * Smart alerts list [ { type, message }, ... ]
 */
export const getAlerts = () =>
  api.get('/api/alerts');

/**
 * GET /api/clients
 * Returns all registered clients.
 */
export const getClients = () =>
  api.get('/api/clients');

// ── Reports (stubs — return plain text) ──────────────────────────────────────

/**
 * GET /api/reports/rm?format=pdf
 */
export const generateRmReport = (format = 'pdf') =>
  api.get('/api/reports/rm', { params: { format } });

/**
 * GET /api/reports/compliance?period=month
 */
export const getComplianceSummary = (period = 'month') =>
  api.get('/api/reports/compliance', { params: { period } });
