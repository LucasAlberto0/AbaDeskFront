import { api } from '../../../lib/axios';

export const submitHomologation = async (ticketId, isApproved, comment) => {
  const response = await api.post(`/homologations/ticket/${ticketId}`, { isApproved, comment });
  return response.data;
};
