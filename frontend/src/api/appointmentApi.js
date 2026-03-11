/**
 * Appointment API — maps to AppointmentController (/api/appointments)
 */
import api from './axiosConfig';

/**
 * POST /api/appointments
 * Book a consultation appointment.
 *
 * @param {object} data
 * @param {string} data.fullName
 * @param {string} data.email
 * @param {string} data.mobile         - 10-digit mobile number
 * @param {string} data.preferredDate  - "YYYY-MM-DD"
 * @param {string} data.preferredTime  - "HH:MM:SS"
 * @param {string} data.type           - "INVESTMENT_CONSULTATION" | "FINANCIAL_PLANNING" | "WEALTH_MANAGEMENT" | "OTHERS"
 * @param {string} [data.notes]
 *
 * @returns { success: true, message: "...", data: Appointment }
 */
export const bookAppointment = (data) =>
  api.post('/api/appointments', data);
