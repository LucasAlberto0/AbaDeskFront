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

export const startAnalysis = async (id) => {
  const response = await api.post(`/tickets/${id}/analyze`);
  return response.data;
};

export const startProgress = async (id) => {
  const response = await api.post(`/tickets/${id}/start-progress`);
  return response.data;
};

export const waitForUser = async (id) => {
  const response = await api.post(`/tickets/${id}/wait-for-user`);
  return response.data;
};

export const resolveTicket = async (id) => {
  const response = await api.post(`/tickets/${id}/resolve`);
  return response.data;
};

export const addTicketComment = async (id, content) => {
  const response = await api.post(`/tickets/${id}/comments`, { content });
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};
