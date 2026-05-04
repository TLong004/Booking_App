import React from 'react';
import './AdminDashboard.css';

const RECENT_APPOINTMENTS = [
  { patient: 'Nguyễn Văn A',  doctor: 'TS.BS. Trần Minh',    service: 'Khám tổng quát', time: '08:00', status: 'Hoàn thành' },
  { patient: 'Lê Thị B',      doctor: 'BS. Phạm Thu',         service: 'Siêu âm bụng',   time: '09:15', status: 'Hoàn thành' },
  { patient: 'Phạm Văn C',    doctor: 'ThS.BS. Hoàng Nam',    service: 'Xét nghiệm máu', time: '10:30', status: 'Đang khám'  },
  { patient: 'Hoàng Thị D',   doctor: 'TS.BS. Trần Minh',    service: 'Khám tim mạch',  time: '11:00', status: 'Chờ khám'   },
  { patient: 'Vũ Quốc E',     doctor: 'BS. Nguyễn Lan',       service: 'Khám da liễu',   time: '13:30', status: 'Chờ khám'   },
];

const STATUS_BADGE = {
  'Hoàn thành': 'badge badge-green',
  'Đang khám':  'badge badge-blue',
  'Chờ khám':   'badge badge-orange',
};

const StatCard = ({ title, value, delta, deltaPositive, iconBg, icon }) => (
  <div style={{
    background: '#fff',
    border: '0.5px solid #e5e7eb',
    borderRadius: 12,
    padding: 14,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 8,
      background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 19, fontWeight: 500, color: '#111827' }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, marginTop: 1, color: deltaPositive ? '#16a34a' : '#dc2626' }}>
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

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Dashboard tổng quan</h1>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{today}</span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 14 }}>
        <StatCard
          title="Doanh thu hôm nay" value="15,6M ₫"
          delta="12% so với hôm qua" deltaPositive
          iconBg="#dbeafe"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          title="Bệnh nhân mới" value="24"
          delta="4 so với hôm qua" deltaPositive
          iconBg="#dcfce7"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
        <StatCard
          title="Lịch hẹn hôm nay" value="68"
          delta="3 so với hôm qua" deltaPositive={false}
          iconBg="#fef3c7"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          title="Bác sĩ hoạt động" value="12"
          delta="/ 15 tổng số" deltaPositive
          iconBg="#f3e8ff"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
        />
      </div>

      {/* Recent appointments */}
      <div className="table-wrap">
        <div style={{
          padding: '11px 14px',
          borderBottom: '0.5px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Lịch hẹn gần đây</span>
          <span style={{
            fontSize: 11, background: '#f9fafb',
            border: '0.5px solid #e5e7eb', color: '#6b7280',
            padding: '3px 9px', borderRadius: 9999,
          }}>Hôm nay</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Bệnh nhân</th>
              <th style={{ width: '22%' }}>Bác sĩ</th>
              <th style={{ width: '22%' }}>Dịch vụ</th>
              <th style={{ width: '12%' }}>Giờ</th>
              <th style={{ width: '22%' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_APPOINTMENTS.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.patient}</strong></td>
                <td>{row.doctor}</td>
                <td>{row.service}</td>
                <td>{row.time}</td>
                <td><span className={STATUS_BADGE[row.status] || 'badge badge-gray'}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
