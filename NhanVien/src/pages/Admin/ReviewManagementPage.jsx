import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import './AdminDashboard.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const Stars = ({ rating }) => (
  <span className="stars">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={`star${i <= rating ? '' : ' empty'}`}>★</span>
    ))}
  </span>
);

const ReviewManagementPage = () => {
  const queryClient = useQueryClient();

  const [search,       setSearch]      = useState('');
  const [filterDoctor, setFilterDoctor]= useState('');
  const [filterRating, setFilterRating]= useState('');

  const { data: reviewsRes, isLoading, error } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: adminApi.getAllReviews,
  });

  const { data: doctorsRes } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: adminApi.getAllDoctors,
  });

  const reviews = reviewsRes?.data?.data ?? [];
  const doctors = doctorsRes?.data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }),
  });

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa đánh giá này?'))
      deleteMutation.mutate(id);
  };

  // Summary stats
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : '—';
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
  }));

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const patientName = r.patientName?.toLowerCase() ?? '';
      const doctorName  = r.doctorName?.toLowerCase()  ?? '';
      const comment     = r.comment?.toLowerCase()     ?? '';
      const matchSearch = !search ||
        patientName.includes(search.toLowerCase()) ||
        doctorName.includes(search.toLowerCase()) ||
        comment.includes(search.toLowerCase());
      const matchDoctor = !filterDoctor || String(r.doctorId) === filterDoctor;
      const matchRating = !filterRating || r.rating === Number(filterRating);
      return matchSearch && matchDoctor && matchRating;
    });
  }, [reviews, search, filterDoctor, filterRating]);

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
      header: 'Đánh giá', accessor: 'rating', width: '14%',
      cell: r => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stars rating={r.rating ?? 0} />
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{r.rating}/5</span>
        </div>
      ),
    },
    {
      header: 'Nhận xét', accessor: 'comment', width: '32%',
      cell: r => (
        <span style={{ color: '#475569', fontSize: 13 }}>
          {r.comment
            ? (r.comment.length > 60 ? r.comment.slice(0, 60) + '…' : r.comment)
            : <span style={{ color: '#94a3b8' }}>Không có nhận xét</span>}
        </span>
      ),
    },
    {
      header: 'Ngày tạo', accessor: 'createdAt', width: '12%',
      cell: r => <span style={{ color: '#94a3b8', fontSize: 12 }}>{fmtDate(r.createdAt)}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý đánh giá</h1>
          <div className="page-header-meta">Tổng: {reviews.length} đánh giá</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 16 }}>
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
          padding: '16px 20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Điểm trung bình
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{avgRating}</div>
            <Stars rating={Math.round(Number(avgRating))} />
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{reviews.length} đánh giá</div>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
          padding: '14px 20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
        }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Phân bổ sao
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ratingCounts.map(({ n, count }) => {
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 12, color: '#f59e0b', fontWeight: 700 }}>{n}</span>
                  <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, background: '#f59e0b', height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ color: '#64748b', width: 28, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rating filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {[5, 4, 3, 2, 1].map(n => (
          <button
            key={n}
            onClick={() => setFilterRating(filterRating === String(n) ? '' : String(n))}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              border: filterRating === String(n) ? '2px solid #f59e0b' : '1px solid #e2e8f0',
              background: filterRating === String(n) ? '#fef3c7' : '#fff',
              color: filterRating === String(n) ? '#b45309' : '#475569',
              fontWeight: 500,
            }}
          >
            {'★'.repeat(n)} <span style={{ fontWeight: 700 }}>{reviews.filter(r => r.rating === n).length}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo bệnh nhân, bác sĩ, nhận xét..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}>
          <option value="">Tất cả bác sĩ</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
        </select>
        {(search || filterDoctor || filterRating) && (
          <button className="secondary-btn" onClick={() => { setSearch(''); setFilterDoctor(''); setFilterRating(''); }}>
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
        renderActions={review => (
          <button
            className="action-btn delete-btn"
            onClick={() => handleDelete(review.id)}
            disabled={deleteMutation.isPending}
          >
            Xóa
          </button>
        )}
      />
    </div>
  );
};

export default ReviewManagementPage;
