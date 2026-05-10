import axiosClient from './axiosClient';

export const adminApi = {
  // ── Dashboard ──────────────────────────────────────────────────────────
  getDashboardStats: () => axiosClient.get('/admin/dashboard/stats'),
  getRecentAppointments: () => axiosClient.get('/admin/dashboard/recent-appointments'),
  getLowStockAlerts: (threshold = 20) =>
    axiosClient.get('/admin/dashboard/low-stock-alerts', { params: { threshold } }),

  // ── Người dùng (Users) ─────────────────────────────────────────────────
  getAllUsers: () => axiosClient.get('/admin/users', { params: { size: 1000 } }),
  createUser: (data) => axiosClient.post('/admin/users', data),
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => axiosClient.patch(`/admin/users/${id}/toggle-status`),
  resetPassword: (id, newPassword) =>
    axiosClient.post(`/admin/users/${id}/reset-password`, { newPassword }),

  // ── Bác sĩ (Doctors) ───────────────────────────────────────────────────
  getAllDoctors: () => axiosClient.get('/admin/doctors', { params: { size: 1000 } }),
  getDoctorById: (id) => axiosClient.get(`/admin/doctors/${id}`),
  createDoctor: (data) => axiosClient.post('/admin/doctors', data),
  updateDoctor: (id, data) => axiosClient.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => axiosClient.delete(`/admin/doctors/${id}`),

  // ── Chuyên khoa (Specialties) ──────────────────────────────────────────
  getAllSpecialties: () => axiosClient.get('/admin/specialties', { params: { size: 1000 } }),
  createSpecialty: (data) => axiosClient.post('/admin/specialties', data),
  updateSpecialty: (id, data) => axiosClient.put(`/admin/specialties/${id}`, data),
  deleteSpecialty: (id) => axiosClient.delete(`/admin/specialties/${id}`),

  // ── Dịch vụ (Services) ─────────────────────────────────────────────────
  getAllServices: () => axiosClient.get('/admin/services', { params: { size: 1000 } }),
  createService: (data) => axiosClient.post('/admin/services', data),
  updateService: (id, data) => axiosClient.put(`/admin/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/admin/services/${id}`),

  // ── Thuốc (Medicines) ──────────────────────────────────────────────────
  getAllMedicines: () => axiosClient.get('/admin/medicines', { params: { size: 1000 } }),
  createMedicine: (data) => axiosClient.post('/admin/medicines', data),
  updateMedicine: (id, data) => axiosClient.put(`/admin/medicines/${id}`, data),
  deleteMedicine: (id) => axiosClient.delete(`/admin/medicines/${id}`),
  importMedicineStock: (id, quantity) =>
    axiosClient.patch(`/admin/medicines/${id}/import`, { quantity }),
  exportMedicines: () => axiosClient.get('/admin/medicines/export', { responseType: 'blob' }),

  // ── Lịch hẹn (Appointments) ────────────────────────────────────────────
  getAllAppointments: () => axiosClient.get('/admin/appointments', { params: { size: 1000 } }),
  getAppointmentById: (id) => axiosClient.get(`/admin/appointments/${id}`),
  updateAppointmentStatus: (id, status, cancelReason, noShowReason) =>
    axiosClient.put(`/admin/appointments/${id}/status`, { status, cancelReason, noShowReason }),
  checkInLate: (id) => axiosClient.patch(`/admin/appointments/${id}/check-in`),

  // ── Bệnh nhân (Patients) ───────────────────────────────────────────────
  getAllPatients: () => axiosClient.get('/admin/patients', { params: { size: 1000 } }),
  getPatientById: (id) => axiosClient.get(`/admin/patients/${id}`),

  // ── Hóa đơn (Invoices) ─────────────────────────────────────────────────
  getAllInvoices: () => axiosClient.get('/admin/invoices', { params: { size: 1000 } }),
  getInvoiceById: (id) => axiosClient.get(`/admin/invoices/${id}`),
  updateInvoiceStatus: (id, status) =>
    axiosClient.put(`/admin/invoices/${id}/status`, { status }),

  // ── Báo cáo (Reports) ──────────────────────────────────────────────────
  getRevenueReport: (startDate, endDate) =>
    axiosClient.get('/admin/reports/revenue', { params: { startDate, endDate } }),
  getAppointmentsReport: (startDate, endDate) =>
    axiosClient.get('/admin/reports/appointments', { params: { startDate, endDate } }),
  getTopServices: () => axiosClient.get('/admin/reports/top-services'),
  getTopMedicines: () => axiosClient.get('/admin/reports/top-medicines'),

  // ── Đánh giá (Reviews) ─────────────────────────────────────────────────
  getAllReviews: () => axiosClient.get('/admin/reviews', { params: { size: 1000 } }),
  deleteReview: (id) => axiosClient.delete(`/admin/reviews/${id}`),
};
