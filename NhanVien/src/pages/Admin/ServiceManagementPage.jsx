import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../../api/serviceApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const EMPTY_FORM = { name: '', price: '', description: '' };

const ServiceManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });
  const services = response?.data ?? [];

  const filtered = useMemo(() => {
    return services.filter(s =>
      !search || s.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  const createMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => serviceApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); closeModal(); },
  });
  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setIsOpen(true); };

  const openEdit = (svc) => {
    setForm({
      name:        svc.name,
      price:       svc.price ?? '',
      description: svc.description ?? '',
    });
    setEditingId(svc.id);
    setIsOpen(true);
  };

  const closeModal = () => { setIsOpen(false); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (svc) => {
    if (window.confirm(`Xóa dịch vụ "${svc.name}"?`))
      deleteMutation.mutate(svc.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: 'Tên dịch vụ / Cận lâm sàng', accessor: 'name', width: '30%',
      cell: r => <strong>{r.name}</strong>,
    },
    {
      header: 'Đơn giá', accessor: 'price', width: '18%',
      cell: r => <span className="text-green">{fmt(r.price ?? 0)}</span>,
    },
    {
      header: 'Mô tả', accessor: 'description', width: '38%',
      cell: r => <span style={{ color: '#6b7280' }}>{r.description || '—'}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý dịch vụ & Cận lâm sàng</h1>
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
      {error && <p className="error-message">Lỗi: {error.message}</p>}

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
          <div className="form-group">
            <label>Tên dịch vụ / Cận lâm sàng *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="VD: Siêu âm ổ bụng, Xét nghiệm máu..."
            />
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
