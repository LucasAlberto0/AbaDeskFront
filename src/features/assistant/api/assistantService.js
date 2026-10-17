import { api } from '../../../lib/axios';

export const sendChatMessage = async ({ message, sessionId }) => {
  const response = await api.post('/ai/chat', { message, sessionId });
  return response.data;
};
