/**
 * Fund API — maps to FundController (/api/funds)
 */
import api from './axiosConfig';

/**
 * GET /api/funds
 * Returns all mutual fund listings.
 * [ { id, name, type, returnsRegular, returnsDirect, nav, navChange, fundAge, risk, horizon, goal, assetType } ]
 */
export const getAllFunds = () =>
  api.get('/api/funds');

/**
 * POST /api/funds/filter
 * Returns funds matching the given filter criteria.
 * Any filter array can be null/empty to skip that filter.
 *
 * @param {string[]} risks     - e.g. ["LOW", "MODERATE"]
 * @param {string[]} horizons  - e.g. ["SHORT", "LONG"]
 * @param {string[]} goals     - e.g. ["RETIREMENT", "WEALTH"]
 * @param {string[]} assets    - e.g. ["EQUITY", "DEBT"]
 */
export const filterFunds = (risks = [], horizons = [], goals = [], assets = []) =>
  api.post('/api/funds/filter', { risks, horizons, goals, assets });
