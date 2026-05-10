import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const UNITS = ['Viên', 'Vỉ', 'Hộp', 'Gói', 'Tuýp', 'Lọ', 'Chai'];
const LOW_STOCK_THRESHOLD = 100;

const fmt = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const EMPTY_FORM = { name: '', unit: 'Viên', price: '', stockQuantity: '', usage: '' };

const MedicineManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState('');
  const [filterUnit, setUnit]     = useState('');
  const [filterStock, setStock]   = useState('');

  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [apiError, setApiError]   = useState('');

  const [importModal, setImportModal] = useState(null); // { id, name }
  const [importQty, setImportQty]     = useState('');

  // ── Data query ────────────────────────────────────────────────────────
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin-medicines'],
    queryFn: adminApi.getAllMedicines,
  });

  // BE trả về paginated response → lấy .data.data
  const medicines = response?.data?.data ?? [];

  const filtered = useMemo(() => {
    return medicines.filter(m => {
      const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase());
      const matchUnit   = !filterUnit  || m.unit === filterUnit;
      const matchStock  = !filterStock ||
        (filterStock === 'low'
          ? (m.stockQuantity ?? 0) < LOW_STOCK_THRESHOLD
          : (m.stockQuantity ?? 0) >= LOW_STOCK_THRESHOLD);
      return matchSearch && matchUnit && matchStock;
    });
  }, [medicines, search, filterUnit, filterStock]);

  // ── Mutations ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: adminApi.createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medicines'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Thêm thuốc thất bại!'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateMedicine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medicines'] });
      closeModal();
    },
    onError: (err) => setApiError(err.response?.data?.message || 'Cập nhật thất bại!'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteMedicine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-medicines'] }),
  });
  const importMutation = useMutation({
    mutationFn: ({ id, quantity }) => adminApi.importMedicineStock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medicines'] });
      setImportModal(null);
      setImportQty('');
    },
  });

  const handleExportCsv = () => {
    adminApi.exportMedicines().then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medicines_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setApiError('');
    setIsOpen(true);
  };

  const openEdit = (med) => {
    setForm({
      name:          med.name ?? '',
      unit:          med.unit ?? 'Viên',
      price:         med.price ?? '',
      stockQuantity: med.stockQuantity ?? '',
      usage:         med.usage ?? '',
    });
    setEditingId(med.id);
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
    { header: 'ĐVT', accessor: 'unit', width: '9%' },
    {
      header: 'Đơn giá', accessor: 'price', width: '14%',
      cell: r => <span className="text-green">{fmt(r.price)}</span>,
    },
    {
      header: 'Tồn kho', accessor: 'stockQuantity', width: '10%',
      cell: r => {
        const qty = r.stockQuantity ?? 0;
        const low = qty < LOW_STOCK_THRESHOLD;
        return (
          <span className={low ? 'text-danger' : ''} title={low ? 'Sắp hết hàng' : ''}>
            {qty}{low ? ' ⚠' : ''}
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="secondary-btn" onClick={handleExportCsv}>↓ Xuất CSV</button>
          <button className="add-btn" onClick={openAdd}>+ Thêm thuốc</button>
        </div>
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
      {error    && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={med => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(med)}>Sửa</button>
            <button
              className="action-btn view-btn"
              onClick={() => { setImportModal({ id: med.id, name: med.name }); setImportQty(''); }}
            >
              Nhập kho
            </button>
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
          {apiError && <p className="error-message" style={{ marginBottom: 10 }}>{apiError}</p>}

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
      {/* Import stock modal */}
      <Modal
        isOpen={!!importModal}
        onClose={() => setImportModal(null)}
        title={`Nhập kho — ${importModal?.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            importMutation.mutate({ id: importModal.id, quantity: Number(importQty) });
          }}
          className="admin-form"
        >
          <div className="form-group">
            <label>Số lượng nhập *</label>
            <input
              type="number"
              min="1"
              value={importQty}
              onChange={e => setImportQty(e.target.value)}
              required
              placeholder="VD: 200"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setImportModal(null)}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={importMutation.isPending}>
              {importMutation.isPending ? 'Đang nhập...' : 'Xác nhận nhập kho'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicineManagementPage;
