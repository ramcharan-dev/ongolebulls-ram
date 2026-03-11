/**
 * User / Dashboard API
 * Maps to DashboardController (/api/dashboard) and DashboardActionsController (/api)
 */
import api from './axiosConfig';

// ── Dashboard Data ────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/{userId}
 * Full dashboard payload for the logged-in investor.
 * Returns DashboardPayload { totalPortfolioValue, totalInvestedAmount, portfolioGrowth,
 *                            activeSips, positions[], sipSummaries[], recentTransactions[],
 *                            fundSuggestions[], alerts[] }
 */
export const getDashboard = (userId) =>
  api.get(`/api/dashboard/${userId}`);

/**
 * GET /api/dashboard/{userId}/asset-allocation
 * Asset allocation breakdown for pie chart.
 * Returns [ { assetClass: "EQUITY", totalValue: 150000 }, ... ]
 */
export const getAssetAllocation = (userId) =>
  api.get(`/api/dashboard/${userId}/asset-allocation`);

/**
 * GET /api/dashboard/requests/{userId}
 * Fetch all user requests: investments, redemptions, SIPs, nominees.
 * Returns { investments[], redemptions[], sips[], nominees[] }
 */
export const getDashboardRequests = (userId) =>
  api.get(`/api/dashboard/requests/${userId}`);

/**
 * GET /api/user/{userId}
 * Fetch a User entity by its ID.
 */
export const getUserById = (userId) =>
  api.get(`/api/user/${userId}`);

// ── Investment Actions ────────────────────────────────────────────────────────

/**
 * POST /api/investments/request
 * Create a new investment request.
 * @param {{ userId, fundName, amount }} data
 */
export const createInvestmentRequest = (data) =>
  api.post('/api/investments/request', data);

/**
 * POST /api/redeem/request
 * Create a redemption request.
 * @param {{ userId, fundName, amount }} data
 */
export const createRedemptionRequest = (data) =>
  api.post('/api/redeem/request', data);

/**
 * POST /api/sip/request
 * Start a new SIP plan.
 * @param {{ userId, fundName, amount, frequency, startDate }} data
 *   startDate format: "YYYY-MM-DD"
 */
export const createSipRequest = (data) =>
  api.post('/api/sip/request', data);

/**
 * POST /api/nominee
 * Save a nominee record for the user.
 * @param {{ userId, nomineeName, relationship, dateOfBirth, allocationPercentage, nomineeAddress }} data
 */
export const saveNominee = (data) =>
  api.post('/api/nominee', data);
