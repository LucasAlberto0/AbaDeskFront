import { api } from '../../../lib/axios';

export const getTestCases = async (ticketId) => {
  const response = await api.get(`/testcases/ticket/${ticketId}`);
  return response.data;
};

export const createTestCase = async (data) => {
  const response = await api.post('/testcases', data);
  return response.data;
};

export const executeTestCase = async (id, status, notes) => {
  const response = await api.put(`/testcases/${id}/execute`, { status, executionNotes: notes });
  return response.data;
};
