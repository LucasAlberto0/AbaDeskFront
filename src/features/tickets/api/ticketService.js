import { api } from '../../../lib/axios';

export const getTickets = async (params) => {
  const response = await api.get('/tickets', { params });
  return response.data;
};

export const getTicketDetails = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post('/tickets', data);
  return response.data;
};

export const changeTicketStatus = async (id, status) => {
  const response = await api.put(`/tickets/${id}/status`, { status });
  return response.data;
};

export const addTicketComment = async (id, content) => {
  const response = await api.post(`/tickets/${id}/comments`, { content });
  return response.data;
};
