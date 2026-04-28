import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineApi } from '../../api/medicineApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './DoctorManagementPage.css';

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const UNITS = ['Viên', 'Vỉ', 'Hộp', 'Gói', 'Tuýp', 'Lọ', 'Chai'];

const MedicineManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'Viên', price: '', usage_instruction: '' });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: medicineApi.getAll,
  });
  const medicines = response?.data;

  const columns = [
    { header: 'Tên thuốc / Biệt dược', accessor: 'name', cell: (row) => <strong>{row.name}</strong> },
    { header: 'ĐVT', accessor: 'unit' },
    { header: 'Đơn giá', accessor: 'price', cell: (row) => <span style={{ color: '#059669', fontWeight: 600 }}>{formatCurrency(row.price)}</span> },
    { header: 'Hướng dẫn dùng mặc định', accessor: 'usage_instruction' },
  ];

  const openAddModal = () => {
    setFormData({ name: '', unit: 'Viên', price: '', usage_instruction: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (med) => {
    setFormData({ name: med.name, unit: med.unit || 'Viên', price: med.price, usage_instruction: med.usage_instruction || '' });
    setEditingId(med.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const createMutation = useMutation({
    mutationFn: medicineApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); closeModal(); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => medicineApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); closeModal(); }
  });

  const deleteMutation = useMutation({
    mutationFn: medicineApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medicines'] })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price) };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (med) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc ${med.name}?`))
      deleteMutation.mutate(med.id);
  };

  const renderActions = (med) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(med)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => handleDelete(med)}>Xóa</button>
    </>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Danh mục Thuốc</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm thuốc mới</button>
      </header>
      {isLoading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error-message">Có lỗi xảy ra: {error.message}</p>}
      {medicines && <DataTable columns={columns} data={medicines} renderActions={renderActions} />}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên thuốc / Biệt dược</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="VD: Paracetamol 500mg" />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label>Đơn vị tính (ĐVT)</label><select name="unit" value={formData.unit} onChange={handleInputChange}>{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            <div><label>Đơn giá (VNĐ)</label><input type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} required placeholder="VD: 5000" /></div>
          </div>
          <div className="form-group">
            <label>Hướng dẫn dùng mặc định (Hiển thị gợi ý cho Bác sĩ)</label>
            <input type="text" name="usage_instruction" value={formData.usage_instruction} onChange={handleInputChange} placeholder="VD: Uống sau ăn no, mỗi lần 1 viên" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default MedicineManagementPage;