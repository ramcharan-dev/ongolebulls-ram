/**
 * Admin Document API — maps to AdminDocumentController (/api/admin/documents)
 */
import api from './axiosConfig';

/**
 * GET /api/admin/documents?status=Pending&search=keyword
 * List all KYC document submissions with optional filters.
 * @param {string} [status]  - "Pending" | "Approved" | "Rejected"
 * @param {string} [search]  - Searches investor name, email, or PAN
 */
export const getAllDocuments = (status = '', search = '') => {
  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  return api.get('/api/admin/documents', { params });
};

/**
 * GET /api/admin/documents/{id}
 * Fetch a single document submission by ID.
 */
export const getDocumentById = (id) =>
  api.get(`/api/admin/documents/${id}`);

/**
 * GET /api/admin/documents/stats
 * Returns counts: { totalSubmissions, pendingCount, approvedCount, rejectedCount }
 */
export const getDocumentStats = () =>
  api.get('/api/admin/documents/stats');

/**
 * POST /api/admin/documents/{id}/approve
 * Approve a document submission.
 */
export const approveDocument = (id) =>
  api.post(`/api/admin/documents/${id}/approve`);

/**
 * POST /api/admin/documents/{id}/reject
 * Reject a document submission with a reason.
 * @param {number} id
 * @param {string} reason
 */
export const rejectDocument = (id, reason) =>
  api.post(`/api/admin/documents/${id}/reject`, { reason });
