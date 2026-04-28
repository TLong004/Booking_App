import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
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

// Interceptor để xử lý lỗi trả về (đặc biệt là 401 Hết hạn Token)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gọi hàm logout từ store để xóa token
      const logout = useAuthStore.getState().logout;
      if (logout) logout();
      
      // Điều hướng người dùng về trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;