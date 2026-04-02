import api from '../axiosConfig';

export const complianceApi = {
  getStats: () => api.get('/api/compliance/stats'),
  getAuditLogs: (params?: { entityType?: string; search?: string; from?: string; to?: string }) =>
    api.get('/api/compliance/audit-logs', { params }),
  getFlags: (params?: { status?: string }) =>
    api.get('/api/compliance/flags', { params }),
  raiseFlag: (data: { entityType: string; entityId: number; entityName: string; flagType: string; reason: string }) =>
    api.post('/api/compliance/flags', data),
  resolveFlag: (id: number, notes: string) =>
    api.patch(`/api/compliance/flags/${id}/resolve`, { notes }),
  getRiskSummary: () => api.get('/api/compliance/partners/risk-summary'),
  getDisclosures: () => api.get('/api/compliance/disclosures'),
};
