/**
 * Password Reset API — maps to PasswordResetController (/reset-password)
 */
import api from './axiosConfig';

/**
 * GET /reset-password?token=<uuid>
 * Validate a password-reset token before showing the reset form.
 * Returns { valid: true/false, token, message }
 */
export const validateResetToken = (token) =>
  api.get('/reset-password', { params: { token } });

/**
 * POST /reset-password
 * Submit the new password using the reset token.
 * @param {string} token    - The UUID token from the email link
 * @param {string} password - New password (min 6 chars)
 * Returns { success: true/false, message }
 */
export const resetPassword = (token, password) =>
  api.post('/reset-password', { token, password });
