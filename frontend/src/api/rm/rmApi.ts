import api from '../axiosConfig';

export const rmApi = {
  getStats: () => api.get('/api/rm/stats'),
  getPartners: (params?: { search?: string; status?: string; type?: string }) =>
    api.get('/api/rm/partners', { params }),
  getPerformance: () => api.get('/api/rm/performance'),
  getTasks: () => api.get('/api/rm/tasks'),
  createTask: (data: { title: string; description?: string; priority?: string; dueDate?: string; relatedPartnerId?: number }) =>
    api.post('/api/rm/tasks', data),
  completeTask: (id: number) => api.patch(`/api/rm/tasks/${id}/complete`),
  reopenTask: (id: number) => api.patch(`/api/rm/tasks/${id}/reopen`),
  deleteTask: (id: number) => api.delete(`/api/rm/tasks/${id}`),
};
