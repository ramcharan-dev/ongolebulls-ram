/**
 * Auth API — maps to AuthController (/api/auth) and LoginController (/api/login)
 */
import api from './axiosConfig';

/**
 * POST /api/auth/send-email-otp
 * Send a 6-digit OTP to the given email address.
 */
export const sendEmailOtp = (email) =>
  api.post('/api/auth/send-email-otp', { email });

/**
 * POST /api/auth/verify-email-otp
 * Verify the OTP entered by the user.
 */
export const verifyEmailOtp = (email, otp) =>
  api.post('/api/auth/verify-email-otp', { email, otp });

/**
 * POST /api/auth/register-client   (multipart/form-data)
 * Register a new investor with KYC, bank, and optional file uploads.
 * @param {FormData} formData — must contain "data" (JSON part) + optional kycFile, chequeFile
 */
export const registerClient = (formData) =>
  api.post('/api/auth/register-client', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * POST /api/auth/login
 * Authenticate with email and password. Returns { id, email, fullName }.
 */
export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

/**
 * POST /api/auth/forgot-password
 * Triggers a password-reset email containing a reset link.
 */
export const forgotPassword = (email) =>
  api.post('/api/auth/forgot-password', { email });

/**
 * POST /api/auth/logout
 * Invalidates the server-side session and clears the session cookie.
 */
export const logout = () =>
  api.post('/api/auth/logout');

/**
 * GET /api/auth/profile/{id}
 * Fetch full user profile by user ID.
 */
export const getUserProfile = (id) =>
  api.get(`/api/auth/profile/${id}`);

/**
 * PUT /api/auth/profile/update/{id}
 * Update user profile fields (basic info, bank details, KYC, risk profile).
 * @param {number} id
 * @param {object} userData — partial or full User object
 */
export const updateUserProfile = (id, userData) =>
  api.put(`/api/auth/profile/update/${id}`, userData);
