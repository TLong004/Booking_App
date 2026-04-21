import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import DataTable from '../../api/DataTable';
import Modal from '../../Modal';
import './DoctorManagementPage.css'; // Tái sử dụng CSS của trang Bác sĩ cho form

const UserManagementPage = () => {
  const queryClient = useQueryClient();

  // --- STATE QUẢN LÝ MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'ROLE_STAFF'
  });

  // --- LẤY DỮ LIỆU ---
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });
  const users = response?.data;

  // --- CÁC HÀNH ĐỘNG GỌI API (MUTATIONS) ---
  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      alert('🎉 Đã tạo tài khoản Người dùng thành công!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => {
      alert('✅ Đã cập nhật thông tin thành công!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const resetPasswordMutation = useMutation({
    mutationFn: userApi.resetPassword,
    onSuccess: (data, userId) => {
      const user = users.find(u => u.id === userId);
      alert(`🔑 Đã reset mật khẩu cho tài khoản '${user.username}'.\nMật khẩu mới là: ${data.new_password}`);
    }
  });

  // --- XỬ LÝ CLICK CÁC NÚT ---
  const openAddModal = () => {
    setFormData({ username: '', email: '', phone: '', role: 'ROLE_STAFF' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      username: user.username,
      email: user.email || '',
      phone: user.phone || '',
      role: user.roles[0] || 'ROLE_STAFF'
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggleActive = (user) => {
    const action = user.is_active ? 'KHÓA' : 'MỞ KHÓA';
    if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản '${user.username}' không?`)) {
      toggleStatusMutation.mutate({ id: user.id, data: { is_active: !user.is_active } });
    }
  };

  const handleResetPassword = (user) => {
    if (window.confirm(`Xác nhận đưa mật khẩu của '${user.username}' về mặc định?`)) {
      resetPasswordMutation.mutate(user.id);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- ĐỊNH NGHĨA CỘT CHO BẢNG ---
  const columns = [
    { header: 'Tên đăng nhập', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Vai trò', accessor: 'roles', 
      cell: (row) => {
        const roleMap = { 'ROLE_ADMIN': 'Quản trị viên', 'ROLE_DOCTOR': 'Bác sĩ', 'ROLE_HEAD_DEPT': 'Trưởng khoa', 'ROLE_STAFF': 'Lễ tân' };
        return roleMap[row.roles[0]] || row.roles[0];
      } 
    },
    { header: 'Trạng thái', accessor: 'is_active', 
      cell: (row) => (
        <span className={`status-badge ${row.is_active ? 'status-active' : 'status-inactive'}`}>
          {row.is_active ? 'Hoạt động' : 'Bị khóa'}
        </span>
      )
    },
  ];

  const renderUserActions = (user) => (
    <>
      <button className="action-btn edit-btn" onClick={() => openEditModal(user)}>Sửa</button>
      <button className={`action-btn ${user.is_active ? 'delete-btn' : 'activate-btn'}`} onClick={() => handleToggleActive(user)}>
        {user.is_active ? 'Khóa' : 'Mở'}
      </button>
      <button className="action-btn" style={{backgroundColor: '#f3f4f6', color: '#4b5563'}} onClick={() => handleResetPassword(user)}>Reset Pass</button>
    </>
  );

  // Custom function to render special cells (like badges)
  const renderCell = (row, col) => {
    if (col.cell) return col.cell(row);
    return row[col.accessor];
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Quản lý Hệ thống Người dùng</h1>
        <button className="add-new-btn" onClick={openAddModal}>+ Thêm Người dùng</button>
      </header>

      {isLoading && <p>Đang tải danh sách...</p>}
      {error && <p className="error-message">Lỗi: {error.message}</p>}
      
      {users && (
        // Tạo một bảng DataTable tùy chỉnh nhẹ để hỗ trợ render Badge trạng thái
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col.accessor}>{col.header}</th>)}
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  {columns.map(col => <td key={col.accessor}>{renderCell(user, col)}</td>)}
                  <td className="actions-cell">{renderUserActions(user)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THÊM/SỬA NGƯỜI DÙNG */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}>
        <form onSubmit={handleFormSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên đăng nhập (Username)</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} required disabled={!!editingId} placeholder="Nhập tên đăng nhập viết liền không dấu" />
            {editingId && <small style={{color: '#9ca3af', fontSize: '12px'}}>Không thể thay đổi tên đăng nhập sau khi tạo.</small>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Cấp quyền hệ thống (Role)</label>
            <select name="role" value={formData.role} onChange={handleInputChange} required>
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
              <option value="ROLE_HEAD_DEPT">Trưởng khoa</option>
              <option value="ROLE_DOCTOR">Bác sĩ</option>
              <option value="ROLE_STAFF">Lễ tân / Thu ngân</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? 'Đang lưu...' : 'Lưu tài khoản'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;