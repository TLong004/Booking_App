import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../../api/serviceApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './DoctorManagementPage.css';

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const ServiceManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });
  const services = response?.data;

  const columns = [
    { header: 'Tên dịch vụ / Xét nghiệm', accessor: 'name', cell: (row) => <strong>{row.name}</strong> },
    { header: 'Đơn giá', accessor: 'price', cell: (row) => <span style={{ color: '#059669', fontWeight: 600 }}>{formatCurrency(row.price)}</span> },
    { header: 'Mô tả', accessor: 'description' },
  ];

  const openAddModal = () => {
    setFormData({ name: '', price: '', description: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setFormData({ name: service.name, price: service.price, description: service.description || '' });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const createMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); closeModal(); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => serviceApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); closeModal(); }
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
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

  const handleDelete = (service) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ ${service.name}?`))
      deleteMutation.mutate(service.id);
  };

  const renderActions = (service) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(service)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => handleDelete(service)}>Xóa</button>
    </>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Dịch vụ & Cận lâm sàng</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm dịch vụ</button>
      </header>
      {isLoading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error-message">Có lỗi xảy ra: {error.message}</p>}
      {services && <DataTable columns={columns} data={services} renderActions={renderActions} />}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên dịch vụ / Cận lâm sàng</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="VD: Siêu âm ổ bụng, Xét nghiệm máu..." />
          </div>
          <div className="form-group">
            <label>Đơn giá (VNĐ)</label>
            <input type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} required placeholder="VD: 150000" />
          </div>
          <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Ghi chú thêm về dịch vụ..." /></div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ServiceManagementPage;