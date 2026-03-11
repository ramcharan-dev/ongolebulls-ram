import api from './axiosConfig';

export const getClients = () => api.get('/api/clients');
export const createClient = (data) => api.post('/api/clients', data);
export const updateClient = (id, data) => api.put(`/api/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/api/clients/${id}`);
