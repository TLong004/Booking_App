import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineApi } from '../../api/medicineApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const UNITS = ['Viên', 'Vỉ', 'Hộp', 'Gói', 'Tuýp', 'Lọ', 'Chai'];
const LOW_STOCK_THRESHOLD = 100;

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const EMPTY_FORM = { name: '', unit: 'Viên', price: '', stockQuantity: '', usage: '' };

const MedicineManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [filterUnit, setUnit]     = useState('');
  const [filterStock, setStock]   = useState('');

  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: medicineApi.getAll,
  });
  const medicines = response?.data ?? [];

  const filtered = useMemo(() => {
    return medicines.filter(m => {
      const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase());
      const matchUnit   = !filterUnit  || m.unit === filterUnit;
      const matchStock  = !filterStock ||
        (filterStock === 'low' ? m.stockQuantity < LOW_STOCK_THRESHOLD : m.stockQuantity >= LOW_STOCK_THRESHOLD);
      return matchSearch && matchUnit && matchStock;
    });
  }, [medicines, search, filterUnit, filterStock]);

  const createMutation = useMutation({
    mutationFn: medicineApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => medicineApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); closeModal(); },
  });
  const deleteMutation = useMutation({
    mutationFn: medicineApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medicines'] }),
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setIsOpen(true); };

  const openEdit = (med) => {
    setForm({
      name:          med.name,
      unit:          med.unit ?? 'Viên',
      price:         med.price ?? '',
      stockQuantity: med.stockQuantity ?? '',
      usage:         med.usage ?? '',
    });
    setEditingId(med.id);
    setIsOpen(true);
  };

  const closeModal = () => { setIsOpen(false); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price:         Number(form.price),
      stockQuantity: Number(form.stockQuantity) || 0,
    };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (med) => {
    if (window.confirm(`Xóa thuốc "${med.name}"?`))
      deleteMutation.mutate(med.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      header: 'Tên thuốc / Biệt dược', accessor: 'name', width: '26%',
      cell: r => <strong>{r.name}</strong>,
    },
    { header: 'ĐVT',       accessor: 'unit',          width: '9%' },
    {
      header: 'Đơn giá',   accessor: 'price',          width: '14%',
      cell: r => <span className="text-green">{fmt(r.price ?? 0)}</span>,
    },
    {
      header: 'Tồn kho',   accessor: 'stockQuantity',  width: '10%',
      cell: r => {
        const low = (r.stockQuantity ?? 0) < LOW_STOCK_THRESHOLD;
        return (
          <span className={low ? 'text-danger' : ''} title={low ? 'Sắp hết hàng' : ''}>
            {r.stockQuantity ?? 0}{low ? ' ⚠' : ''}
          </span>
        );
      },
    },
    {
      header: 'Hướng dẫn dùng', accessor: 'usage', width: '25%',
      cell: r => <span style={{ color: '#6b7280' }}>{r.usage || '—'}</span>,
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Danh mục thuốc</h1>
        <button className="add-btn" onClick={openAdd}>+ Thêm thuốc</button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên thuốc..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterUnit} onChange={e => setUnit(e.target.value)}>
          <option value="">Tất cả đơn vị</option>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filterStock} onChange={e => setStock(e.target.value)}>
          <option value="">Tất cả tồn kho</option>
          <option value="low">Sắp hết (dưới {LOW_STOCK_THRESHOLD})</option>
          <option value="ok">Còn hàng</option>
        </select>
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>}
      {error && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={med => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(med)}>Sửa</button>
            <button className="action-btn delete-btn" onClick={() => handleDelete(med)}>Xóa</button>
          </>
        )}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên thuốc / Biệt dược *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="VD: Paracetamol 500mg"
            />
          </div>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Đơn vị tính</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Đơn giá (VNĐ) *</label>
              <input
                name="price" type="number" min="0"
                value={form.price} onChange={handleChange}
                required placeholder="5000"
              />
            </div>
            <div className="form-group">
              <label>Tồn kho ban đầu</label>
              <input
                name="stockQuantity" type="number" min="0"
                value={form.stockQuantity} onChange={handleChange}
                placeholder="500"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Hướng dẫn dùng mặc định</label>
            <input
              name="usage" value={form.usage} onChange={handleChange}
              placeholder="VD: Uống sau ăn, 1 viên/lần, 3 lần/ngày"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu danh mục'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicineManagementPage;
