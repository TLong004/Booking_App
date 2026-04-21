import React from 'react';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const ICONS = {
    revenue: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    patients: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    appointments: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    doctors: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Tổng quan</h1>
      </header>
      <div className="stats-grid">
        <StatCard title="Doanh thu (hôm nay)" value="15,600,000đ" icon={ICONS.revenue} color="#3b82f6" />
        <StatCard title="Bệnh nhân mới" value="24" icon={ICONS.patients} color="#10b981" />
        <StatCard title="Lịch hẹn đã hoàn thành" value="68" icon={ICONS.appointments} color="#f97316" />
        <StatCard title="Bác sĩ đang hoạt động" value="12" icon={ICONS.doctors} color="#8b5cf6" />
      </div>
    </div>
  );
};

export default AdminDashboard;