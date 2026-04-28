import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './DoctorManagementPage.css';

const ROLE_MAP = {
  ROLE_ADMIN:    'Quản trị viên',
  ROLE_DOCTOR:   'Bác sĩ',
  ROLE_HEAD_DEPT:'Trưởng khoa',
  ROLE_STAFF:    'Lễ tân',
};

const ROLE_BADGE_STYLES = {
  ROLE_ADMIN:    { background: '#dbeafe', color: '#1e40af' },
  ROLE_DOCTOR:   { background: '#fef3c7', color: '#92400e' },
  ROLE_HEAD_DEPT:{ background: '#f3e8ff', color: '#6b21a8' },
  ROLE_STAFF:    { background: '#f0fdf4', color: '#166534' },
};

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', role: 'ROLE_STAFF' });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });
  const users = response?.data;

  const columns = [
    { header: 'Tên đăng nhập', accessor: 'username', cell: (row) => <strong>{row.username}</strong> },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Vai trò', accessor: 'roles',
      cell: (row) => {
        const role = row.roles?.[0];
        const style = ROLE_BADGE_STYLES[role] || { background: '#f3f4f6', color: '#374151' };
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 500, ...style }}>
            {ROLE_MAP[role] || role}
          </span>
        );
      }
    },
    {
      header: 'Trạng thái', accessor: 'is_active',
      cell: (row) => (
        <span className={`status-badge ${row.is_active ? 'status-active' : 'status-inactive'}`}>
          {row.is_active ? 'Hoạt động' : 'Bị khóa'}
        </span>
      )
    },
  ];

  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); closeModal(); }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); closeModal(); }
  });
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
  const resetPasswordMutation = useMutation({
    mutationFn: userApi.resetPassword,
    onSuccess: (data, userId) => {
      const user = users.find(u => u.id === userId);
      alert(`Đã reset mật khẩu cho '${user?.username}'.\nMật khẩu mới: ${data.new_password}`);
    }
  });

  const openAddModal = () => {
    setFormData({ username: '', email: '', phone: '', role: 'ROLE_STAFF' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({ username: user.username, email: user.email || '', phone: user.phone || '', role: user.roles?.[0] || 'ROLE_STAFF' });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggleActive = (user) => {
    const action = user.is_active ? 'KHÓA' : 'MỞ KHÓA';
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản '${user.username}'?`))
      toggleStatusMutation.mutate({ id: user.id, data: { is_active: !user.is_active } });
  };

  const handleResetPassword = (user) => {
    if (window.confirm(`Đặt lại mật khẩu cho '${user.username}'?`))
      resetPasswordMutation.mutate(user.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateMutation.mutate({ id: editingId, data: formData });
    else createMutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderActions = (user) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(user)}>Sửa</button>
      <button className={`action-btn ${user.is_active ? 'delete-btn' : 'activate-btn'}`} onClick={() => handleToggleActive(user)}>
        {user.is_active ? 'Khóa' : 'Mở khóa'}
      </button>
      <button className="action-btn" style={{ background: '#f3f4f6', color: '#4b5563' }} onClick={() => handleResetPassword(user)}>
        Reset pass
      </button>
    </>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý hệ thống người dùng</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm người dùng</button>
      </header>

      {isLoading && <p>Đang tải danh sách...</p>}
      {error && <p className="error-message">Lỗi: {error.message}</p>}
      {users && <DataTable columns={columns} data={users} renderActions={renderActions} />}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} required disabled={!!editingId} placeholder="Viết liền không dấu" />
            {editingId && <small style={{ color: '#9ca3af', fontSize: 12 }}>Không thể thay đổi tên đăng nhập sau khi tạo.</small>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="example@medclinic.vn" />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="0901 234 567" />
          </div>
          <div className="form-group">
            <label>Vai trò</label>
            <select name="role" value={formData.role} onChange={handleInputChange} required>
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
              <option value="ROLE_HEAD_DEPT">Trưởng khoa</option>
              <option value="ROLE_DOCTOR">Bác sĩ</option>
              <option value="ROLE_STAFF">Lễ tân / Thu ngân</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu tài khoản'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
