import api from './axiosConfig';

export const partnerApi = {
  // Profile
  getMe: () => api.get('/api/partner/me'),

  updateProfile: (data: Record<string, string>) =>
    api.patch('/api/partner/profile', data),

  updateBankDetails: (data: {
    partnerBankAccount: string;
    partnerIfsc: string;
    partnerBankName: string;
  }) => api.patch('/api/partner/bank-details', data),

  acceptAgreement: () => api.patch('/api/partner/agreement'),

  // ARN Onboarding
  submitArn: (data: { arnNumber: string; pan: string; euin?: string }) =>
    api.post('/api/partner/arn-submit', data),

  // Stats
  getStats: () => api.get('/api/partner/stats'),

  // Clients
  getClients: (params?: { search?: string; stage?: string }) =>
    api.get('/api/partner/clients', { params }),

  addClient: (data: { fullName: string; email: string; mobile: string }) =>
    api.post('/api/partner/clients', data),

  updateClientLifecycle: (clientId: number, stage: string) =>
    api.patch(`/api/partner/clients/${clientId}/lifecycle`, { stage }),

  // SIPs
  getSips: (params?: { status?: string }) =>
    api.get('/api/partner/sips', { params }),

  // Tracker
  uploadCas: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/partner/tracker/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  addHoldings: (holdings: Array<{
    clientName: string;
    clientId?: number;
    amcName: string;
    fundName: string;
    folioNumber: string;
    units: number;
    nav: number;
    currentValue: number;
  }>) => api.post('/api/partner/tracker/holdings', holdings),

  getHoldings: () => api.get('/api/partner/tracker/holdings'),

  getCobOpportunities: () => api.get('/api/partner/tracker/cob-opportunities'),

  // Transactions
  getTransactions: (params?: { type?: string; status?: string }) =>
    api.get('/api/partner/transactions', { params }),
  createTransaction: (data: { clientId?: number; type: string; schemeName?: string; amount: number; notes?: string }) =>
    api.post('/api/partner/transactions', data),

  // Revenue
  getRevenue: () => api.get('/api/partner/revenue'),

  // Referrals
  getReferrals: () => api.get('/api/partner/referrals'),
  getReferrerInfo: (ref: string) => api.get(`/api/auth/referrer-info?ref=${ref}`),
};
