/**
 * Password Reset API — uses /api/auth endpoints
 */
import api from './axiosConfig';

/**
 * GET /api/auth/reset-password/validate?token=<uuid>
 * Validate a password-reset token before showing the reset form.
 * Returns { valid: true/false, token, message }
 */
export const validateResetToken = (token) =>
  api.get('/api/auth/reset-password/validate', { params: { token } });

/**
 * POST /api/auth/reset-password
 * Submit the new password using the reset token.
 * @param {string} token       - The UUID token from the email link
 * @param {string} newPassword - New password (min 6 chars)
 * Returns { success: true/false, message }
 */
export const resetPassword = (token, newPassword) =>
  api.post('/api/auth/reset-password', { token, newPassword });
