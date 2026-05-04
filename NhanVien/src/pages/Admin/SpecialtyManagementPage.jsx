import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { doctorApi } from '../../api/doctorApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const EMPTY_FORM = { name: '', description: '', headDoctorId: '' };

const SpecialtyManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const { data: specialtiesRes, isLoading, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: adminApi.getAllSpecialties,
  });
  const { data: doctorsRes } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorApi.getAll,
  });

  const specialties = specialtiesRes?.data ?? [];
  const doctors     = doctorsRes?.data ?? [];

  const filtered = useMemo(() => {
    return specialties.filter(s =>
      !search || s.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [specialties, search]);

  const createMutation = useMutation({
    mutationFn: adminApi.createSpecialty,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateSpecialty(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); closeModal(); },
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteSpecialty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialties'] }),
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setIsOpen(true); };

  const openEdit = (sp) => {
    setForm({
      name:         sp.name,
      description:  sp.description ?? '',
      headDoctorId: sp.headDoctor?.id ?? '',
    });
    setEditingId(sp.id);
    setIsOpen(true);
  };

  const closeModal = () => { setIsOpen(false); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, data: form });
    else createMutation.mutate(form);
  };

  const handleDelete = (sp) => {
    if (window.confirm(`Xóa chuyên khoa "${sp.name}"?`))
      deleteMutation.mutate(sp.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: 'Tên chuyên khoa', accessor: 'name', width: '20%',
      cell: r => <strong>{r.name}</strong>,
    },
    {
      header: 'Mô tả', accessor: 'description', width: '30%',
      cell: r => <span style={{ color: '#6b7280' }}>{r.description || '—'}</span>,
    },
    {
      header: 'Trưởng khoa', accessor: 'headDoctor', width: '24%',
      cell: r => r.headDoctor?.fullName
        ? <span>{r.headDoctor.fullName}</span>
        : <span className="text-muted">Chưa bổ nhiệm</span>,
    },
    {
      header: 'Số bác sĩ', accessor: 'doctorCount', width: '10%',
      cell: r => <span className="text-center">{r.doctorCount ?? 0}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý chuyên khoa</h1>
        <button className="add-btn" onClick={openAdd}>+ Thêm chuyên khoa</button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên chuyên khoa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>}
      {error && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={sp => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(sp)}>Sửa</button>
            <button className="action-btn delete-btn" onClick={() => handleDelete(sp)}>Xóa</button>
          </>
        )}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên chuyên khoa *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="VD: Tim mạch, Nhi khoa..."
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Mô tả ngắn về chuyên khoa..."
            />
          </div>
          <div className="form-group">
            <label>Trưởng khoa</label>
            <select name="headDoctorId" value={form.headDoctorId} onChange={handleChange}>
              <option value="">-- Chưa bổ nhiệm --</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.fullName}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu chuyên khoa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SpecialtyManagementPage;
