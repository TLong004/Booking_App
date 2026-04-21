import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // <-- THAY BẰNG URL BACKEND CỦA BẠN
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header của mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;