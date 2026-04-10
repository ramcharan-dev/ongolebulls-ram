import api from './axiosConfig';

/**
 * Public location API used by the partner registration page and admin RM
 * creation modal. No auth required — backed by /api/locations/** which is
 * permitAll in SecurityConfig.
 */
export const locationApi = {
  getStates: () => api.get<string[]>('/api/locations/states'),
  getDistricts: (state: string) =>
    api.get<string[]>('/api/locations/districts', { params: { state } }),
};
