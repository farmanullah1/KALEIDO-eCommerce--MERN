import api from './axios';

export const getSellerStats = () => api.get('/seller/stats');
