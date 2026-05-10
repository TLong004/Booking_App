import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AdminDashboard from './AdminDashboard';
import UserManagementPage from './UserManagementPage';
import DoctorManagementPage from './DoctorManagementPage';
import SpecialtyManagementPage from './SpecialtyManagementPage';
import MedicineManagementPage from './MedicineManagementPage';
import ServiceManagementPage from './ServiceManagementPage';
import AppointmentManagementPage from './AppointmentManagementPage';
import PatientManagementPage from './PatientManagementPage';
import InvoiceManagementPage from './InvoiceManagementPage';
import ReviewManagementPage from './ReviewManagementPage';
import ReportsPage from './ReportsPage';

const NAV_ITEMS = [
  {
    section: 'Tổng quan',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        id: 'reports',
        label: 'Báo cáo',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Quản trị',
    items: [
      {
        id: 'users',
        label: 'Người dùng',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
      {
        id: 'appointments',
        label: 'Lịch hẹn',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        ),
      },
      {
        id: 'patients',
        label: 'Bệnh nhân',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
      {
        id: 'invoices',
        label: 'Hóa đơn',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        ),
      },
      {
        id: 'reviews',
        label: 'Đánh giá',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Danh mục',
    items: [
      {
        id: 'doctors',
        label: 'Bác sĩ',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        ),
      },
      {
        id: 'specialties',
        label: 'Chuyên khoa',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        ),
      },
      {
        id: 'medicines',
        label: 'Kho thuốc',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        ),
      },
      {
        id: 'services',
        label: 'Dịch vụ',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        ),
      },
    ],
  },
];

const PAGE_MAP = {
  dashboard:    <AdminDashboard />,
  reports:      <ReportsPage />,
  users:        <UserManagementPage />,
  appointments: <AppointmentManagementPage />,
  patients:     <PatientManagementPage />,
  invoices:     <InvoiceManagementPage />,
  reviews:      <ReviewManagementPage />,
  doctors:      <DoctorManagementPage />,
  specialties:  <SpecialtyManagementPage />,
  medicines:    <MedicineManagementPage />,
  services:     <ServiceManagementPage />,
};

const AdminLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const user   = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 210,
        flexShrink: 0,
        background: '#fff',
        borderRight: '0.5px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 14px 13px', borderBottom: '0.5px solid #e5e7eb' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>MedAdmin</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Phòng khám đa khoa</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 7px', flex: 1, overflowY: 'auto' }}>
          {NAV_ITEMS.map(group => (
            <div key={group.section}>
              <div style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#9ca3af',
                letterSpacing: '.7px',
                textTransform: 'uppercase',
                padding: '7px 7px 3px',
              }}>
                {group.section}
              </div>
              {group.items.map(item => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '7px 8px',
                      border: 'none',
                      background: isActive ? '#eff6ff' : 'transparent',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 12,
                      color: isActive ? '#1d4ed8' : '#4b5563',
                      fontWeight: isActive ? 500 : 400,
                      textAlign: 'left',
                      marginBottom: 1,
                      transition: 'all .12s',
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.55, flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 48, flexShrink: 0, background: '#fff',
          borderBottom: '0.5px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 20px', gap: 12,
        }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Xin chào, <strong style={{ color: '#111827' }}>{user?.username || 'Admin'}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 6,
              border: '0.5px solid #e5e7eb', background: '#fff',
              cursor: 'pointer', color: '#4b5563',
            }}
          >
            Đăng xuất
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', background: '#f9fafb' }}>
          <React.Fragment key={activePage}>
            {PAGE_MAP[activePage]}
          </React.Fragment>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
