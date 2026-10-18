import { api } from '../../../lib/axios';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};

export const clearAllNotifications = async () => {
  await api.delete('/notifications');
};
