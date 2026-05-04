import axiosClient from './axiosClient';

export const adminApi = {
  // Quản lý Người dùng
  getAllUsers: () => axiosClient.get('/admin/users'),
  createUser: (data) => axiosClient.post('/admin/users', data),
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

  // Quản lý Chuyên khoa
  getAllSpecialties: () => axiosClient.get('/admin/specialties'),
  createSpecialty: (data) => axiosClient.post('/admin/specialties', data),
  updateSpecialty: (id, data) => axiosClient.put(`/admin/specialties/${id}`, data),
  deleteSpecialty: (id) => axiosClient.delete(`/admin/specialties/${id}`),
};