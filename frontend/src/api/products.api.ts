import api from './axios';

export const getProducts = (params: any) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProductById = (id: string) => api.get(`/products/${id}`);
export const createProduct = (productData: any) => api.post('/products', productData);
export const updateProduct = (id: string, productData: any) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
export const getSellerProducts = () => api.get('/products/seller');
export const updateProductModeration = (id: string, status: string) => api.put(`/products/${id}/moderation`, { status });
export const createProductReview = (id: string, reviewData: any) => api.post(`/products/${id}/reviews`, reviewData);
