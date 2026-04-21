let mockSpecialties = [
  { id: 1, name: 'Khoa Nội Tim Mạch', description: 'Khám và điều trị các bệnh lý tim mạch.', icon_url: '' },
  { id: 2, name: 'Khoa Nhi', description: 'Chăm sóc sức khỏe trẻ em dưới 15 tuổi.', icon_url: '' },
  { id: 3, name: 'Khoa Răng Hàm Mặt', description: 'Khám nha khoa tổng quát và chuyên sâu.', icon_url: '' },
];

export const specialtyApi = {
  getAll: async () => new Promise(resolve => setTimeout(() => resolve({ data: [...mockSpecialties] }), 300)),
  create: async (data) => new Promise(resolve => setTimeout(() => {
    const newObj = { id: Date.now(), ...data };
    mockSpecialties.push(newObj);
    resolve({ data: newObj });
  }, 300)),
  update: async (id, data) => new Promise(resolve => setTimeout(() => {
    const index = mockSpecialties.findIndex(x => x.id === id);
    if (index !== -1) mockSpecialties[index] = { ...mockSpecialties[index], ...data };
    resolve({ data: mockSpecialties[index] });
  }, 300)),
  delete: async (id) => new Promise(resolve => setTimeout(() => {
    mockSpecialties = mockSpecialties.filter(x => x.id !== id);
    resolve({ success: true });
  }, 300))
};