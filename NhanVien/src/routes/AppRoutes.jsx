import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Import các trang thật
import LoginPage from '../pages/LoginPage';
import MainLayout from '../MainLayout';

// Import các trang của Admin
import StaffDashboard from '../pages/staff/StaffDashboard'; // Trang Lễ tân & Thu ngân
import AdminDashboard from '../pages/admin/AdminDashboard'; // Trang thống kê
import DoctorManagementPage from '../pages/admin/DoctorManagementPage'; // Trang quản lý bác sĩ
import UserManagementPage from '../pages/admin/UserManagementPage'; // Trang quản lý người dùng
import SpecialtyManagementPage from '../pages/admin/SpecialtyManagementPage'; // Trang quản lý chuyên khoa
import ServiceManagementPage from '../pages/admin/ServiceManagementPage'; // Trang quản lý dịch vụ
import MedicineManagementPage from '../pages/admin/MedicineManagementPage'; // Trang quản lý thuốc
import DoctorDashboard from '../pages/doctor/DoctorDashboard'; // Trang Bác sĩ
import HeadDeptDashboard from '../pages/headdept/HeadDeptDashboard'; // Trang Trưởng khoa

const UnauthorizedPage = () => <div><h1>403 - Bạn không có quyền truy cập trang này</h1></div>;

// Định nghĩa các Quyền (Roles) khớp chuẩn với Database của bạn
const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  HEAD_DEPT: 'ROLE_HEAD_DEPT',
  DOCTOR: 'ROLE_DOCTOR',
  STAFF: 'ROLE_STAFF',
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - Ai cũng có thể truy cập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* CÁC TRANG CÓ CHUNG LAYOUT (Sidebar + Header) */}
        <Route element={<MainLayout />}>
          {/* PROTECTED ROUTES - Dành cho Lễ Tân */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.STAFF]} />}>
            <Route path="/staff/*" element={<StaffDashboard />} />
          </Route>

          {/* PROTECTED ROUTES - Dành cho Bác Sĩ & Trưởng Khoa */}
          {/* Trưởng khoa cũng là bác sĩ nên được phép truy cập trang khám bệnh */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.HEAD_DEPT]} />}>
            <Route path="/doctor/*" element={<DoctorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]} />}>
            <Route path="/head-dept/*" element={<HeadDeptDashboard />} />
          </Route>

          {/* PROTECTED ROUTES - Dành cho Admin */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/doctors" element={<DoctorManagementPage />} />
            <Route path="/admin/specialties" element={<SpecialtyManagementPage />} />
            <Route path="/admin/services" element={<ServiceManagementPage />} />
            <Route path="/admin/medicines" element={<MedicineManagementPage />} />
            {/* Redirect từ /admin về /admin/dashboard */}
            <Route path="/admin" index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Nếu gõ sai đường dẫn, tự động văng về trang login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;