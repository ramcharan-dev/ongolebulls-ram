import api from '../axiosConfig';

export const financeApi = {
  getStats: () => api.get('/api/finance/stats'),
  getPayouts: (params?: { status?: string; period?: string; search?: string }) =>
    api.get('/api/finance/payouts', { params }),
  createPayout: (data: { partnerId: number; partnerName: string; period: string; grossAmount: number; gstPercent: number; tdsPercent: number }) =>
    api.post('/api/finance/payouts', data),
  releasePayout: (id: number) => api.patch(`/api/finance/payouts/${id}/release`),
  disputePayout: (id: number, reason: string) =>
    api.patch(`/api/finance/payouts/${id}/dispute`, { reason }),
  getCommissionRules: () => api.get('/api/finance/commission-rules'),
  createCommissionRule: (data: { amcName: string; fundCategory: string; trailPercent: number; upfrontPercent: number; effectiveFrom: string; effectiveTo?: string }) =>
    api.post('/api/finance/commission-rules', data),
  updateCommissionRule: (id: number, data: { amcName: string; fundCategory: string; trailPercent: number; upfrontPercent: number; effectiveFrom: string; effectiveTo?: string }) =>
    api.put(`/api/finance/commission-rules/${id}`, data),
  deactivateCommissionRule: (id: number) =>
    api.patch(`/api/finance/commission-rules/${id}/deactivate`),
  getReconciliation: (params?: { period?: string }) =>
    api.get('/api/finance/reconciliation', { params }),
  getGstTdsSummary: (params?: { period?: string }) =>
    api.get('/api/finance/gst-tds-summary', { params }),
  getPartners: () => api.get('/api/finance/partners'),
};
