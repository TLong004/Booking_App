import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import DoctorManagementPage from './DoctorManagementPage';
import UserManagementPage from './UserManagementPage';
import MedicineManagementPage from './MedicineManagementPage';
import ServiceManagementPage from './ServiceManagementPage';
import SpecialtyManagementPage from './SpecialtyManagementPage';

const NAV_ITEMS = [
  {
    section: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    ]
  },
  {
    section: 'Quản lý',
    items: [
      { id: 'doctors',     label: 'Bác sĩ',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
      { id: 'users',       label: 'Người dùng',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { id: 'medicines',   label: 'Kho thuốc',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
      { id: 'services',    label: 'Dịch vụ',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
      { id: 'specialties', label: 'Chuyên khoa', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
    ]
  }
];

const PAGE_MAP = {
  dashboard:   <AdminDashboard />,
  doctors:     <DoctorManagementPage />,
  users:       <UserManagementPage />,
  medicines:   <MedicineManagementPage />,
  services:    <ServiceManagementPage />,
  specialties: <SpecialtyManagementPage />,
};

const AdminLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: '#ffffff',
        borderRight: '0.5px solid #e5e7eb',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '0.5px solid #e5e7eb' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>MedAdmin</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Phòng khám đa khoa</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {NAV_ITEMS.map(group => (
            <div key={group.section}>
              <div style={{
                fontSize: 10, fontWeight: 500, color: '#9ca3af',
                letterSpacing: '.8px', textTransform: 'uppercase',
                padding: '8px 8px 4px'
              }}>{group.section}</div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 8px', borderRadius: 8,
                    cursor: 'pointer', fontSize: 13,
                    color: activePage === item.id ? '#1d4ed8' : '#4b5563',
                    background: activePage === item.id ? '#eff6ff' : 'transparent',
                    fontWeight: activePage === item.id ? 500 : 400,
                    border: 'none', width: '100%', textAlign: 'left',
                    marginBottom: 1, transition: 'all .15s',
                    opacity: activePage === item.id ? 1 : 0.85,
                  }}
                >
                  <span style={{ opacity: activePage === item.id ? 1 : 0.6 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1, overflow: 'auto',
        padding: 24,
        background: '#f9fafb'
      }}>
        {PAGE_MAP[activePage]}
      </main>
    </div>
  );
};

export default AdminLayout;
