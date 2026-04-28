import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtyApi } from '../../api/specialtyApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './DoctorManagementPage.css';

const SpecialtyManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: specialtyApi.getAll,
  });
  const specialties = response?.data;

  const columns = [
    { header: 'Tên chuyên khoa', accessor: 'name', cell: (row) => <strong>{row.name}</strong> },
    { header: 'Mô tả', accessor: 'description' },
  ];

  const openAddModal = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (spec) => {
    setFormData({ name: spec.name, description: spec.description || '' });
    setEditingId(spec.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const createMutation = useMutation({
    mutationFn: specialtyApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); closeModal(); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => specialtyApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['specialties'] }); closeModal(); }
  });

  const deleteMutation = useMutation({
    mutationFn: specialtyApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialties'] })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, data: formData });
    else createMutation.mutate(formData);
  };

  const handleDelete = (spec) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên khoa ${spec.name}?`))
      deleteMutation.mutate(spec.id);
  };

  const renderActions = (spec) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(spec)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => handleDelete(spec)}>Xóa</button>
    </>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Chuyên khoa</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm chuyên khoa</button>
      </header>
      {isLoading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error-message">Có lỗi xảy ra: {error.message}</p>}
      {specialties && <DataTable columns={columns} data={specialties} renderActions={renderActions} />}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group"><label>Tên chuyên khoa</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="VD: Khoa Nội, Khoa Ngoại..." /></div>
          <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Mô tả chức năng chuyên khoa..." /></div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button><button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default SpecialtyManagementPage;