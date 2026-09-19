import api from './api';
 
const sendChatMessage = async (message) => (await api.post('/ai/chat', { message })).data;
 
export default { sendChatMessage };
