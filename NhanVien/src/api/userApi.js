// --- MOCK DATA (Xóa khi có API thật) ---
let mockUsers = [
  { id: 1, username: 'admin', email: 'admin@clinic.com', phone: '0901112221', is_active: true, roles: ['ROLE_ADMIN'] },
  { id: 2, username: 'bs.thanh', email: 'thanh.bs@clinic.com', phone: '0901112222', is_active: true, roles: ['ROLE_DOCTOR'] },
  { id: 3, username: 'bs.tuan', email: 'tuan.bs@clinic.com', phone: '0901112223', is_active: false, roles: ['ROLE_DOCTOR'] },
  { id: 4, username: 'letan01', email: 'letan01@clinic.com', phone: '0901112224', is_active: true, roles: ['ROLE_STAFF'] },
  { id: 5, username: 'truongkhoa.tim', email: 'head.cardio@clinic.com', phone: '0901112225', is_active: true, roles: ['ROLE_HEAD_DEPT'] },
];
// ------------------------------------

export const userApi = {
  // Lấy danh sách
  getAll: async () => new Promise(resolve => setTimeout(() => resolve({ data: [...mockUsers] }), 400)),

  // Thêm mới
  create: async (data) => {
    return new Promise(resolve => setTimeout(() => {
      const newUser = { 
        id: Date.now(), 
        username: data.username,
        email: data.email,
        phone: data.phone,
        roles: [data.role], // Đưa string role vào mảng
        is_active: true, // Mặc định tạo ra là hoạt động
      };
      mockUsers.push(newUser);
      resolve({ data: newUser });
    }, 400));
  },

  // Cập nhật thông tin hoặc trạng thái
  update: async (id, data) => {
    return new Promise(resolve => setTimeout(() => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        const updatedRoles = data.role ? [data.role] : mockUsers[index].roles;
        mockUsers[index] = { ...mockUsers[index], ...data, roles: updatedRoles };
      }
      resolve({ data: mockUsers[index] });
    }, 400));
  },

  // Reset mật khẩu
  resetPassword: async (id) => {
    return new Promise(resolve => setTimeout(() => {
      const user = mockUsers.find(u => u.id === id);
      console.log(`(MOCK) Mật khẩu cho ${user.username} đã được reset về mặc định`);
      resolve({ success: true, new_password: 'Password@123' });
    }, 500));
  }
};