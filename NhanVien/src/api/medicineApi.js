import axiosClient from './axiosClient';

export const medicineApi = {
  getAll: () => axiosClient.get('/medicines'),
  getById: (id) => axiosClient.get(`/medicines/${id}`),
  create: (data) => axiosClient.post('/medicines', data),
  update: (id, data) => axiosClient.put(`/medicines/${id}`, data),
  delete: (id) => axiosClient.delete(`/medicines/${id}`),
};