import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorApi } from '../../api/doctorApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './DoctorManagementPage.css';

const DEGREES = ['Bác sĩ', 'Thạc sĩ', 'Tiến sĩ', 'Phó giáo sư', 'Giáo sư'];

const DoctorManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    degree: 'Bác sĩ',
    specialty_name: 'Đa khoa',
    room_number: ''
  });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorApi.getAll,
  });
  const doctors = response?.data;

  const columns = [
    { header: 'Họ và tên',   accessor: 'full_name', cell: (row) => <strong>{row.full_name}</strong> },
    { header: 'Học vị',      accessor: 'degree' },
    { header: 'Chuyên khoa', accessor: 'specialty.name' },
    { header: 'Phòng khám',  accessor: 'room_number' },
  ];

  const openAddModal = () => {
    setFormData({ full_name: '', degree: 'Bác sĩ', specialty_name: 'Đa khoa', room_number: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setFormData({
      full_name:     doctor.full_name,
      degree:        doctor.degree,
      specialty_name: doctor.specialty?.name || '',
      room_number:   doctor.room_number || ''
    });
    setEditingId(doctor.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const createMutation = useMutation({
    mutationFn: doctorApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => doctorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: doctorApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] })
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

  const handleDelete = (doctor) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${doctor.full_name}?`))
      deleteMutation.mutate(doctor.id);
  };

  const renderActions = (doctor) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(doctor)}>Sửa</button>
      <button className="action-btn delete-btn" onClick={() => handleDelete(doctor)}>Xóa</button>
    </>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý bác sĩ</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm bác sĩ mới</button>
      </header>

      {isLoading && <p>Đang tải danh sách bác sĩ...</p>}
      {error && <p className="error-message">Có lỗi xảy ra: {error.message}</p>}
      {doctors && (
        <DataTable columns={columns} data={doctors} renderActions={renderActions} />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required placeholder="VD: TS.BS. Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label>Học vị / Bằng cấp</label>
            <select name="degree" value={formData.degree} onChange={handleInputChange}>
              {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Chuyên khoa</label>
            <input type="text" name="specialty_name" value={formData.specialty_name} onChange={handleInputChange} required placeholder="VD: Tim mạch, Nội khoa..." />
          </div>
          <div className="form-group">
            <label>Phòng khám</label>
            <input type="text" name="room_number" value={formData.room_number} onChange={handleInputChange} placeholder="VD: P101" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorManagementPage;
