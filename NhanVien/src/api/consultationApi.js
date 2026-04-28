import axiosClient from './axiosClient';
import { MOCK_QUEUE, MOCK_MEDICINES, MOCK_SERVICES } from '../pages/Doctor/doctorDashboardData';

export const consultationApi = {
  // 1. Lấy danh sách hàng chờ của bác sĩ
  getQueue: async () => {
    // return axiosClient.get('/doctor/queue'); // <-- KHI CÓ BACKEND THÌ DÙNG DÒNG NÀY
    return new Promise(resolve => setTimeout(() => resolve({ data: MOCK_QUEUE }), 400));
  },

  // 2. Lấy danh mục Thuốc
  getMedicines: async () => {
    // return axiosClient.get('/medicines');
    return new Promise(resolve => setTimeout(() => resolve({ data: MOCK_MEDICINES }), 300));
  },

  // 3. Lấy danh mục Dịch vụ / Cận lâm sàng
  getServices: async () => {
    // return axiosClient.get('/services');
    return new Promise(resolve => setTimeout(() => resolve({ data: MOCK_SERVICES }), 300));
  },

  // 4. Lưu / Hoàn tất ca khám
  finishConsultation: async (patientId, payload) => {
    // return axiosClient.post(`/doctor/consultation/${patientId}/finish`, payload);
    console.log("Dữ liệu đẩy lên Server:", { patientId, payload });
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 600));
  }
};