import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const EMPTY_FORM = { name: '', price: '', description: '', specialtyId: '' };

const ServiceManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [apiError, setApiError]   = useState('');

  // ── Data queries ──────────────────────────────────────────────────────
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin-services'],
    queryFn: adminApi.getAllServices,
  });
  const { data: specialtiesRes } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: adminApi.getAllSpecialties,
  });

  const services   = response?.data?.data     ?? [];
  const specialties = specialtiesRes?.data?.data ?? [];

  const filtered = useMemo(() => {
    return services.filter(s =>
      !search || s.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  // ── Mutations ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: adminApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Thêm dịch vụ thất bại!'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Cập nhật thất bại!'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setApiError('');
    setIsOpen(true);
  };

  const openEdit = (svc) => {
    setForm({
      name:        svc.name ?? '',
      price:       svc.price ?? '',
      description: svc.description ?? '',
      specialtyId: svc.specialtyId ?? '',
    });
    setEditingId(svc.id);
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
      price:       Number(form.price),
      specialtyId: form.specialtyId ? Number(form.specialtyId) : null,
    };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (svc) => {
    if (window.confirm(`Xóa dịch vụ "${svc.name}"?`))
      deleteMutation.mutate(svc.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const specMap = Object.fromEntries(specialties.map(s => [s.id, s.name]));

  const columns = [
    {
      header: 'Tên dịch vụ / Cận lâm sàng', accessor: 'name', width: '26%',
      cell: r => <strong>{r.name}</strong>,
    },
    {
      header: 'Chuyên khoa', accessor: 'specialtyId', width: '18%',
      cell: r => r.specialtyId
        ? <span className="badge badge-teal">{specMap[r.specialtyId] ?? `ID:${r.specialtyId}`}</span>
        : <span style={{ color: '#94a3b8', fontSize: 12 }}>Dùng chung</span>,
    },
    {
      header: 'Đơn giá', accessor: 'price', width: '15%',
      cell: r => <span className="text-green">{fmt(r.price)}</span>,
    },
    {
      header: 'Mô tả', accessor: 'description', width: '27%',
      cell: r => <span style={{ color: '#6b7280' }}>{r.description || '—'}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý dịch vụ &amp; Cận lâm sàng</h1>
        <button className="add-btn" onClick={openAdd}>+ Thêm dịch vụ</button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên dịch vụ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>}
      {error    && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={svc => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(svc)}>Sửa</button>
            <button className="action-btn delete-btn" onClick={() => handleDelete(svc)}>Xóa</button>
          </>
        )}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          {apiError && <p className="error-message" style={{ marginBottom: 10 }}>{apiError}</p>}

          <div className="form-group">
            <label>Tên dịch vụ / Cận lâm sàng *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="VD: Siêu âm ổ bụng, Xét nghiệm máu..."
            />
          </div>
          <div className="form-group">
            <label>Chuyên khoa áp dụng</label>
            <select name="specialtyId" value={form.specialtyId} onChange={handleChange}>
              <option value="">— Dùng chung (không gắn khoa) —</option>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Đơn giá (VNĐ) *</label>
            <input
              name="price" type="number" min="0"
              value={form.price} onChange={handleChange}
              required placeholder="VD: 150000"
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Ghi chú thêm về dịch vụ..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu dịch vụ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceManagementPage;
