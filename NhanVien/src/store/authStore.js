import { create } from 'zustand';

// Quản lý trạng thái người dùng đăng nhập
export const useAuthStore = create((set, get) => ({
  user: null, // Lưu thông tin user: { id, username, roles: ['ROLE_DOCTOR'] }
  token: null, // Lưu JWT token

  // Hàm gọi khi đăng nhập thành công
  login: (userData, token) => set({ user: userData, token }),

  // Hàm gọi khi đăng xuất
  logout: () => set({ user: null, token: null }),
}));