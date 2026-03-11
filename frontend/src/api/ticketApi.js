/**
 * Ticket API — maps to AdminTicketController (/api/admin/tickets)
 */
import api from './axiosConfig';

export const getTickets = (status) =>
  api.get('/api/admin/tickets', { params: status ? { status } : {} });

export const getTicketById = (ticketId) =>
  api.get(`/api/admin/tickets/${ticketId}`);

export const updateTicketStatus = (ticketId, status, resolution) =>
  api.put(`/api/admin/tickets/${ticketId}/status`, { status, resolution });

export const replyToTicket = (ticketId, message, repliedBy) =>
  api.post(`/api/admin/tickets/${ticketId}/reply`, { message, repliedBy });

export const getTicketStats = () =>
  api.get('/api/admin/tickets/stats');
