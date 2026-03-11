/**
 * Candidate API — maps to CandidateController (/api/candidate)
 */
import api from './axiosConfig';

/**
 * GET /api/candidate/test
 * Health check for the candidate API endpoint.
 */
export const testCandidateApi = () =>
  api.get('/api/candidate/test');

/**
 * POST /api/candidate/add   (multipart/form-data)
 * Submit a candidate/fresher job application.
 *
 * FormData fields:
 *   name          (string, required)
 *   email         (string, required)
 *   phone         (string, required)
 *   gradYear      (number as string, required)
 *   skills        (string, required)
 *   designationAppliedFor  (string, required)
 *   anything_else_to_share (string, optional)
 *   resume        (File, required)
 *
 * On success sends a confirmation email to the applicant.
 */
export const submitCandidateApplication = (formData) =>
  api.post('/api/candidate/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
