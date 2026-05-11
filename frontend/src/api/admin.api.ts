import api from './axios';

export const getAdminStats = () => api.get('/admin/stats');
export const getUsers = () => api.get('/admin/users');
export const updateUserRole = (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role });
