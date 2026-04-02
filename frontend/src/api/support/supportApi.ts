import api from '../axiosConfig';

export const supportApi = {
  getStats: () => api.get('/api/support/stats'),
  getTickets: (params?: { status?: string; priority?: string; category?: string; search?: string }) =>
    api.get('/api/support/tickets', { params }),
  getMyTickets: () => api.get('/api/support/tickets/mine'),
  getTicketDetail: (id: number) => api.get(`/api/support/tickets/${id}`),
  addReply: (id: number, data: { message: string; isInternal: boolean }) =>
    api.post(`/api/support/tickets/${id}/reply`, data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/support/tickets/${id}/status`, { status }),
  assignTicket: (id: number, assignedTo: number) =>
    api.patch(`/api/support/tickets/${id}/assign`, { assignedTo: String(assignedTo) }),
  escalateTicket: (id: number) =>
    api.patch(`/api/support/tickets/${id}/escalate`),
  getEscalations: () => api.get('/api/support/escalations'),
};
