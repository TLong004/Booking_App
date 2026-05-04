import axiosClient from './axiosClient';

export const medicineApi = {
  getAll: () => axiosClient.get('/admin/medicines'),
  create: (data) => axiosClient.post('/admin/medicines', data),
  update: (id, data) => axiosClient.put(`/admin/medicines/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/medicines/${id}`),
};