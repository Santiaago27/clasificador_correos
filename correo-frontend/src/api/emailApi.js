import api from './client';

export const getMyEmails = async () => {
  const { data } = await api.get('/emails/mine');
  return data;
};

export const classifyEmail = async (payload) => {
  const { data } = await api.post('/emails/classify', payload);
  return data;
};
