import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const fmt = (v) =>
  v == null ? '0 ₫' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

const PAYMENT_METHODS = [
  { value: 'CASH',     label: 'Tiền mặt' },
  { value: 'CARD',     label: 'Thẻ ngân hàng' },
  { value: 'TRANSFER', label: 'Chuyển khoản' },
];

const PM_MAP = Object.fromEntries(PAYMENT_METHODS.map(p => [p.value, p.label]));

const InvoiceManagementPage = () => {
  const queryClient = useQueryClient();

  const [search,       setSearch]      = useState('');
  const [filterStatus, setFilterStatus]= useState('');
  const [filterDate,   setFilterDate]  = useState('');
  const [detailId,     setDetailId]    = useState(null);

  // ── Data ──────────────────────────────────────────────────────────
  const { data: invoicesRes, isLoading, error } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: adminApi.getAllInvoices,
  });

  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ['admin-invoice-detail', detailId],
    queryFn: () => adminApi.getInvoiceById(detailId),
    enabled: !!detailId,
  });

  const invoices = invoicesRes?.data?.data ?? [];
  const detail   = detailRes?.data?.data ?? null;

  // Summary stats
  const totalPaid   = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + (i.totalAmount ?? 0), 0);
  const totalUnpaid = invoices.filter(i => i.status === 'UNPAID').length;

  // ── Client filter ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const patientName = inv.patientName?.toLowerCase() ?? '';
      const doctorName  = inv.doctorName?.toLowerCase()  ?? '';
      const matchSearch = !search ||
        patientName.includes(search.toLowerCase()) ||
        doctorName.includes(search.toLowerCase());
      const matchStatus = !filterStatus || inv.status === filterStatus;
      const matchDate   = !filterDate   ||
        (inv.appointmentDate && inv.appointmentDate === filterDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [invoices, search, filterStatus, filterDate]);

  // ── Update status mutation ────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateInvoiceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setDetailId(null);
    },
  });

  const handleMarkPaid = (id) => {
    if (window.confirm('Xác nhận đánh dấu hóa đơn này là ĐÃ THANH TOÁN?'))
      updateMutation.mutate({ id, status: 'PAID' });
  };

  const columns = [
    {
      header: 'Bệnh nhân', accessor: 'patientName', width: '18%',
      cell: r => <strong>{r.patientName ?? '—'}</strong>,
    },
    {
      header: 'Bác sĩ', accessor: 'doctorName', width: '18%',
      cell: r => <span>{r.doctorName ?? '—'}</span>,
    },
    {
      header: 'Ngày khám', accessor: 'appointmentDate', width: '12%',
      cell: r => <span>{fmtDate(r.appointmentDate)}</span>,
    },
    {
      header: 'Tổng tiền', accessor: 'totalAmount', width: '14%',
      cell: r => (
        <span style={{ fontWeight: 600, color: r.status === 'PAID' ? '#16a34a' : '#0f172a' }}>
          {fmt(r.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Thanh toán', accessor: 'paymentMethod', width: '14%',
      cell: r => (
        <span className="badge badge-gray">
          {PM_MAP[r.paymentMethod] ?? r.paymentMethod ?? '—'}
        </span>
      ),
    },
    {
      header: 'Trạng thái', accessor: 'status', width: '12%',
      cell: r => (
        <span className={`badge ${r.status === 'PAID' ? 'badge-green' : 'badge-orange'}`}>
          {r.status === 'PAID' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý hóa đơn</h1>
          <div className="page-header-meta">Tổng: {invoices.length} hóa đơn</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, padding:'14px 16px',
          boxShadow:'0 1px 3px rgba(15,23,42,0.05)' }}>
          <div style={{ fontSize:11, color:'#64748b', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
            Tổng số hóa đơn
          </div>
          <div style={{ fontSize:22, fontWeight:700, color:'#0f172a' }}>{invoices.length}</div>
        </div>
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#16a34a', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
            Tổng doanh thu (đã thanh toán)
          </div>
          <div style={{ fontSize:22, fontWeight:700, color:'#15803d' }}>{fmt(totalPaid)}</div>
        </div>
        <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ fontSize:11, color:'#b45309', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
            Chưa thanh toán
          </div>
          <div style={{ fontSize:22, fontWeight:700, color:'#b45309' }}>{totalUnpaid} hóa đơn</div>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo bệnh nhân, bác sĩ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          title="Lọc theo ngày khám"
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="UNPAID">Chưa thanh toán</option>
        </select>
        {(search || filterDate || filterStatus) && (
          <button className="secondary-btn" onClick={() => { setSearch(''); setFilterDate(''); setFilterStatus(''); }}>
            ✕ Xóa lọc
          </button>
        )}
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#64748b', fontSize: 13 }}>Đang tải...</p>}
      {error    && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={inv => (
          <>
            <button className="action-btn view-btn" onClick={() => setDetailId(inv.id)}>
              Chi tiết
            </button>
            {inv.status === 'UNPAID' && (
              <button
                className="action-btn edit-btn"
                onClick={() => handleMarkPaid(inv.id)}
                disabled={updateMutation.isPending}
              >
                ✓ Thanh toán
              </button>
            )}
          </>
        )}
      />

      {/* ── Detail modal ── */}
      <Modal
        isOpen={!!detailId}
        onClose={() => setDetailId(null)}
        title="Chi tiết hóa đơn"
      >
        <div style={{ padding: '16px 20px 20px' }}>
          {loadingDetail ? (
            <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>Đang tải...</p>
          ) : detail ? (
            <>
              <div className="detail-section">
                <div className="detail-section-title">Thông tin hóa đơn</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Bệnh nhân</span>
                    <span className="detail-value">{detail.patient?.fullName ?? '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Bác sĩ</span>
                    <span className="detail-value">{detail.doctor?.fullName ?? '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày tạo</span>
                    <span className="detail-value">{fmtDateTime(detail.invoice?.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phương thức</span>
                    <span className="detail-value">
                      {PM_MAP[detail.invoice?.paymentMethod] ?? detail.invoice?.paymentMethod ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Chi phí</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detail.invoice?.consultationFee != null && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                      <span style={{ color:'#64748b' }}>Phí khám</span>
                      <span style={{ fontWeight:500 }}>{fmt(detail.invoice.consultationFee)}</span>
                    </div>
                  )}
                  {detail.invoice?.serviceFee != null && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                      <span style={{ color:'#64748b' }}>Phí dịch vụ</span>
                      <span style={{ fontWeight:500 }}>{fmt(detail.invoice.serviceFee)}</span>
                    </div>
                  )}
                  {detail.invoice?.medicineFee != null && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                      <span style={{ color:'#64748b' }}>Phí thuốc</span>
                      <span style={{ fontWeight:500 }}>{fmt(detail.invoice.medicineFee)}</span>
                    </div>
                  )}
                  <div style={{
                    display:'flex', justifyContent:'space-between', fontSize:15,
                    fontWeight:700, color:'#0f172a', borderTop:'1px solid #e2e8f0', paddingTop:8,
                  }}>
                    <span>Tổng cộng</span>
                    <span style={{ color:'#16a34a' }}>{fmt(detail.invoice?.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span className={`badge ${detail.invoice?.status === 'PAID' ? 'badge-green' : 'badge-orange'}`} style={{ fontSize:13, padding:'5px 14px' }}>
                  {detail.invoice?.status === 'PAID' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
                </span>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-cancel" onClick={() => setDetailId(null)}>Đóng</button>
                  {detail.invoice?.status === 'UNPAID' && (
                    <button
                      className="btn-submit"
                      onClick={() => handleMarkPaid(detail.invoice.id)}
                      disabled={updateMutation.isPending}
                    >
                      ✓ Đánh dấu đã thanh toán
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p style={{ color:'#94a3b8', fontSize:13, textAlign:'center', padding:20 }}>Không tìm thấy hóa đơn</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceManagementPage;
