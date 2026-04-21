import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../../api/serviceApi';
import DataTable from '../../api/DataTable';
import Modal from '../../Modal';
import './DoctorManagementPage.css';

const ServiceManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

  const { data: response, isLoading } = useQuery({ queryKey: ['services'], queryFn: serviceApi.getAll });
  const services = response?.data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns = [
    { header: 'Tên Dịch vụ', accessor: 'name' },
    { header: 'Mô tả', accessor: 'description' },
    { header: 'Đơn giá', accessor: 'price', cell: (row) => formatCurrency(row.price) },
  ];

  const createMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); setIsModalOpen(false); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => serviceApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); setIsModalOpen(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: serviceApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
  });

  const openModal = (item = null) => {
    if (item) {
      setFormData({ name: item.name, price: item.price, description: item.description });
      setEditingId(item.id);
    } else {
      setFormData({ name: '', price: '', description: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, price: Number(formData.price) };
    if (editingId) updateMutation.mutate({ id: editingId, data: dataToSubmit });
    else createMutation.mutate(dataToSubmit);
  };

  const renderActions = (item) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openModal(item)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => { if(window.confirm('Xóa dịch vụ này?')) deleteMutation.mutate(item.id); }}>Xóa</button>
    </>
  );

  // Custom render for Table cells (for formatting price)
  const renderCell = (row, col) => {
    if (col.cell) return col.cell(row);
    return row[col.accessor];
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Dịch vụ Khám/Chữa bệnh</h1>
        <button className="add-new-btn" onClick={() => openModal()}>+ Thêm Dịch vụ</button>
      </header>
      {isLoading ? <p>Đang tải...</p> : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr>{columns.map(c => <th key={c.accessor}>{c.header}</th>)}<th>Hành động</th></tr></thead>
            <tbody>
              {services?.map(item => (
                <tr key={item.id}>{columns.map(c => <td key={c.accessor}>{renderCell(item, c)}</td>)}<td className="actions-cell">{renderActions(item)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên Dịch vụ</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Đơn giá (VNĐ)</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" />
          </div>
          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn-submit">Lưu thông tin</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ServiceManagementPage;