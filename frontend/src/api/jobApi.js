/**
 * Job API — maps to JobController (/api/jobs) and JobApplicationController (/api/apply)
 */
import api from './axiosConfig';

// ── Job Listings ──────────────────────────────────────────────────────────────

/**
 * GET /api/jobs?department=...&location=...&experience=...&remoteType=...
 * Fetch all job listings with optional filters (all params optional).
 */
export const getJobs = (filters = {}) => {
  const params = {};
  if (filters.department) params.department = filters.department;
  if (filters.location) params.location = filters.location;
  if (filters.experience) params.experience = filters.experience;
  if (filters.remoteType) params.remoteType = filters.remoteType;
  return api.get('/api/jobs', { params });
};

/**
 * POST /api/jobs
 * Create a new job posting (admin only).
 * @param {object} job — { title, department, location, experience, employmentType, remoteType, description,
 *                         qualification, salaryRange, postedDate, applyDeadline, skillsRequired,
 *                         keyResponsibility, rolesAndResponsibilities, seoTitle, seoKeywords, seoDescription }
 */
export const createJob = (job) =>
  api.post('/api/jobs', job);

/**
 * PUT /api/jobs/{id}
 * Update an existing job posting.
 */
export const updateJob = (id, job) =>
  api.put(`/api/jobs/${id}`, { ...job, id });

/**
 * DELETE /api/jobs/{id}
 * Delete a job posting. Returns 204 on success.
 */
export const deleteJob = (id) =>
  api.delete(`/api/jobs/${id}`);

// ── Filter Dropdowns ──────────────────────────────────────────────────────────

/** GET /api/jobs/departments */
export const getDepartments = () =>
  api.get('/api/jobs/departments');

/** GET /api/jobs/locations */
export const getLocations = () =>
  api.get('/api/jobs/locations');

/** GET /api/jobs/experiences */
export const getExperiences = () =>
  api.get('/api/jobs/experiences');

/** GET /api/jobs/worktypes */
export const getWorkTypes = () =>
  api.get('/api/jobs/worktypes');

// ── Job Applications ──────────────────────────────────────────────────────────

/**
 * POST /api/apply   (multipart/form-data)
 * Apply for a specific job posting.
 *
 * FormData fields:
 *   name   (string, required)
 *   email  (string, required)
 *   phone  (string, required)
 *   resume (File, required)
 *   jobId  (Long, required)
 */
export const applyForJob = (formData) =>
  api.post('/api/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
