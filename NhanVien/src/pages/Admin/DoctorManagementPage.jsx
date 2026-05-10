import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const DEGREES = ['Bác sĩ', 'Thạc sĩ', 'Tiến sĩ', 'Phó giáo sư', 'Giáo sư'];

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const EMPTY_FORM = {
  fullName: '', degree: 'Bác sĩ', specialtyId: '',
  roomNumber: '', consultationFee: '', bio: '',
};

const DoctorManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [filterSpec, setSpec]     = useState('');
  const [filterDegree, setDegree] = useState('');

  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [apiError, setApiError]   = useState('');

  // ── Data queries ──────────────────────────────────────────────────────
  const { data: doctorsRes, isLoading, error } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: adminApi.getAllDoctors,
  });
  const { data: specialtiesRes } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: adminApi.getAllSpecialties,
  });

  // BE trả về paginated response → lấy .data.data
  const doctors    = doctorsRes?.data?.data ?? [];
  const specialties = specialtiesRes?.data?.data ?? [];

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const specName = d.specialty?.name ?? '';
      const matchSearch = !search || d.fullName?.toLowerCase().includes(search.toLowerCase());
      const matchSpec   = !filterSpec   || specName === filterSpec;
      const matchDegree = !filterDegree || d.degree === filterDegree;
      return matchSearch && matchSpec && matchDegree;
    });
  }, [doctors, search, filterSpec, filterDegree]);

  // ── Mutations ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: adminApi.createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Thêm bác sĩ thất bại!'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Cập nhật thất bại!'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteDoctor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-doctors'] }),
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setApiError('');
    setIsOpen(true);
  };

  const openEdit = (doc) => {
    setForm({
      fullName:        doc.fullName ?? '',
      degree:          doc.degree ?? 'Bác sĩ',
      specialtyId:     doc.specialty?.id ?? '',
      roomNumber:      doc.roomNumber ?? '',
      consultationFee: doc.consultationFee ?? '',
      bio:             doc.bio ?? '',
    });
    setEditingId(doc.id);
    setApiError('');
    setIsOpen(true);
  };

  const closeModal = () => { setIsOpen(false); setEditingId(null); setApiError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');
    const payload = {
      ...form,
      specialtyId:     form.specialtyId ? Number(form.specialtyId) : null,
      consultationFee: Number(form.consultationFee) || 0,
    };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (doc) => {
    if (window.confirm(`Xóa bác sĩ "${doc.fullName}"?`))
      deleteMutation.mutate(doc.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Unique specialty list for filter dropdown
  const specOptions = useMemo(() => {
    const seen = new Set();
    return doctors
      .map(d => d.specialty?.name)
      .filter(name => name && !seen.has(name) && seen.add(name));
  }, [doctors]);

  const columns = [
    {
      header: 'Họ và tên', accessor: 'fullName', width: '22%',
      cell: r => <strong>{r.fullName}</strong>,
    },
    { header: 'Học vị', accessor: 'degree', width: '12%' },
    {
      header: 'Chuyên khoa', accessor: 'specialty', width: '16%',
      cell: r => r.specialty?.name
        ? <span className="badge badge-blue">{r.specialty.name}</span>
        : <span className="text-muted">—</span>,
    },
    { header: 'Phòng', accessor: 'roomNumber', width: '10%' },
    {
      header: 'Phí khám', accessor: 'consultationFee', width: '16%',
      cell: r => <span className="text-green">{fmt(r.consultationFee)}</span>,
    },
    {
      header: 'Trạng thái TK', accessor: 'user', width: '14%',
      cell: r => r.user
        ? <span className={`badge ${r.user.isActive ? 'badge-green' : 'badge-red'}`}>
            {r.user.isActive ? 'Hoạt động' : 'Vô hiệu'}
          </span>
        : <span className="text-muted">—</span>,
    },
    {
      header: 'Tiểu sử', accessor: 'bio', width: '10%',
      cell: r => <span style={{ color: '#6b7280' }}>{r.bio ? '✓' : '—'}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý bác sĩ</h1>
        <button className="add-btn" onClick={openAdd}>+ Thêm bác sĩ</button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên bác sĩ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterSpec} onChange={e => setSpec(e.target.value)}>
          <option value="">Tất cả chuyên khoa</option>
          {specOptions.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <select value={filterDegree} onChange={e => setDegree(e.target.value)}>
          <option value="">Tất cả học vị</option>
          {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>}
      {error    && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={doc => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(doc)}>Sửa</button>
            <button className="action-btn delete-btn" onClick={() => handleDelete(doc)}>Xóa</button>
          </>
        )}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          {apiError && <p className="error-message" style={{ marginBottom: 10 }}>{apiError}</p>}

          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              name="fullName" value={form.fullName} onChange={handleChange}
              required placeholder="VD: TS.BS. Nguyễn Văn A"
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Học vị *</label>
              <select name="degree" value={form.degree} onChange={handleChange}>
                {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phòng khám</label>
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="VD: P101" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Chuyên khoa *</label>
              <select name="specialtyId" value={form.specialtyId} onChange={handleChange} required>
                <option value="">-- Chọn chuyên khoa --</option>
                {specialties.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Phí khám (VNĐ)</label>
              <input
                name="consultationFee" type="number" min="0"
                value={form.consultationFee} onChange={handleChange}
                placeholder="150000"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Tiểu sử / Giới thiệu</label>
            <textarea
              name="bio" value={form.bio} onChange={handleChange}
              rows={3} placeholder="Kinh nghiệm, chứng chỉ hành nghề..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorManagementPage;
