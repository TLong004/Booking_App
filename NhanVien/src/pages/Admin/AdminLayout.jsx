import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import UserManagementPage from './UserManagementPage';
import DoctorManagementPage from './DoctorManagementPage';
import SpecialtyManagementPage from './SpecialtyManagementPage';
import MedicineManagementPage from './MedicineManagementPage';
import ServiceManagementPage from './ServiceManagementPage';

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
    ],
  },
  {
    section: 'Quản lý',
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
  dashboard:   <AdminDashboard />,
  users:       <UserManagementPage />,
  doctors:     <DoctorManagementPage />,
  specialties: <SpecialtyManagementPage />,
  medicines:   <MedicineManagementPage />,
  services:    <ServiceManagementPage />,
};

const AdminLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');

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
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px 22px',
        background: '#f9fafb',
      }}>
        {/* Re-mount on page change so each page resets its own state */}
        <React.Fragment key={activePage}>
          {PAGE_MAP[activePage]}
        </React.Fragment>
      </main>
    </div>
  );
};

export default AdminLayout;
