import api from './api';
 
const uploadPrescription = async (file) => {
  const formData = new FormData();
  formData.append('prescriptionFile', file);
  const { data } = await api.post('/prescriptions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
 
const getMyPrescriptions = async () => (await api.get('/prescriptions')).data;
const getPendingPrescriptions = async () => (await api.get('/prescriptions/pending')).data;
const analyzePrescription = async (id) => (await api.post(`/prescriptions/${id}/analyze`)).data;
const reviewPrescription = async (id, status, notes) =>
  (await api.put(`/prescriptions/${id}/review`, { status, notes })).data;
 
export default {
  uploadPrescription, getMyPrescriptions, getPendingPrescriptions,
  analyzePrescription, reviewPrescription,
};
