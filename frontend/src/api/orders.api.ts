import api from './axios';

export const createOrder = (orderData: any) => api.post('/orders', orderData);
export const getMyOrders = () => api.get('/orders/mine');
export const getOrderById = (id: string) => api.get(`/orders/${id}`);
export const getSellerOrders = () => api.get('/seller/orders');
export const updateSellerOrderStatus = (id: string, status: string) => api.put(`/seller/orders/${id}/status`, { status });
