/**
 * Service API — maps to ServiceController, ServiceSectionController, SectionItemController
 */
import api from './axiosConfig';

// ── Services ────────────────────────────────────────────────────────────────────

export const getServices = () =>
  api.get('/api/services');

export const getServiceById = (id) =>
  api.get(`/api/services/${id}`);

export const getServiceBySlug = (slug) =>
  api.get(`/api/services/slug/${slug}`);

export const createService = (data) =>
  api.post('/api/services', data);

export const updateService = (id, data) =>
  api.put(`/api/services/${id}`, data);

export const deleteService = (id) =>
  api.delete(`/api/services/${id}`);

// ── Service Sections ────────────────────────────────────────────────────────────

export const getSectionsByService = (serviceId) =>
  api.get(`/api/services/${serviceId}/sections`);

export const getSectionById = (id) =>
  api.get(`/api/service-sections/${id}`);

export const createSection = (serviceId, data) =>
  api.post(`/api/services/${serviceId}/sections`, data);

export const updateSection = (serviceId, sectionId, data) =>
  api.put(`/api/services/${serviceId}/sections/${sectionId}`, data);

export const deleteSection = (serviceId, sectionId) =>
  api.delete(`/api/services/${serviceId}/sections/${sectionId}`);

// ── Section Items ───────────────────────────────────────────────────────────────

export const getItemsBySection = (sectionId) =>
  api.get(`/api/section-items/section/${sectionId}`);

export const getSectionItemById = (id) =>
  api.get(`/api/section-items/${id}`);

export const createSectionItem = (sectionId, data) =>
  api.post(`/api/section-items/section/${sectionId}`, data);

export const updateSectionItem = (id, data) =>
  api.put(`/api/section-items/${id}`, data);

export const deleteSectionItem = (id) =>
  api.delete(`/api/section-items/${id}`);
