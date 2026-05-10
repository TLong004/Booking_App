import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const STATUS_OPTIONS = [
  { value: 'PENDING',     label: 'Chờ khám',   badge: 'badge badge-orange' },
  { value: 'IN_PROGRESS', label: 'Đang khám',  badge: 'badge badge-blue'   },
  { value: 'COMPLETED',   label: 'Hoàn thành', badge: 'badge badge-green'  },
  { value: 'CANCELLED',   label: 'Đã hủy',     badge: 'badge badge-red'    },
  { value: 'NO_SHOW',     label: 'Vắng mặt',   badge: 'badge badge-gray'   },
];

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]));

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtTime = (t) => t ? t.slice(0, 5) : '—'; // "08:30:00" → "08:30"
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('vi-VN') : null;

// Kiểm tra lịch hẹn có phải hôm nay và đã quá giờ không (dùng để highlight cần xử lý)
const isOverdue = (appt) => {
  const today = new Date().toISOString().slice(0, 10);
  const apptDate = appt.appointmentDate;
  if (!apptDate) return false;
  const apptDateStr = typeof apptDate === 'string' ? apptDate : new Date(apptDate).toISOString().slice(0, 10);
  if (apptDateStr > today) return false; // tương lai → chưa tới
  if (apptDateStr < today) return true;  // quá khứ còn PENDING → cần xử lý
  // Hôm nay: nếu có scheduledEndTime và đã qua → overdue
  if (appt.scheduledEndTime) {
    const [h, m] = appt.scheduledEndTime.split(':').map(Number);
    const endMs = new Date();
    endMs.setHours(h, m, 0, 0);
    return Date.now() > endMs.getTime();
  }
  return false;
};

