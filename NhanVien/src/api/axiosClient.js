import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Trỏ đúng về Backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mọi Request gửi lên BE
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ trạng thái hiện tại của Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;