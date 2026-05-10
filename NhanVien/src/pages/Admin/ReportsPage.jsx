import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import './AdminDashboard.css';

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const today = new Date().toISOString().slice(0, 10);
const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  .toISOString().slice(0, 10);

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate,   setEndDate]   = useState(today);
  const [applied,   setApplied]   = useState({ startDate: firstOfMonth, endDate: today });

  const { data: revenueRes, isLoading: loadRev, refetch: refetchRev } = useQuery({
    queryKey: ['admin-report-revenue', applied.startDate, applied.endDate],
    queryFn: () => adminApi.getRevenueReport(applied.startDate, applied.endDate),
  });

  const { data: apptRes, isLoading: loadAppt, refetch: refetchAppt } = useQuery({
    queryKey: ['admin-report-appointments', applied.startDate, applied.endDate],
    queryFn: () => adminApi.getAppointmentsReport(applied.startDate, applied.endDate),
  });

  const { data: topServicesRes } = useQuery({
    queryKey: ['admin-top-services'],
    queryFn: adminApi.getTopServices,
  });

  const { data: topMedsRes } = useQuery({
    queryKey: ['admin-top-medicines'],
    queryFn: adminApi.getTopMedicines,
  });

  const revenueRows = revenueRes?.data?.data ?? [];
  const apptStats   = apptRes?.data?.data ?? {};
  const topServices = topServicesRes?.data?.data ?? [];
  const topMeds     = topMedsRes?.data?.data ?? [];

  const totalRevenue = revenueRows.reduce((s, r) => s + (r.revenue ?? 0), 0);

  const handleApply = () => setApplied({ startDate, endDate });

  const maxRevenue = Math.max(...revenueRows.map(r => r.revenue ?? 0), 1);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Báo cáo & Thống kê</h1>
          <div className="page-header-meta">Dữ liệu theo khoảng thời gian</div>
        </div>
      </div>

      {/* Date range filter */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ color: '#64748b' }}>Từ</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span style={{ color: '#64748b' }}>đến</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="add-btn" style={{ padding: '7px 18px' }} onClick={handleApply}>
          Áp dụng
        </button>
      </div>

      {/* Appointment summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Tổng lịch hẹn',  value: apptStats.totalAppointments    ?? '—', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Đã hủy',          value: apptStats.cancelledAppointments ?? '—', color: '#dc2626', bg: '#fff1f2' },
          { label: 'Tỷ lệ hủy',       value: apptStats.cancelRate != null ? `${apptStats.cancelRate.toFixed(1)}%` : '—', color: '#b45309', bg: '#fffbeb' },
          { label: 'Tổng doanh thu',  value: fmt(totalRevenue),              color: '#15803d', bg: '#f0fdf4' },
        ].map(card => (
          <div key={card.label} style={{
            background: card.bg, borderRadius: 10, padding: '14px 18px',
            border: `1px solid ${card.bg === '#eff6ff' ? '#bfdbfe' : card.bg === '#fff1f2' ? '#fecdd3' : card.bg === '#fffbeb' ? '#fde68a' : '#bbf7d0'}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: card.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
        padding: '18px 20px', marginBottom: 20, boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>
          Doanh thu theo ngày
          {loadRev && <span style={{ marginLeft: 8, color: '#94a3b8', fontWeight: 400 }}>Đang tải...</span>}
        </div>
        {revenueRows.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            Không có dữ liệu trong khoảng thời gian này
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '6px 10px', color: '#64748b', fontWeight: 600, width: '18%' }}>Ngày</th>
                  <th style={{ textAlign: 'left', padding: '6px 10px', color: '#64748b', fontWeight: 600, width: '20%' }}>Doanh thu</th>
                  <th style={{ padding: '6px 10px', color: '#64748b', fontWeight: 600 }}>Biểu đồ</th>
                </tr>
              </thead>
              <tbody>
                {revenueRows.map((row, i) => {
                  const pct = Math.round(((row.revenue ?? 0) / maxRevenue) * 100);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '7px 10px', color: '#475569' }}>{row.date}</td>
                      <td style={{ padding: '7px 10px', fontWeight: 600, color: '#15803d' }}>{fmt(row.revenue)}</td>
                      <td style={{ padding: '7px 10px' }}>
                        <div style={{ background: '#f1f5f9', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, background: '#22c55e', height: '100%', borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointments by doctor + Top services/medicines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Lịch hẹn theo bác sĩ */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          padding: '18px 20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>
            Lịch hẹn theo bác sĩ
            {loadAppt && <span style={{ marginLeft: 8, color: '#94a3b8', fontWeight: 400 }}>Đang tải...</span>}
          </div>
          {!apptStats.byDoctor?.length ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Không có dữ liệu</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {apptStats.byDoctor.map((d, i) => {
                const maxCount = Math.max(...apptStats.byDoctor.map(x => x.count ?? 0), 1);
                const pct = Math.round(((d.count ?? 0) / maxCount) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: '#334155' }}>{d.doctorName}</span>
                      <span style={{ fontWeight: 600, color: '#2563eb' }}>{d.count}</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 4, height: 6 }}>
                      <div style={{ width: `${pct}%`, background: '#3b82f6', height: '100%', borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top dịch vụ + Top thuốc */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '18px 20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 10 }}>Top 5 dịch vụ</div>
            {!topServices.length ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Không có dữ liệu</p>
            ) : topServices.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
                <span style={{ color: '#475569' }}>{i + 1}. {s.serviceName}</span>
                <span style={{ fontWeight: 600, color: '#7c3aed' }}>{s.usageCount} lượt</span>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '18px 20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 10 }}>Top 5 thuốc xuất kho</div>
            {!topMeds.length ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Không có dữ liệu</p>
            ) : topMeds.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
                <span style={{ color: '#475569' }}>{i + 1}. {m.medicineName}</span>
                <span style={{ fontWeight: 600, color: '#0891b2' }}>{m.totalDispensed} đơn vị</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
