import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auth Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  loginByPhone: (phone: string, otp?: string) =>
    api.post('/auth/login-by-phone', { phone, otp_code: otp }),
  
  requestOTP: (phone: string) =>
    api.post('/auth/request-otp', { phone }),
};

export const childrenAPI = {
  getChildren: () => api.get('/mobile/parent/children'),
  getChildDetails: (id: number) => api.get('/mobile/parent/children/' + id),
};
