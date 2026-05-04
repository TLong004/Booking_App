import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import DataTable from './DataTable';
import Modal from './Modal';
import './AdminDashboard.css';

const ROLES = [
  { value: 'ROLE_ADMIN',     label: 'Admin',       badgeClass: 'badge badge-red'    },
  { value: 'ROLE_HEAD_DEPT', label: 'Head Dept',   badgeClass: 'badge badge-purple' },
  { value: 'ROLE_DOCTOR',    label: 'Doctor',      badgeClass: 'badge badge-blue'   },
  { value: 'ROLE_STAFF',     label: 'Staff',       badgeClass: 'badge badge-orange' },
];

const DEGREES = ['Bác sĩ', 'Thạc sĩ', 'Tiến sĩ', 'Phó giáo sư', 'Giáo sư'];

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.value, r]));

const DOCTOR_ROLES = ['ROLE_DOCTOR', 'ROLE_HEAD_DEPT'];

const EMPTY_FORM = {
  username: '', password: '', email: '', phone: '', fullName: '',
  roleName: '', isActive: true,
  // Doctor-specific
  specialtyId: '', degree: 'Bác sĩ', roomNumber: '', consultationFee: '', bio: '',
};

const UserManagementPage = () => {
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch]     = useState('');
  const [filterRole, setRole]   = useState('');
  const [filterStatus, setStatus] = useState('');

  // Modal
  const [isOpen, setIsOpen]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  // Data
  const { data: usersRes, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getAllUsers,
  });
  const { data: specialtiesRes } = useQuery({
    queryKey: ['specialties'],
    queryFn: adminApi.getAllSpecialties,
  });

  const users      = usersRes?.data ?? [];
  const specialties = specialtiesRes?.data ?? [];

  // Filtered list
  const filtered = useMemo(() => {
    return users.filter(u => {
      const roleStr = u.roles?.[0]?.roleName ?? '';
      const matchSearch = !search ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole   = !filterRole   || roleStr === filterRole;
      const matchStatus = !filterStatus ||
        (filterStatus === 'active' ? u.isActive : !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateUser(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (user) => {
    setForm({
      username:        user.username,
      password:        '',
      email:           user.email ?? '',
      phone:           user.phone ?? '',
      fullName:        user.fullName ?? '',
      roleName:        user.roles?.[0]?.roleName ?? '',
      isActive:        user.isActive ?? true,
      specialtyId:     user.doctor?.specialtyId ?? '',
      degree:          user.doctor?.degree ?? 'Bác sĩ',
      roomNumber:      user.doctor?.roomNumber ?? '',
      consultationFee: user.doctor?.consultationFee ?? '',
      bio:             user.doctor?.bio ?? '',
    });
    setEditingId(user.id);
    setIsOpen(true);
  };

  const closeModal = () => { setIsOpen(false); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.password && editingId) delete payload.password; // don't send empty pw on edit
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Xóa tài khoản "${user.username}"?`))
      deleteMutation.mutate(user.id);
  };

  const isDoctor = DOCTOR_ROLES.includes(form.roleName);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns = [
    { header: 'Tên đăng nhập', accessor: 'username', width: '18%', cell: r => <strong>{r.username}</strong> },
    { header: 'Email',         accessor: 'email',    width: '24%' },
    { header: 'Điện thoại',    accessor: 'phone',    width: '16%' },
    {
      header: 'Vai trò', accessor: 'roles', width: '16%',
      cell: r => {
        const roleName = r.roles?.[0]?.roleName ?? '';
        const meta = ROLE_MAP[roleName];
        return meta
          ? <span className={meta.badgeClass}>{meta.label}</span>
          : <span className="badge badge-gray">{roleName}</span>;
      },
    },
    {
      header: 'Trạng thái', accessor: 'isActive', width: '12%',
      cell: r => (
        <span className={`badge ${r.isActive ? 'badge-green' : 'badge-red'}`}>
          {r.isActive ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <button className="add-btn" onClick={openAdd}>+ Thêm người dùng</button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterRole} onChange={e => setRole(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Vô hiệu</option>
        </select>
        <span className="count-label">{filtered.length} kết quả</span>
      </div>

      {isLoading && <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>}
      {error && <p className="error-message">Lỗi: {error.message}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        renderActions={user => (
          <>
            <button className="action-btn edit-btn"   onClick={() => openEdit(user)}>Sửa</button>
            <button className="action-btn delete-btn" onClick={() => handleDelete(user)}>Xóa</button>
          </>
        )}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Tên đăng nhập *</label>
              <input name="username" value={form.username} onChange={handleChange} required placeholder="VD: bs.nguyenvana" />
            </div>
            <div className="form-group">
              <label>{editingId ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} placeholder="Tối thiểu 8 ký tự" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@clinic.vn" />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="0901 234 567" />
            </div>
          </div>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Vai trò *</label>
              <select name="roleName" value={form.roleName} onChange={handleChange} required>
                <option value="">-- Chọn vai trò --</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select name="isActive" value={form.isActive ? '1' : '0'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === '1' }))}>
                <option value="1">Hoạt động</option>
                <option value="0">Vô hiệu hóa</option>
              </select>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {isDoctor && (
            <>
              <div className="section-divider">Thông tin bác sĩ</div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Học vị *</label>
                  <select name="degree" value={form.degree} onChange={handleChange} required>
                    {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phòng khám</label>
                  <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="VD: P101" />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Chuyên khoa *</label>
                  <select name="specialtyId" value={form.specialtyId} onChange={handleChange} required>
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phí khám (VNĐ)</label>
                  <input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} placeholder="150000" />
                </div>
              </div>
              <div className="form-group">
                <label>Tiểu sử / Giới thiệu</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} placeholder="Kinh nghiệm, chuyên môn..." />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu người dùng'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
