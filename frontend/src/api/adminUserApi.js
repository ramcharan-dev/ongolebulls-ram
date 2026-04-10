import api from './axiosConfig';

export const adminUserApi = {
  // Stats
  getStats: () => api.get('/api/admin/stats'),

  // Internal users
  getUsers: () => api.get('/api/admin/users'),
  createUser: (data) => api.post('/api/admin/users', data),
  toggleStatus: (id) => api.patch(`/api/admin/users/${id}/status`),
  resetPassword: (id, newPassword) =>
    api.post(`/api/admin/users/${id}/reset-password`, { newPassword }),

  // Partners
  getPartners: (params) => api.get('/api/admin/partners', { params }),
  activatePartner: (id) => api.patch(`/api/admin/partners/${id}/activate`),
  deactivatePartner: (id) => api.patch(`/api/admin/partners/${id}/deactivate`),
  // Manual RM override — rmId can be null to clear the assignment
  assignPartnerRm: (id, rmId) => api.patch(`/api/admin/partners/${id}/assign-rm`, { rmId }),
  // RM service area update
  updateRmLocation: (id, assignedState, assignedDistrict) =>
    api.patch(`/api/admin/users/${id}/rm-location`, { assignedState, assignedDistrict }),

  // ARN Requests
  getArnRequests: (params) => api.get('/api/admin/partners/arn-requests', { params }),
  approveArn: (userId) => api.patch(`/api/admin/partners/arn-requests/${userId}/approve`),
  rejectArn: (userId, reason) => api.patch(`/api/admin/partners/arn-requests/${userId}/reject`, { reason }),

  // Clients
  getClients: (params) => api.get('/api/admin/clients', { params }),

  // Platform stats
  getPlatformStats: () => api.get('/api/admin/platform-stats'),

  // Referrals
  getAllReferrals: () => api.get('/api/admin/referrals'),

  // Partner detail
  getPartnerDetail: (id) => api.get(`/api/admin/partners/${id}/detail`),

  // Permissions
  getRoleUsers: () => api.get('/api/admin/permissions/roles'),
  getUserPermissions: (userId) => api.get(`/api/admin/permissions/users/${userId}`),
  updateUserPermissions: (userId, data) => api.put(`/api/admin/permissions/users/${userId}`, data),
  getRoleDefaults: (role) => api.get(`/api/admin/permissions/defaults/${role}`),

  // BSE Monitor
  bseLogin: () => api.post('/api/bse/login'),
  bseSchemes: (params) => api.post('/api/bse/schemes', null, { params }),
  bseNav: (params) => api.post('/api/bse/nav', null, { params }),
  bseStatus: (txId) => api.get(`/api/bse/status/${txId}`),
  bseTransactions: (limit = 50) => api.get('/api/bse/transactions', { params: { limit } }),
};
