import axiosClient from './axiosClient';

export const adminApi = {
  // Quản lý người dùng
  getAllUsers: async () => {
    const response = await axiosClient.get('/admin/users');
    return response.data;
  },
  createUser: async (userData) => {
    const response = await axiosClient.post('/admin/users', userData);
    return response.data;
  },
  
  // Quản lý chuyên khoa
  getAllSpecialties: async () => {
    const response = await axiosClient.get('/admin/specialties');
    return response.data;
  },
  createSpecialty: async (specialtyData) => {
    const response = await axiosClient.post('/admin/specialties', specialtyData);
    return response.data;
  },
  
  // Quản lý dịch vụ
  getAllServices: async () => {
    const response = await axiosClient.get('/admin/services');
    return response.data;
  },
  getServicesBySpecialty: async (specialtyId) => {
    const response = await axiosClient.get(`/admin/specialties/${specialtyId}/services`);
    return response.data;
  },
  createService: async (serviceData) => {
    const response = await axiosClient.post('/admin/services', serviceData);
    return response.data;
  }
};