/**
 * Subscriber API — maps to SubscriberController (/api/subscribers)
 */
import api from './axiosConfig';

/**
 * POST /api/subscribers/subscribe
 * Subscribe an email address to the newsletter.
 * Returns plain text: "Subscription successful!" or "Email is already subscribed!"
 *
 * @param {string} email
 */
export const subscribe = (email) =>
  api.post('/api/subscribers/subscribe', { email });
