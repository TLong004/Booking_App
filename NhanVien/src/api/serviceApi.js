let mockServices = [
  { id: 1, name: 'Khám tổng quát', price: 200000, description: 'Khám lâm sàng toàn diện' },
  { id: 2, name: 'Siêu âm ổ bụng', price: 150000, description: 'Siêu âm màu 4D' },
  { id: 3, name: 'Xét nghiệm máu cơ bản', price: 350000, description: 'Công thức máu 24 chỉ số' },
];

export const serviceApi = {
  getAll: async () => new Promise(resolve => setTimeout(() => resolve({ data: [...mockServices] }), 300)),
  create: async (data) => new Promise(resolve => setTimeout(() => {
    const newObj = { id: Date.now(), ...data };
    mockServices.push(newObj);
    resolve({ data: newObj });
  }, 300)),
  update: async (id, data) => new Promise(resolve => setTimeout(() => {
    const index = mockServices.findIndex(x => x.id === id);
    if (index !== -1) mockServices[index] = { ...mockServices[index], ...data };
    resolve({ data: mockServices[index] });
  }, 300)),
  delete: async (id) => new Promise(resolve => setTimeout(() => {
    mockServices = mockServices.filter(x => x.id !== id);
    resolve({ success: true });
  }, 300))
};