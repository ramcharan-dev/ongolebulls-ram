/**
 * Calculator API — maps to CalculatorController (/api/calculator)
 */
import api from './axiosConfig';

/**
 * GET /api/calculator/amcs
 * Returns list of all AMC companies [ { id, name } ]
 */
export const getAllAMCs = () =>
  api.get('/api/calculator/amcs');

/**
 * GET /api/calculator/schemes/{amcId}
 * Returns schemes belonging to the given AMC.
 * [ { id, name, avgReturnRate, amc: { id, name } } ]
 */
export const getSchemesByAmc = (amcId) =>
  api.get(`/api/calculator/schemes/${amcId}`);

/**
 * GET /api/calculator/sip?monthlyInvestment=5000&annualReturn=12&years=10
 * Calculates SIP maturity value.
 * Returns { maturityValue, investedAmount, estimatedReturns }
 */
export const calculateSIP = (monthlyInvestment, annualReturn, years) =>
  api.get('/api/calculator/sip', {
    params: { monthlyInvestment, annualReturn, years },
  });

/**
 * GET /api/calculator/lumpsum?amount=100000&annualReturn=12&years=5
 * Calculates lumpsum maturity value.
 * Returns { maturityValue, investedAmount, estimatedReturns }
 */
export const calculateLumpsum = (amount, annualReturn, years) =>
  api.get('/api/calculator/lumpsum', {
    params: { amount, annualReturn, years },
  });
