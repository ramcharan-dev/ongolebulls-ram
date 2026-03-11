/**
 * Contact API — maps to ContactController (/api/contact)
 */
import api from './axiosConfig';

/**
 * POST /api/contact
 * Submit a contact form. Saves the inquiry and sends an email notification.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} message
 *
 * Returns: { message: "Contact form submitted successfully!" }
 */
export const submitContact = (name, email, message) =>
  api.post('/api/contact', { name, email, message });
