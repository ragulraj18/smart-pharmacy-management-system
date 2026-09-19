import api from './api';

const getMedicines = async (params = {}) => {
  const { data } = await api.get('/medicines', { params });
  return data;
};

const getMedicineById = async (id) => {
  const { data } = await api.get(`/medicines/${id}`);
  return data;
};

const createMedicine = async (payload) => {
  const { data } = await api.post('/medicines', payload);
  return data;
};

const updateMedicine = async (id, payload) => {
  const { data } = await api.put(`/medicines/${id}`, payload);
  return data;
};

const deleteMedicine = async (id) => {
  const { data } = await api.delete(`/medicines/${id}`);
  return data;
};

const getLowStock = async () => {
  const { data } = await api.get('/medicines/alerts/low-stock');
  return data;
};

const getCategories = async () => {
  const { data } = await api.get('/medicines/categories/list');
  return data;
};

export default {
  getMedicines, getMedicineById, createMedicine, updateMedicine,
  deleteMedicine, getLowStock, getCategories,
};