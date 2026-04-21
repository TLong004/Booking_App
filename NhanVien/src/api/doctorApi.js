import axiosClient from './axiosClient';

// --- MOCK DATA (Xóa khi có API thật) ---
let mockDoctors = [
  { id: 1, full_name: 'TS.BS. Nguyễn Văn A', degree: 'Tiến sĩ', specialty: { name: 'Tim mạch' }, room_number: 'P101' },
  { id: 2, full_name: 'ThS.BS. Trần Thị B', degree: 'Thạc sĩ', specialty: { name: 'Nội tiết' }, room_number: 'P102' },
  { id: 3, full_name: 'BSCKII. Lê Văn C', degree: 'BSCKII', specialty: { name: 'Da liễu' }, room_number: 'P205' },
  { id: 4, full_name: 'BS. Phạm Thị D', degree: 'Bác sĩ', specialty: { name: 'Nhi khoa' }, room_number: 'P301' },
];
// ------------------------------------

export const doctorApi = {
  // Lấy tất cả bác sĩ
  getAll: async () => {
    // --- Giả lập gọi API (Xóa khi có API thật) ---
    console.log("Fetching mock doctors...");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: [...mockDoctors] }); // API thật thường trả về trong response.data
      }, 500);
    });
    // --- Code thật khi có API: return axiosClient.get('/doctors'); ---
  },

  // --- CÁC HÀM GIẢ LẬP CRUD ---
  create: async (data) => {
    return new Promise(resolve => setTimeout(() => {
      const newDoctor = { 
        id: Date.now(), 
        full_name: data.full_name, 
        degree: data.degree, 
        room_number: data.room_number,
        specialty: { name: data.specialty_name } 
      };
      mockDoctors.push(newDoctor);
      resolve({ data: newDoctor });
    }, 400));
  },

  update: async (id, data) => {
    return new Promise(resolve => setTimeout(() => {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDoctors[index] = { ...mockDoctors[index], ...data, specialty: { name: data.specialty_name || mockDoctors[index].specialty.name } };
      }
      resolve({ data: mockDoctors[index] });
    }, 400));
  },

  delete: async (id) => {
    return new Promise(resolve => setTimeout(() => {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) mockDoctors.splice(index, 1);
      resolve({ success: true });
    }, 400));
  }
};