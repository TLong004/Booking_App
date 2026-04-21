import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineApi } from '../../api/medicineApi';
import DataTable from '../../api/DataTable';
import Modal from '../../Modal';
import './DoctorManagementPage.css';

const MedicineManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'Viên', price: '', stock_quantity: 0 });

  const { data: response, isLoading } = useQuery({ queryKey: ['medicines'], queryFn: medicineApi.getAll });
  const medicines = response?.data;

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const columns = [
    { header: 'Tên Thuốc/Vật tư', accessor: 'name' },
    { header: 'Đơn vị tính', accessor: 'unit' },
    { header: 'Đơn giá', accessor: 'price', cell: (row) => formatCurrency(row.price) },
    { header: 'Tồn kho', accessor: 'stock_quantity', cell: (row) => <strong style={{color: row.stock_quantity > 10 ? '#16a34a' : '#dc2626'}}>{row.stock_quantity}</strong> },
  ];

  const createMutation = useMutation({
    mutationFn: medicineApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); setIsModalOpen(false); }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => medicineApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['medicines'] }); setIsModalOpen(false); }
  });
  const deleteMutation = useMutation({
    mutationFn: medicineApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medicines'] })
  });

  const openModal = (item = null) => {
    if (item) {
      setFormData({ name: item.name, unit: item.unit, price: item.price, stock_quantity: item.stock_quantity });
      setEditingId(item.id);
    } else {
      setFormData({ name: '', unit: 'Viên', price: '', stock_quantity: 0 });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, price: Number(formData.price), stock_quantity: Number(formData.stock_quantity) };
    if (editingId) updateMutation.mutate({ id: editingId, data: dataToSubmit });
    else createMutation.mutate(dataToSubmit);
  };

  const renderActions = (item) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openModal(item)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => { if(window.confirm('Xóa thuốc này?')) deleteMutation.mutate(item.id); }}>Xóa</button>
    </>
  );

  const renderCell = (row, col) => col.cell ? col.cell(row) : row[col.accessor];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Kho Thuốc</h1>
        <button className="add-new-btn" onClick={() => openModal()}>+ Nhập Thuốc mới</button>
      </header>
      {isLoading ? <p>Đang tải...</p> : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr>{columns.map(c => <th key={c.accessor}>{c.header}</th>)}<th>Hành động</th></tr></thead>
            <tbody>
              {medicines?.map(item => (
                <tr key={item.id}>{columns.map(c => <td key={c.accessor}>{renderCell(item, c)}</td>)}<td className="actions-cell">{renderActions(item)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Cập nhật Thuốc' : 'Nhập Thuốc mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên Thuốc / Vật tư y tế</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label>Đơn vị tính</label>
              <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required placeholder="VD: Viên, Vỉ, Hộp..." />
            </div>
            <div style={{ flex: 1 }}>
              <label>Số lượng tồn</label>
              <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} required min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Đơn giá (VNĐ)</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" />
          </div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button><button type="submit" className="btn-submit">Lưu thông tin</button></div>
        </form>
      </Modal>
    </div>
  );
};
export default MedicineManagementPage;