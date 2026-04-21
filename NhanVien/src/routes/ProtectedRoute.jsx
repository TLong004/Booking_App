import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * @param {Array} allowedRoles - Mảng chứa các role được phép truy cập (VD: ['ROLE_ADMIN', 'ROLE_DOCTOR'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Lấy trực tiếp state từ store, component sẽ tự render lại khi state thay đổi
  const token = useAuthStore((state) => state.token);
  const userRoles = useAuthStore((state) => state.user?.roles || []);
  const isAuthenticated = !!token;

  // 1. Nếu chưa đăng nhập -> Đẩy về trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu có truyền allowedRoles, kiểm tra xem user có quyền không
  const isAuthorized = allowedRoles 
    ? userRoles.some((role) => allowedRoles.includes(role))
    : true;

  if (!isAuthorized) {
    // Đã đăng nhập nhưng không đủ quyền -> Đẩy về trang lỗi/không có quyền truy cập
    return <Navigate to="/unauthorized" replace />;
  }

  // Mọi thứ hợp lệ -> Hiển thị component con
  return <Outlet />;
};

export default ProtectedRoute;