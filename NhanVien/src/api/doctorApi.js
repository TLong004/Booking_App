import axiosClient from './axiosClient';

export const doctorApi = {
  getAll: () => axiosClient.get('/doctors'),
  create: (data) => axiosClient.post('/doctors', data),
  update: (id, data) => axiosClient.put(`/doctors/${id}`, data),
  delete: (id) => axiosClient.delete(`/doctors/${id}`),
};