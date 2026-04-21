import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtyApi } from '../../api/specialtyApi';
import DataTable from '../../api/DataTable';
import Modal from '../../Modal';
import './DoctorManagementPage.css';

const SpecialtyManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data: response, isLoading } = useQuery({ queryKey: ['specialties'], queryFn: specialtyApi.getAll });
  const specialties = response?.data;

  const columns = [
    { header: 'Tên Chuyên khoa', accessor: 'name' },
    { header: 'Mô tả', accessor: 'description' },
  ];

  const createMutation = useMutation({
    mutationFn: specialtyApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); setIsModalOpen(false); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => specialtyApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); setIsModalOpen(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: specialtyApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialties'] })
  });

  const openModal = (item = null) => {
    if (item) {
      setFormData({ name: item.name, description: item.description });
      setEditingId(item.id);
    } else {
      setFormData({ name: '', description: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, data: formData });
    else createMutation.mutate(formData);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Xóa chuyên khoa ${item.name}?`)) deleteMutation.mutate(item.id);
  };

  const renderActions = (item) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openModal(item)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => handleDelete(item)}>Xóa</button>
    </>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Chuyên khoa</h1>
        <button className="add-new-btn" onClick={() => openModal()}>+ Thêm Chuyên khoa</button>
      </header>
      {isLoading ? <p>Đang tải...</p> : <DataTable columns={columns} data={specialties} renderActions={renderActions} />}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên Chuyên khoa</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
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
export default SpecialtyManagementPage;