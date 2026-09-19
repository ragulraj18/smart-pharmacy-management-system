import api from './api';
 
const placeOrder = async (payload) => (await api.post('/orders', payload)).data;
const getMyOrders = async () => (await api.get('/orders')).data;
const getOrderById = async (id) => (await api.get(`/orders/${id}`)).data;
const updateOrderStatus = async (id, orderStatus) => (await api.put(`/orders/${id}/status`, { orderStatus })).data;
 
export default { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