const AppointmentManagementPage = () => {
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState('');
  const [filterDate,   setFilterDate]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDoc,    setFilterDoc]    = useState('');

  const [detailAppt,   setDetailAppt]   = useState(null);
  const [statusModal,  setStatusModal]  = useState(null); // { id, currentStatus }
  const [newStatus,    setNewStatus]    = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [noShowReason, setNoShowReason] = useState('');

  // ── Data ──────────────────────────────────────────────────────────
  const { data: apptRes, isLoading, error } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: adminApi.getAllAppointments,
  });
  const { data: doctorsRes } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: adminApi.getAllDoctors,
  });

  const appointments = apptRes?.data?.data ?? [];
  const doctors      = doctorsRes?.data?.data ?? [];

  // Đếm lịch hẹn cần xử lý (hôm nay/quá khứ, còn PENDING, chưa check-in)
  const needActionCount = useMemo(() =>
    appointments.filter(a => a.status === 'PENDING' && isOverdue(a) && !a.checkedInAt).length
  , [appointments]);

  // ── Client filter ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const patientName = a.patient?.fullName?.toLowerCase() ?? '';
      const doctorName  = a.doctor?.fullName?.toLowerCase()  ?? '';
      const matchSearch = !search ||
        patientName.includes(search.toLowerCase()) ||
        doctorName.includes(search.toLowerCase());
      const apptDateStr = a.appointmentDate
        ? (typeof a.appointmentDate === 'string' ? a.appointmentDate : new Date(a.appointmentDate).toISOString().slice(0, 10))
        : '';
      const matchDate   = !filterDate   || apptDateStr === filterDate;
      const matchStatus = !filterStatus || a.status === filterStatus;
      const matchDoc    = !filterDoc    || String(a.doctor?.id) === filterDoc;
      return matchSearch && matchDate && matchStatus && matchDoc;
    });
  }, [appointments, search, filterDate, filterStatus, filterDoc]);

  // ── Mutations ─────────────────────────────────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, cancelReason, noShowReason }) =>
      adminApi.updateAppointmentStatus(id, status, cancelReason, noShowReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      setStatusModal(null);
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (id) => adminApi.checkInLate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }),
  });

  const openStatusModal = (appt) => {
    setStatusModal({ id: appt.id, currentStatus: appt.status });
    setNewStatus(appt.status);
    setCancelReason('');
    setNoShowReason('');
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateStatusMutation.mutate({
      id: statusModal.id,
      status: newStatus,
      cancelReason: newStatus === 'CANCELLED' ? cancelReason : undefined,
      noShowReason: newStatus === 'NO_SHOW'   ? noShowReason : undefined,
    });
  };

  const handleQuickNoShow = (appt) => {
    if (window.confirm(`Xác nhận đánh dấu bệnh nhân "${appt.patient?.fullName}" VẮNG MẶT?`)) {
      updateStatusMutation.mutate({ id: appt.id, status: 'NO_SHOW' });
    }
  };

  const handleCheckIn = (appt) => {
    checkInMutation.mutate(appt.id);
  };

  const columns = [
    {
      header: 'Bệnh nhân', accessor: 'patient', width: '18%',
      cell: r => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {r.status === 'PENDING' && isOverdue(r) && !r.checkedInAt && (
            <span title="Cần xử lý" style={{ color: '#f59e0b', fontSize: 13 }}>⚠</span>
          )}
          <strong>{r.patient?.fullName ?? '—'}</strong>
        </div>
      ),
    },
    {
      header: 'Bác sĩ', accessor: 'doctor', width: '18%',
      cell: r => <span>{r.doctor?.fullName ?? '—'}</span>,
    },
    {
      header: 'Ngày hẹn', accessor: 'appointmentDate', width: '11%',
      cell: r => <span>{fmtDate(r.appointmentDate)}</span>,
    },
    {
      header: 'Khung giờ', accessor: 'scheduledStartTime', width: '11%',
      cell: r => r.scheduledStartTime
        ? <span style={{ fontWeight: 500, color: '#2563eb' }}>{fmtTime(r.scheduledStartTime)} – {fmtTime(r.scheduledEndTime)}</span>
        : <span style={{ color: '#94a3b8' }}>—</span>,
    },
    {
      header: 'Check-in', accessor: 'checkedInAt', width: '11%',
      cell: r => r.checkedInAt
        ? <span style={{ color: '#16a34a', fontSize: 11, fontWeight: 500 }}>✓ {new Date(r.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        : <span style={{ color: '#94a3b8', fontSize: 11 }}>Chưa đến</span>,
    },
    {
      header: 'Số TT', accessor: 'queueNumber', width: '7%',
      cell: r => (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 24, height: 24, borderRadius: '50%',
          background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700,
        }}>
          {r.queueNumber ?? '—'}
        </span>
      ),
    },
    {
      header: 'Trạng thái', accessor: 'status', width: '13%',
      cell: r => {
        const s = STATUS_MAP[r.status];
        return s
          ? <span className={s.badge}>{s.label}</span>
          : <span className="badge badge-gray">{r.status}</span>;
      },
    },
  ];

  const isTerminal = (status) => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý lịch hẹn</h1>
          <div className="page-header-meta">Tổng: {filtered.length} lịch hẹn</div>
        </div>
      </div>

      {/* Cảnh báo cần xử lý */}
      {needActionCount > 0 && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
          padding: '12px 16px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <div>
            <strong style={{ color: '#b45309', fontSize: 13 }}>
              {needActionCount} lịch hẹn cần xử lý
            </strong>
            <div style={{ color: '#78350f', fontSize: 12, marginTop: 2 }}>
              Bệnh nhân chưa check-in và đã quá giờ hẹn. Hãy xác nhận đến muộn hoặc đánh dấu vắng mặt.
            </div>
          </div>
          <button
            style={{
              marginLeft: 'auto', padding: '5px 14px', borderRadius: 8,
              background: '#f59e0b', color: '#fff', border: 'none',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
            onClick={() => { setFilterStatus('PENDING'); setFilterDate(new Date().toISOString().slice(0, 10)); }}
          >
            Xem ngay
          </button>
        </div>
      )}

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => {
          const cnt = appointments.filter(a => a.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: filterStatus === s.value ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: filterStatus === s.value ? '#eff6ff' : '#fff',
                color: filterStatus === s.value ? '#2563eb' : '#475569',
                fontWeight: 500, transition: 'all 0.12s',
              }}
            >
              {s.label} <span style={{ fontWeight: 700 }}>{cnt}</span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm bệnh nhân, bác sĩ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          title="Lọc theo ngày hẹn"
        />
        <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)}>
          <option value="">Tất cả bác sĩ</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {(search || filterDate || filterDoc || filterStatus) && (
          <button className="secondary-btn" onClick={() => {
            setSearch(''); setFilterDate(''); setFilterDoc(''); setFilterStatus('');
          }}>
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
        renderActions={appt => (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <button className="action-btn view-btn" onClick={() => setDetailAppt(appt)}>
              Chi tiết
            </button>

            {/* Nút Check-in muộn: chỉ hiện khi PENDING và chưa check-in */}
            {appt.status === 'PENDING' && !appt.checkedInAt && (
              <button
                className="action-btn"
                style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}
                onClick={() => handleCheckIn(appt)}
                disabled={checkInMutation.isPending}
                title="Bệnh nhân đến muộn — ghi nhận thời điểm thực tế đến"
              >
                ↩ Đến muộn
              </button>
            )}

            {/* Nút Vắng mặt: chỉ hiện khi PENDING */}
            {appt.status === 'PENDING' && (
              <button
                className="action-btn"
                style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}
                onClick={() => handleQuickNoShow(appt)}
                disabled={updateStatusMutation.isPending}
                title="Bệnh nhân không đến"
              >
                ✗ Vắng mặt
              </button>
            )}

            {/* Nút cập nhật trạng thái thông thường */}
            {!isTerminal(appt.status) && (
              <button className="action-btn edit-btn" onClick={() => openStatusModal(appt)}>
                Cập nhật
              </button>
            )}
          </div>
        )}
      />

      {/* ── Detail modal ── */}
      <Modal isOpen={!!detailAppt} onClose={() => setDetailAppt(null)} title="Chi tiết lịch hẹn">
        {detailAppt && (
          <div className="admin-form" style={{ padding: '16px 20px 20px' }}>
            <div className="detail-section">
              <div className="detail-section-title">Thông tin lịch hẹn</div>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Số thứ tự</span>
                  <span className="detail-value">{detailAppt.queueNumber ?? '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ngày hẹn</span>
                  <span className="detail-value">{fmtDate(detailAppt.appointmentDate)}</span>
                </div>
                {detailAppt.scheduledStartTime && (
                  <div className="detail-item">
                    <span className="detail-label">Khung giờ</span>
                    <span className="detail-value" style={{ color: '#2563eb', fontWeight: 600 }}>
                      {fmtTime(detailAppt.scheduledStartTime)} – {fmtTime(detailAppt.scheduledEndTime)}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Check-in thực tế</span>
                  <span className="detail-value">
                    {detailAppt.checkedInAt
                      ? <span style={{ color: '#16a34a' }}>✓ {fmtDateTime(detailAppt.checkedInAt)}</span>
                      : <span style={{ color: '#94a3b8' }}>Chưa check-in</span>}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái</span>
                  <span>
                    {(() => { const s = STATUS_MAP[detailAppt.status]; return s ? <span className={s.badge}>{s.label}</span> : <span>{detailAppt.status}</span>; })()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bệnh nhân</span>
                  <span className="detail-value">{detailAppt.patient?.fullName ?? '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bác sĩ</span>
                  <span className="detail-value">{detailAppt.doctor?.fullName ?? '—'}</span>
                </div>
              </div>

              {detailAppt.symptoms && (
                <div className="detail-item" style={{ marginTop: 10 }}>
                  <span className="detail-label">Triệu chứng</span>
                  <span className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{detailAppt.symptoms}</span>
                </div>
              )}
              {detailAppt.cancelReason && (
                <div className="detail-item" style={{ marginTop: 10 }}>
                  <span className="detail-label">Lý do hủy</span>
                  <span className="detail-value" style={{ color: '#dc2626' }}>{detailAppt.cancelReason}</span>
                </div>
              )}
              {detailAppt.noShowReason && (
                <div className="detail-item" style={{ marginTop: 10 }}>
                  <span className="detail-label">Ghi chú vắng mặt</span>
                  <span className="detail-value" style={{ color: '#6b7280' }}>{detailAppt.noShowReason}</span>
                </div>
              )}
            </div>

            <div className="form-actions" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
              <button className="btn-cancel" onClick={() => setDetailAppt(null)}>Đóng</button>
              {detailAppt.status === 'PENDING' && !detailAppt.checkedInAt && (
                <button
                  style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 8, padding: '0 14px', height: 34, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                  onClick={() => { setDetailAppt(null); handleCheckIn(detailAppt); }}
                >
                  ↩ Đến muộn
                </button>
              )}
              {!isTerminal(detailAppt.status) && (
                <button
                  className="btn-submit"
                  onClick={() => { setDetailAppt(null); openStatusModal(detailAppt); }}
                >
                  Cập nhật trạng thái
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Update status modal ── */}
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title="Cập nhật trạng thái lịch hẹn">
        <form onSubmit={handleStatusSubmit} className="admin-form">
          <div className="form-group">
            <label>Trạng thái hiện tại</label>
            <div style={{ marginBottom: 12 }}>
              {(() => { const s = STATUS_MAP[statusModal?.currentStatus]; return s ? <span className={s.badge}>{s.label}</span> : null; })()}
            </div>
            <label>Chuyển sang trạng thái mới</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} required>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {newStatus === 'CANCELLED' && (
            <div className="form-group">
              <label>Lý do hủy *</label>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={3}
                required
                placeholder="Nhập lý do hủy lịch hẹn..."
              />
            </div>
          )}

          {newStatus === 'NO_SHOW' && (
            <div className="form-group">
              <label>Ghi chú (tuỳ chọn)</label>
              <textarea
                value={noShowReason}
                onChange={e => setNoShowReason(e.target.value)}
                rows={2}
                placeholder="VD: Gọi điện không nghe máy, chờ 45 phút không đến..."
              />
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                Lịch hẹn sẽ bị đánh dấu vắng mặt và không thể đổi trạng thái tiếp.
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setStatusModal(null)}>Hủy</button>
            <button
              type="submit"
              className={newStatus === 'NO_SHOW' ? 'btn-danger' : 'btn-submit'}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Đang lưu...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentManagementPage;
