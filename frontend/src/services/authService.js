import api from './api';
 
const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};
 
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};
 
const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
 
export default { register, login, getMe };
 
