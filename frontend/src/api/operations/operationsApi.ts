import api from '../axiosConfig';

export const operationsApi = {
  getStats: () => api.get('/api/operations/stats'),
  getPendingPartners: () => api.get('/api/operations/partners/pending'),
  getAllPartners: (params?: { search?: string; status?: string; type?: string }) =>
    api.get('/api/operations/partners/all', { params }),
  activatePartner: (id: number) => api.patch(`/api/operations/partners/${id}/activate`),
  rejectPartner: (id: number, rejectionReason: string) =>
    api.patch(`/api/operations/partners/${id}/reject`, { rejectionReason }),
  getKycQueue: (params?: { stage?: string }) =>
    api.get('/api/operations/clients/kyc-queue', { params }),
  updateClientLifecycle: (id: number, stage: string) =>
    api.patch(`/api/operations/clients/${id}/lifecycle`, { stage }),
  getPendingDocuments: () => api.get('/api/operations/documents/pending'),
  markDocumentReviewed: (id: number, status: string) =>
    api.patch(`/api/operations/documents/${id}/review`, { status }),
};
