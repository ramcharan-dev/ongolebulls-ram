/**
 * SEO API — maps to SeoController (/api/adminseo)
 */
import api from './axiosConfig';

export const getSeoSettings = () =>
  api.get('/api/adminseo');

export const getSeoSettingById = (id) =>
  api.get(`/api/adminseo/${id}`);

export const saveSeoSetting = (data) =>
  api.post('/api/adminseo/save', data);

export const deleteSeoSetting = (id) =>
  api.delete(`/api/adminseo/${id}`);
