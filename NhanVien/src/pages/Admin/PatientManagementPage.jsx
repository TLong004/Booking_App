import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN');
};

const calcAge = (dob) => {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' tuổi';
};

const STATUS_MAP = {
  PENDING:     { label: 'Chờ khám',   badge: 'badge badge-orange' },
  IN_PROGRESS: { label: 'Đang khám',  badge: 'badge badge-blue'   },
  COMPLETED:   { label: 'Hoàn thành', badge: 'badge badge-green'  },
  CANCELLED:   { label: 'Đã hủy',     badge: 'badge badge-red'    },
};

const PatientManagementPage = () => {
  const [search,       setSearch]      = useState('');
  const [filterGender, setGender]      = useState('');
  const [detailId,     setDetailId]    = useState(null);

  // ── Data ──────────────────────────────────────────────────────────
  const { data: patientsRes, isLoading, error } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: adminApi.getAllPatients,
  });

  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ['admin-patient-detail', detailId],
    queryFn: () => adminApi.getPatientById(detailId),
    enabled: !!detailId,
  });

  const patients = patientsRes?.data?.data ?? [];
  const detail   = detailRes?.data?.data ?? null;

  // ── Client filter ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = !search ||
        p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        p.userId?.toString().includes(search);
      const matchGender = !filterGender || p.gender === filterGender;
      return matchSearch && matchGender;
    });
  }, [patients, search, filterGender]);

  const columns = [
    {
      header: 'Họ và tên', accessor: 'fullName', width: '22%',
      cell: r => <strong>{r.fullName}</strong>,
    },
    {
      header: 'Ngày sinh', accessor: 'dob', width: '14%',
      cell: r => (
        <span title={fmtDate(r.dob)}>
          {fmtDate(r.dob)}
          {r.dob && <span style={{ color: '#94a3b8', marginLeft: 4, fontSize: 11 }}>({calcAge(r.dob)})</span>}
        </span>
      ),
    },
    {
      header: 'Giới tính', accessor: 'gender', width: '11%',
      cell: r => {
        if (!r.gender) return <span className="text-muted">—</span>;
        return <span className={`badge ${r.gender === 'Nam' ? 'badge-blue' : 'badge-purple'}`}>{r.gender}</span>;
      },
    },
    {
      header: 'Địa chỉ', accessor: 'address', width: '30%',
      cell: r => <span style={{ color: '#64748b' }}>{r.address || '—'}</span>,
    },
    {
      header: 'Ngày tạo', accessor: 'createdAt', width: '13%',
      cell: r => <span style={{ color: '#94a3b8' }}>{fmtDate(r.createdAt)}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý bệnh nhân</h1>
          <div className="page-header-meta">Tổng: {patients.length} bệnh nhân</div>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên bệnh nhân..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterGender} onChange={e => setGender(e.target.value)}>
          <option value="">Tất cả giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        {(search || filterGender) && (
          <button className="secondary-btn" onClick={() => { setSearch(''); setGender(''); }}>
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
        renderActions={patient => (
          <button className="action-btn view-btn" onClick={() => setDetailId(patient.id)}>
            Xem hồ sơ
          </button>
        )}
      />

      {/* ── Detail modal ── */}
      <Modal
        isOpen={!!detailId}
        onClose={() => setDetailId(null)}
        title="Hồ sơ bệnh nhân"
      >
        <div style={{ padding: '16px 20px 20px' }}>
          {loadingDetail ? (
            <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>Đang tải...</p>
          ) : detail ? (
            <>
              {/* Profile */}
              <div className="detail-section">
                <div className="detail-section-title">Thông tin cá nhân</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Họ và tên</span>
                    <span className="detail-value">{detail.profile?.fullName ?? '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày sinh</span>
                    <span className="detail-value">
                      {fmtDate(detail.profile?.dob)}
                      {detail.profile?.dob && ` (${calcAge(detail.profile.dob)})`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Giới tính</span>
                    <span className="detail-value">{detail.profile?.gender ?? '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Địa chỉ</span>
                    <span className="detail-value">{detail.profile?.address ?? '—'}</span>
                  </div>
                </div>
              </div>

              {/* Account info */}
              {detail.accountInfo && (
                <div className="detail-section">
                  <div className="detail-section-title">Tài khoản</div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Tên đăng nhập</span>
                      <span className="detail-value">{detail.accountInfo.username}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{detail.accountInfo.email ?? '—'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">SĐT</span>
                      <span className="detail-value">{detail.accountInfo.phone ?? '—'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Trạng thái</span>
                      <span className={`badge ${detail.accountInfo.isActive ? 'badge-green' : 'badge-red'}`}>
                        {detail.accountInfo.isActive ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment history */}
              <div className="detail-section">
                <div className="detail-section-title">
                  Lịch sử khám ({detail.appointmentHistory?.length ?? 0})
                </div>
                {!detail.appointmentHistory?.length ? (
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>Chưa có lịch hẹn nào</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {detail.appointmentHistory.slice(0, 5).map(appt => {
                      const s = STATUS_MAP[appt.status];
                      return (
                        <div key={appt.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 10px', background: '#fff', borderRadius: 8,
                          border: '1px solid #e2e8f0', fontSize: 12,
                        }}>
                          <div>
                            <strong style={{ color: '#1e293b' }}>{fmtDate(appt.appointmentDate)}</strong>
                            <span style={{ color: '#94a3b8', marginLeft: 8 }}>
                              Số TT: {appt.queueNumber ?? '—'}
                            </span>
                          </div>
                          {s && <span className={s.badge}>{s.label}</span>}
                        </div>
                      );
                    })}
                    {detail.appointmentHistory.length > 5 && (
                      <p style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center', margin: 0 }}>
                        ...và {detail.appointmentHistory.length - 5} lịch hẹn khác
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 20 }}>
              Không tìm thấy hồ sơ
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
            <button className="btn-cancel" onClick={() => setDetailId(null)}>Đóng</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientManagementPage;
