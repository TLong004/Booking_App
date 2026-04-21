import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from './store/authStore'; // Assuming this path is correct
import './MainLayout.css';

const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Lấy quyền cao nhất của người dùng để hiển thị menu phù hợp
  const role = user?.roles?.[0];

  // --- Icons cho Sidebar ---
  const ICONS = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3"width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    doctors: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
    specialties: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>,
    services: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    medicines: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  };

  const renderAdminMenu = () => (
    <>
      <p className="sidebar-menu-title">Tổng quan</p>
      <NavLink to="/admin/dashboard">{ICONS.dashboard} Dashboard</NavLink>
      
      <p className="sidebar-menu-title">Quản trị hệ thống</p>
      <NavLink to="/admin/users">{ICONS.users} Quản lý Người dùng</NavLink>
      
      <p className="sidebar-menu-title">Quản lý Danh mục</p>
      <NavLink to="/admin/doctors">{ICONS.doctors} Quản lý Bác sĩ</NavLink>
      <NavLink to="/admin/specialties">{ICONS.specialties} Quản lý Chuyên khoa</NavLink>
      <NavLink to="/admin/services">{ICONS.services} Quản lý Dịch vụ</NavLink>
      <NavLink to="/admin/medicines">{ICONS.medicines} Quản lý Thuốc</NavLink>
    </>
  );

  return (
    <div className="layout-container">
      {/* Thanh Menu Bên Trái (Sidebar) */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          <span>ClinicPlus</span>
        </div>
        <nav className="sidebar-nav">
          {role === 'ROLE_ADMIN' && renderAdminMenu()}
          {role === 'ROLE_DOCTOR' && <NavLink to="/doctor">{ICONS.doctors} Lịch khám</NavLink>}
          {role === 'ROLE_HEAD_DEPT' && <NavLink to="/head-dept">{ICONS.dashboard} Quản lý Khoa</NavLink>}
          {role === 'ROLE_STAFF' && <NavLink to="/staff">{ICONS.users} Lễ tân & Thu ngân</NavLink>}
        </nav>
      </aside>

      {/* Khu vực Nội dung chính (Main Content) */}
      <div className="main-content">
        {/* Thanh Header */}
        <header className="top-header">
          <div className="header-title">
            {/* Có thể thêm Breadcrumbs ở đây sau */}
          </div>
          <div className="user-info">
            <span>Xin chào, <strong>{user?.username || 'Người dùng'}</strong></span>
            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
          </div>
        </header>

        {/* Nơi hiển thị các trang con (Dashboard) */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;