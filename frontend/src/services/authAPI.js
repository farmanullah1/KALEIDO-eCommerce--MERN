import axios from 'axios';
import { getSessionToken } from './tokenStorage';

const API_BASE_URL = 'http://localhost:5001/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupInitiate = (email, password) => api.post('/signup/initiate', { email, password });
export const signupVerify = (email, verificationCode) => api.post('/signup/verify', { email, verificationCode });
export const login = (email, password) => api.post('/login', { email, password });
export const logout = () => api.post('/logout');
export const forgotPassword = (email) => api.post('/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/reset-password', { token, newPassword });
export const getMe = () => api.get('/me');
export const updatePreferences = (preferences) => api.put('/me/preferences', preferences);
export const deleteAccount = (confirmation) => api.delete('/me', { headers: { 'X-Confirm': confirmation } });

export default api;
