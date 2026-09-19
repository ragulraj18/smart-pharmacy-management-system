import api from './api';

const getCart = async () => (await api.get('/cart')).data;
const addToCart = async (medicineId, quantity = 1) => (await api.post('/cart', { medicineId, quantity })).data;
const updateCartItem = async (medicineId, quantity) => (await api.put(`/cart/${medicineId}`, { quantity })).data;
const removeFromCart = async (medicineId) => (await api.delete(`/cart/${medicineId}`)).data;
const clearCart = async () => (await api.delete('/cart')).data;

export default { getCart, addToCart, updateCartItem, removeFromCart, clearCart };