import axiosClient from './axiosClient';

export const serviceApi = {
  getAll: () => axiosClient.get('/admin/services'),
  create: (data) => axiosClient.post('/admin/services', data),
  update: (id, data) => axiosClient.put(`/admin/services/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/services/${id}`),
};