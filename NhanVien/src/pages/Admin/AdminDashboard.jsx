import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import './AdminDashboard.css';

const fmtCurrency = (v) =>
  v == null
    ? '0 ₫'
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const STATUS_LABEL = {
  COMPLETED:   'Hoàn thành',
  IN_PROGRESS: 'Đang khám',
  PENDING:     'Chờ khám',
  CANCELLED:   'Đã hủy',
  NO_SHOW:     'Vắng mặt',
};

const STATUS_BADGE = {
  COMPLETED:   'badge badge-green',
  IN_PROGRESS: 'badge badge-blue',
  PENDING:     'badge badge-orange',
  CANCELLED:   'badge badge-red',
  NO_SHOW:     'badge badge-gray',
};

const StatCard = ({ title, value, delta, deltaPositive, iconBg, icon, accent = '#2563eb' }) => (
  <div className="stat-card" style={{ '--sc-accent': accent }}>
    <div className="stat-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="stat-body">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      {delta != null && (
        <div className={`stat-delta ${deltaPositive ? 'up' : 'down'}`}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const { data: statsRes, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminApi.getDashboardStats,
  });
  const { data: appointmentsRes, isLoading: loadingAppts } = useQuery({
    queryKey: ['admin-recent-appointments'],
    queryFn: adminApi.getRecentAppointments,
  });

  const stats        = statsRes?.data?.data ?? {};
  const appointments = appointmentsRes?.data?.data ?? [];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Tổng quan hệ thống</h1>
          <div className="page-header-meta">{today}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard
          title="Doanh thu hôm nay"
          accent="#2563eb"
          value={loadingStats ? '...' : fmtCurrency(stats.todayRevenue ?? 0)}
          delta={stats.todayRevenueChange != null
            ? `${Math.abs(stats.todayRevenueChange)}% so với hôm qua`
            : null}
          deltaPositive={(stats.todayRevenueChange ?? 0) >= 0}
          iconBg="#dbeafe"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          title="Bệnh nhân mới"
          accent="#10b981"
          value={loadingStats ? '...' : (stats.newPatients ?? 0)}
          delta={stats.newPatientsChange != null
            ? `${stats.newPatientsChange > 0 ? '+' : ''}${stats.newPatientsChange} so với hôm qua`
            : null}
          deltaPositive={(stats.newPatientsChange ?? 0) >= 0}
          iconBg="#dcfce7"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
        <StatCard
          title="Lịch hẹn hôm nay"
          accent="#f59e0b"
          value={loadingStats ? '...' : (stats.todayAppointments ?? 0)}
          delta={stats.todayAppointmentsChange != null
            ? `${Math.abs(stats.todayAppointmentsChange)} so với hôm qua`
            : null}
          deltaPositive={(stats.todayAppointmentsChange ?? 0) >= 0}
          iconBg="#fef3c7"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          title="Bác sĩ hoạt động"
          accent="#8b5cf6"
          value={loadingStats ? '...' : (stats.activeDoctors ?? 0)}
          delta={stats.totalDoctors != null ? `/ ${stats.totalDoctors} tổng số` : null}
          deltaPositive
          iconBg="#f3e8ff"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
        />
      </div>

      {/* Recent appointments */}
      <div className="table-wrap">
        <div style={{
          padding: '13px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.1px' }}>
            Lịch hẹn gần đây
          </span>
          <span style={{
            fontSize: 11.5, fontWeight: 500,
            background: '#f1f5f9', color: '#64748b',
            padding: '4px 12px', borderRadius: 20,
          }}>Hôm nay</span>
        </div>

        {loadingAppts ? (
          <div style={{ padding: '24px 16px', display: 'flex', gap: 10, flexDirection: 'column' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 20, borderRadius: 6 }} />)}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Bệnh nhân</th>
                <th style={{ width: '22%' }}>Bác sĩ</th>
                <th style={{ width: '26%' }}>Triệu chứng</th>
                <th style={{ width: '10%' }}>Số TT</th>
                <th style={{ width: '18%' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-cell">
                      <div className="empty-cell-icon">📋</div>
                      Không có lịch hẹn nào hôm nay
                    </div>
                  </td>
                </tr>
              ) : appointments.map((row) => {
                const status = row.status ?? '';
                return (
                  <tr key={row.id}>
                    <td><strong>{row.patient?.fullName ?? '—'}</strong></td>
                    <td style={{ color: '#475569' }}>{row.doctor?.fullName ?? '—'}</td>
                    <td className="text-muted" style={{ fontSize: 12.5 }}>
                      {row.symptoms ? (row.symptoms.length > 35 ? row.symptoms.slice(0, 35) + '…' : row.symptoms) : '—'}
                    </td>
                    <td style={{ fontWeight: 600 }}>{row.queueNumber ?? '—'}</td>
                    <td>
                      <span className={STATUS_BADGE[status] || 'badge badge-gray'}>
                        {STATUS_LABEL[status] || status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
