let mockMedicines = [
  { id: 1, name: 'Paracetamol 500mg', unit: 'Viên', price: 2000, stock_quantity: 1500 },
  { id: 2, name: 'Amoxicillin', unit: 'Vỉ', price: 15000, stock_quantity: 200 },
  { id: 3, name: 'Vitamin C sủi', unit: 'Tuýp', price: 35000, stock_quantity: 50 },
];

export const medicineApi = {
  getAll: async () => new Promise(resolve => setTimeout(() => resolve({ data: [...mockMedicines] }), 300)),
  create: async (data) => new Promise(resolve => setTimeout(() => {
    const newObj = { id: Date.now(), ...data };
    mockMedicines.push(newObj);
    resolve({ data: newObj });
  }, 300)),
  update: async (id, data) => new Promise(resolve => setTimeout(() => {
    const index = mockMedicines.findIndex(x => x.id === id);
    if (index !== -1) mockMedicines[index] = { ...mockMedicines[index], ...data };
    resolve({ data: mockMedicines[index] });
  }, 300)),
  delete: async (id) => new Promise(resolve => setTimeout(() => {
    mockMedicines = mockMedicines.filter(x => x.id !== id);
    resolve({ success: true });
  }, 300))
};