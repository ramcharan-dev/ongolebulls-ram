import api from './axiosConfig';

export const saveDraft = (data) => api.post('/api/ucc/save-draft', data);

export const submitUcc = (data) => api.post('/api/ucc/submit', data);

export const getUccStatus = (userId) => api.get(`/api/ucc/status/${userId}`);

export const retryUcc = (userId) => api.post(`/api/ucc/retry/${userId}`);
