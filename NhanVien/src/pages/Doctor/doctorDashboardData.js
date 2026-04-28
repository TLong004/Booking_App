export const MOCK_QUEUE = [
  { id: 'Q001', name: 'Nguyễn Văn An', age: 35, gender: 'Nam', status: 'in-progress', time: '08:30', reason: 'Đau đầu, sốt cao 2 ngày', phone: '0901234567' },
  { id: 'Q002', name: 'Trần Thị Bích', age: 28, gender: 'Nữ', status: 'waiting', time: '08:45', reason: 'Đau dạ dày, buồn nôn', phone: '0912345678' },
  { id: 'Q003', name: 'Lê Quốc Cường', age: 45, gender: 'Nam', status: 'waiting', time: '09:00', reason: 'Khám định kỳ tổng quát', phone: '0923456789' },
  { id: 'Q004', name: 'Phạm Thị Dung', age: 60, gender: 'Nữ', status: 'completed', time: '08:00', reason: 'Tái khám huyết áp', phone: '0934567890' },
  { id: 'Q005', name: 'Hoàng Minh Đức', age: 22, gender: 'Nam', status: 'waiting', time: '09:15', reason: 'Ho khan kéo dài 1 tuần', phone: '0945678901' },
];

export const MOCK_MEDICINES = [
  { value: 'M01', label: 'Paracetamol 500mg', unit: 'Viên' },
  { value: 'M02', label: 'Amoxicillin 250mg', unit: 'Viên' },
  { value: 'M03', label: 'Omeprazole 20mg', unit: 'Viên nang' },
  { value: 'M04', label: 'Vitamin C 1000mg', unit: 'Viên sủi' },
  { value: 'M05', label: 'Oresol', unit: 'Gói' },
  { value: 'M06', label: 'Cetirizine 10mg', unit: 'Viên' },
  { value: 'M07', label: 'Ibuprofen 400mg', unit: 'Viên' },
];

export const MOCK_SERVICES = [
  { value: 'S01', label: 'Xét nghiệm máu cơ bản' },
  { value: 'S02', label: 'Siêu âm ổ bụng' },
  { value: 'S03', label: 'X-Quang ngực thẳng' },
  { value: 'S04', label: 'Điện tâm đồ (ECG)' },
  { value: 'S05', label: 'Xét nghiệm nước tiểu' },
];

export const STATUS_CONFIG = {
  waiting:     { label: 'Đang đợi',   color: 'amber' },
  'in-progress': { label: 'Đang khám', color: 'blue' },
  completed:   { label: 'Đã xong',   color: 'green' },
};

export const AVATAR_COLORS = ['#6366f1','#14b8a6','#f59e0b','#ec4899','#10b981','#3b82f6','#ef4444'];
export const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
export const getInitials = (name) => name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

export const TABS = [
  { key: 'info', label: 'Hành chính' },
  { key: 'exam', label: 'Khám & Chẩn đoán' },
  { key: 'rx', label: 'Đơn thuốc & Dịch vụ' },
];