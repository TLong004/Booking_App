import React from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import './MainLayout.css';

const IC = {
  dashboard:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  doctors:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  specialties:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  services:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  medicines:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/><circle cx="18" cy="18" r="4"/><path d="M18 16v4M16 18h4"/></svg>,
  appointments: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/></svg>,
  patients:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  invoices:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  reviews:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  reports:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  schedule:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dept:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  reception:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  logout:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const PAGE_TITLES = {
  '/admin/dashboard':   'Dashboard',
  '/admin/users':       'Quản lý người dùng',
  '/admin/doctors':     'Quản lý bác sĩ',
  '/admin/specialties': 'Chuyên khoa',
  '/admin/services':    'Dịch vụ',
  '/admin/medicines':   'Kho thuốc',
  '/admin/appointments':'Lịch hẹn',
  '/admin/patients':    'Bệnh nhân',
  '/admin/invoices':    'Hóa đơn',
  '/admin/reviews':     'Đánh giá',
  '/admin/reports':     'Báo cáo & Thống kê',
  '/doctor':            'Khám bệnh',
  '/doctor/schedule':   'Lịch trực',
  '/head-dept':         'Tổng quan Khoa',
  '/staff':             'Tiếp nhận & Thu ngân',
};

const ROLE_LABELS = {
  ROLE_ADMIN:    'Quản trị viên',
  ROLE_DOCTOR:   'Bác sĩ',
  ROLE_HEAD_DEPT:'Trưởng khoa',
  ROLE_STAFF:    'Lễ tân',
};

const AdminMenu = () => (
  <>
    <p className="sidebar-menu-title">Tổng quan</p>
    <NavLink to="/admin/dashboard">{IC.dashboard} Dashboard</NavLink>
    <NavLink to="/admin/reports">{IC.reports} Báo cáo</NavLink>

    <p className="sidebar-menu-title">Quản trị</p>
    <NavLink to="/admin/users">{IC.users} Người dùng</NavLink>
    <NavLink to="/admin/appointments">{IC.appointments} Lịch hẹn</NavLink>
    <NavLink to="/admin/patients">{IC.patients} Bệnh nhân</NavLink>
    <NavLink to="/admin/invoices">{IC.invoices} Hóa đơn</NavLink>
    <NavLink to="/admin/reviews">{IC.reviews} Đánh giá</NavLink>

    <p className="sidebar-menu-title">Danh mục</p>
    <NavLink to="/admin/doctors">{IC.doctors} Bác sĩ</NavLink>
    <NavLink to="/admin/specialties">{IC.specialties} Chuyên khoa</NavLink>
    <NavLink to="/admin/services">{IC.services} Dịch vụ</NavLink>
    <NavLink to="/admin/medicines">{IC.medicines} Kho thuốc</NavLink>
  </>
);

const MainLayout = () => {
  const user     = useAuthStore((state) => state.user);
  const logout   = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const role     = user?.roles?.[0];
  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'ClinicPlus';

  return (
    <div className="layout-container">
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-name">ClinicPlus</div>
            <div className="sidebar-logo-sub">Quản lý phòng khám</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {role === 'ROLE_ADMIN' && <AdminMenu />}

          {(role === 'ROLE_DOCTOR' || role === 'ROLE_HEAD_DEPT') && (
            <>
              {role === 'ROLE_HEAD_DEPT' && <p className="sidebar-menu-title">Khám bệnh</p>}
              <NavLink to="/doctor" end>{IC.doctors} Khám bệnh</NavLink>
              <NavLink to="/doctor/schedule">{IC.schedule} Lịch trực</NavLink>
            </>
          )}

          {role === 'ROLE_HEAD_DEPT' && (
            <>
              <p className="sidebar-menu-title">Quản lý Khoa</p>
              <NavLink to="/head-dept">{IC.dept} Tổng quan Khoa</NavLink>
            </>
          )}

          {role === 'ROLE_STAFF' && (
            <>
              <p className="sidebar-menu-title">Lễ tân</p>
              <NavLink to="/staff">{IC.reception} Tiếp nhận &amp; Thu ngân</NavLink>
            </>
          )}
        </nav>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <span className="header-breadcrumb">ClinicPlus</span>
            <span className="header-sep">/</span>
            <span className="header-page-title">{pageTitle}</span>
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user?.username || 'Người dùng'}</span>
              <span className="user-role-badge">{ROLE_LABELS[role] || role}</span>
            </div>
            <div className="user-avatar">{initials}</div>
            <button className="logout-btn" onClick={handleLogout}>
              {IC.logout} Đăng xuất
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
