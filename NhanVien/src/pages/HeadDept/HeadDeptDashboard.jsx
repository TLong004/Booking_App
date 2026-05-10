import React from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import OverviewTab from './OverviewTab';
import ScheduleTab from './ScheduleTab';
import AnalyticsTab from './AnalyticsTab';
import { DOCS, now } from './headDeptData';
import './HeadDeptDashboard.css';

const DAYS = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];

const TABS = [
  { path: 'overview',  label: 'Tổng quan' },
  { path: 'schedule',  label: 'Lịch trực' },
  { path: 'analytics', label: 'Thống kê'  },
];

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function HeadDeptDashboard() {
  // Dùng useLocation để component biết khi nào URL thay đổi
  const location = useLocation();

  return (
    <div className="hd-container">
      {/* Header */}
      <div className="hd-header">
        <div>
          <div className="hd-role-badge">Trưởng Khoa</div>
          <h1 className="hd-title">Khoa Đa Khoa</h1>
          <div className="hd-subtitle">{DAYS[now.getDay()]}, {now.toLocaleDateString('vi-VN')}</div>
        </div>
        <div className="hd-avatars">
          {DOCS.map(d => <div key={d.id} title={d.name} className="hd-avatar" style={{ width: 30, height: 30, background: d.bg, color: d.color, fontSize: 10 }}>{d.init}</div>)}
        </div>
      </div>

      {/* Tabs */}
      <div className="hd-tabs-wrap">
        {TABS.map(t => (
          <NavLink 
            key={t.path} 
            to={t.path} 
            className={({ isActive }) => `hd-tab-btn ${isActive ? 'active' : ''}`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* Panels */}
      <Routes>
        <Route path="overview" element={<OverviewTab />} />
        <Route path="schedule" element={<ScheduleTab />} />
        <Route path="analytics" element={<AnalyticsTab />} />
        {/* Redirect mặc định vào tab tổng quan nếu gõ sai hoặc mới vào /head-dept */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  );
}