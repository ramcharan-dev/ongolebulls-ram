/**
 * Settings API — maps to SettingsController (/api/settings)
 */
import api from './axiosConfig';

export const getSettings = () =>
  api.get('/api/settings');

export const getSettingById = (id) =>
  api.get(`/api/settings/${id}`);

export const createSetting = (data) =>
  api.post('/api/settings', data);

export const updateSetting = (id, data) =>
  api.put(`/api/settings/${id}`, data);

export const deleteSetting = (id) =>
  api.delete(`/api/settings/${id}`);

export const uploadFavicon = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/api/settings/${id}/upload-favicon`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
