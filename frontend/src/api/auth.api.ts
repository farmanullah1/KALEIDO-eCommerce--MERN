import api from './axios';

export const login = (credentials: any) => api.post('/auth/login', credentials);
export const signup = (userData: any) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const upgradeToSeller = () => api.post('/auth/upgrade');
