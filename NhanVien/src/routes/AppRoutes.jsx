import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Import Layout và Auth (giữ tải đồng bộ vì dùng ngay lúc đầu)
import LoginPage from '../pages/LoginPage';
import MainLayout from '../MainLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import NotFoundPage from '../pages/NotFoundPage';

const UnauthorizedPage = () => <div><h1>403 - Bạn không có quyền truy cập trang này</h1></div>;

// Component Loading hiển thị trong lúc chờ tải Chunk code
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh', color: '#64748b' }}>
    Đang tải trang...
  </div>
);

// HOC Loadable: Bọc ErrorBoundary và Suspense cho TỪNG Component
const Loadable = (Component) => (props) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

// Lazy load các trang chức năng (Code Splitting)
const StaffDashboard = Loadable(React.lazy(() => import('../pages/staff/StaffDashboard')));
const AdminDashboard = Loadable(React.lazy(() => import('../pages/admin/AdminDashboard')));
const DoctorManagementPage = Loadable(React.lazy(() => import('../pages/admin/DoctorManagementPage')));
const UserManagementPage = Loadable(React.lazy(() => import('../pages/admin/UserManagementPage')));
const SpecialtyManagementPage = Loadable(React.lazy(() => import('../pages/admin/SpecialtyManagementPage')));
const ServiceManagementPage = Loadable(React.lazy(() => import('../pages/admin/ServiceManagementPage')));
const MedicineManagementPage = Loadable(React.lazy(() => import('../pages/admin/MedicineManagementPage')));
const DoctorDashboard = Loadable(React.lazy(() => import('../pages/doctor/DoctorDashboard')));
const DoctorSchedule = Loadable(React.lazy(() => import('../pages/doctor/DoctorSchedule')));
const HeadDeptDashboard = Loadable(React.lazy(() => import('../pages/headdept/HeadDeptDashboard')));

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

        {/* Route mặc định, chuyển hướng đến trang login khi truy cập vào trang gốc */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* CÁC TRANG CÓ CHUNG LAYOUT (Sidebar + Header) */}
        <Route element={<MainLayout />}>
          {/* PROTECTED ROUTES - Dành cho Lễ Tân */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.STAFF]} />}>
            <Route path="/staff/*" element={<StaffDashboard />} />
          </Route>

          {/* PROTECTED ROUTES - Dành cho Bác Sĩ & Trưởng Khoa */}
          {/* Trưởng khoa cũng là bác sĩ nên được phép truy cập trang khám bệnh */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.HEAD_DEPT]} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
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
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* 404 NOT FOUND: Nếu người dùng gõ sai URL NHƯNG đang đăng nhập -> Hiển thị 404 TRONG MainLayout */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 404 NOT FOUND: Bắt các trường hợp lỗi URL ngoài vùng Layout (VD gõ bừa ở màn hình login) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;