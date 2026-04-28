import React from 'react';

const StatCard = ({ title, value, delta, deltaPositive, iconColor, iconBg, icon }) => (
  <div style={{
    background: 'var(--color-background-primary, #fff)',
    border: '0.5px solid var(--color-border-tertiary, #e5e7eb)',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: iconBg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 500, color: '#111827' }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, marginTop: 3, color: deltaPositive ? '#16a34a' : '#dc2626' }}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  </div>
);

const ICONS = {
  revenue: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  patients: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  appointments: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  doctors: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
};

const BADGE_STYLES = {
  'Hoàn thành': { background: '#dcfce7', color: '#166534' },
  'Đang khám':  { background: '#dbeafe', color: '#1e40af' },
  'Chờ khám':   { background: '#fef3c7', color: '#92400e' },
};

const Badge = ({ label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 9999,
    fontSize: 11, fontWeight: 500,
    ...(BADGE_STYLES[label] || { background: '#f3f4f6', color: '#374151' })
  }}>{label}</span>
);

const recentAppointments = [
  { patient: 'Nguyễn Văn A', doctor: 'TS.BS. Trần Minh', service: 'Khám tổng quát', time: '08:00', status: 'Hoàn thành' },
  { patient: 'Lê Thị B',     doctor: 'BS. Phạm Thu',     service: 'Siêu âm bụng',   time: '09:15', status: 'Hoàn thành' },
  { patient: 'Phạm Văn C',   doctor: 'ThS.BS. Hoàng Nam',service: 'Xét nghiệm máu', time: '10:30', status: 'Đang khám'  },
  { patient: 'Hoàng Thị D',  doctor: 'TS.BS. Trần Minh', service: 'Khám tim mạch',  time: '11:00', status: 'Chờ khám'   },
  { patient: 'Vũ Quốc E',    doctor: 'BS. Nguyễn Lan',   service: 'Khám da liễu',   time: '13:30', status: 'Chờ khám'   },
];

const AdminDashboard = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Dashboard tổng quan</h1>
      <span style={{ fontSize: 12, color: '#6b7280' }}>Thứ 5, 23 tháng 4, 2026</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
      <StatCard title="Doanh thu hôm nay" value="15,6M ₫" delta="12% vs hôm qua" deltaPositive iconBg="#dbeafe" icon={ICONS.revenue} />
      <StatCard title="Bệnh nhân mới"      value="24"      delta="4 so với hôm qua"  deltaPositive iconBg="#dcfce7" icon={ICONS.patients} />
      <StatCard title="Lịch hẹn hoàn thành" value="68"    delta="3 so với hôm qua"  deltaPositive={false} iconBg="#fef3c7" icon={ICONS.appointments} />
      <StatCard title="Bác sĩ hoạt động"  value="12"      delta="/ 15 tổng số" deltaPositive iconBg="#f3e8ff" icon={ICONS.doctors} />
    </div>

    <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #e5e7eb', fontWeight: 500, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Lịch hẹn gần đây
        <span style={{ fontSize: 11, background: '#f3f4f6', border: '0.5px solid #e5e7eb', color: '#6b7280', padding: '4px 10px', borderRadius: 9999 }}>Hôm nay</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {['Bệnh nhân','Bác sĩ','Dịch vụ','Giờ','Trạng thái'].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: '0.5px solid #e5e7eb' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentAppointments.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < recentAppointments.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
              <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500 }}>{row.patient}</td>
              <td style={{ padding: '11px 16px', fontSize: 13 }}>{row.doctor}</td>
              <td style={{ padding: '11px 16px', fontSize: 13 }}>{row.service}</td>
              <td style={{ padding: '11px 16px', fontSize: 13 }}>{row.time}</td>
              <td style={{ padding: '11px 16px' }}><Badge label={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
