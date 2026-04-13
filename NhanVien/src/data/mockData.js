// ─────────────────── mock patients ───────────────────
export const MOCK_PATIENTS = [
  {
    id: 'BN41D394F7',
    name: 'Nguyễn Ngọc Tuyết Vi',
    gender: 'Nữ',
    dob: '22/12/2023',
    phone: '0194829485',
    cccd: 'Đang cập nhật',
    address: 'Huyện An Lão, Tỉnh Bình Định',
  },
  {
    id: 'Đang cập nhật',
    name: 'Nguyễn Minh Mẫn',
    gender: 'Nam',
    dob: '17/08/1995',
    phone: '0654987321',
    cccd: '13579246801',
    address: 'Huyện Cờ Đỏ, Thành phố Cần Thơ',
  },
  {
    id: 'BNE8DB679D',
    name: 'Trần Thị Hoa',
    gender: 'Nữ',
    dob: '05/03/1990',
    phone: '0912345678',
    cccd: 'Đang cập nhật',
    address: 'Quận 1, Thành phố Hồ Chí Minh',
  },
  {
    id: 'BN72C881A2',
    name: 'Lê Văn Bình',
    gender: 'Nam',
    dob: '14/11/1988',
    phone: '0987654321',
    cccd: '98765432100',
    address: 'Quận Hải Châu, Thành phố Đà Nẵng',
  },
];

// ─────────────────── chuyên khoa ───────────────────
export const CHUYEN_KHOA = [
  'Chuyên khoa', 'Da liễu', 'Răng - hàm - mặt', 'Tim mạch', 'Phổi',
  'Thần kinh', 'Mắt', 'Tiêu hoá - gan - mật', 'Tai mũi họng',
  'Tổng quát', 'Nhi', 'Tâm thần kinh', 'Sản - Phụ khoa', 'Vú',
  'Phục hồi chức năng', 'Cơ - Xương khớp',
];

// ─────────────────── bác sĩ ───────────────────
// Mỗi bác sĩ có thêm: gender, room (phòng khám), fee (phí khám), session (buổi: 'Buổi sáng'|'Buổi chiều'), currentQueue (số thứ tự hiện tại)
export const BAC_SI_DATA = {
  'Da liễu': [
    { id: 'bs1', name: 'BS. Nguyễn Thị Lan', spec: 'Da liễu', gender: 'Nữ', room: 'A201', fee: '150.000 VNĐ', session: 'Buổi sáng', currentQueue: 3 },
    { id: 'bs2', name: 'BS. Trần Văn Nam', spec: 'Da liễu', gender: 'Nam', room: 'A202', fee: '150.000 VNĐ', session: 'Buổi chiều', currentQueue: 0 },
    { id: 'bs3', name: 'BS. Lê Thanh Hương', spec: 'Da liễu', gender: 'Nữ', room: 'A203', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 7 },
  ],
  'Răng - hàm - mặt': [
    { id: 'bs4', name: 'BS. Võ Thành Tâm', spec: 'Răng - hàm - mặt', gender: 'Nam', room: 'B101', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 5 },
    { id: 'bs5', name: 'BS. Nguyễn Hồng Vân', spec: 'Răng - hàm - mặt', gender: 'Nữ', room: 'B102', fee: '200.000 VNĐ', session: 'Buổi chiều', currentQueue: 2 },
  ],
  'Tim mạch': [
    { id: 'bs6', name: 'PGS. Lê Minh Đức', spec: 'Tim mạch', gender: 'Nam', room: 'C301', fee: '300.000 VNĐ', session: 'Buổi chiều', currentQueue: 0 },
    { id: 'bs7', name: 'BS. Phạm Thị Hà', spec: 'Tim mạch', gender: 'Nữ', room: 'C302', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 4 },
  ],
  'Phổi': [
    { id: 'bs8', name: 'BS. Hoàng Văn Minh', spec: 'Phổi', gender: 'Nam', room: 'D101', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 6 },
  ],
  'Thần kinh': [
    { id: 'bs9', name: 'TS Phạm Nguyễn Bảo Quốc', spec: 'Thần kinh', gender: 'Nam', room: 'B101', fee: '200.000 VNĐ', session: 'Buổi chiều', currentQueue: 0 },
    { id: 'bs10', name: 'PGS Phương Lâm Trường', spec: 'Thần kinh', gender: 'Nam', room: 'B102', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 0 },
    { id: 'bs11', name: 'BS Vũ Thị Thuý', spec: 'Thần kinh', gender: 'Nữ', room: 'B101', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 0 },
  ],
  'Mắt': [
    { id: 'bs12', name: 'BS. Đinh Quốc Bảo', spec: 'Mắt', gender: 'Nam', room: 'E201', fee: '150.000 VNĐ', session: 'Buổi sáng', currentQueue: 8 },
    { id: 'bs13', name: 'BS. Vũ Thị Ngọc', spec: 'Mắt', gender: 'Nữ', room: 'E202', fee: '200.000 VNĐ', session: 'Buổi chiều', currentQueue: 1 },
  ],
  'Tiêu hoá - gan - mật': [
    { id: 'bs14', name: 'BS. Lâm Chí Phúc', spec: 'Tiêu hoá - gan - mật', gender: 'Nam', room: 'F101', fee: '250.000 VNĐ', session: 'Buổi sáng', currentQueue: 11 },
  ],
  'Tai mũi họng': [
    { id: 'bs15', name: 'BS. Ngô Thanh Tùng', spec: 'Tai mũi họng', gender: 'Nam', room: 'G201', fee: '150.000 VNĐ', session: 'Buổi sáng', currentQueue: 4 },
    { id: 'bs16', name: 'BS. Phan Thị Mai', spec: 'Tai mũi họng', gender: 'Nữ', room: 'G202', fee: '150.000 VNĐ', session: 'Buổi chiều', currentQueue: 2 },
  ],
  'Tổng quát': [
    { id: 'bs17', name: 'BS. Nguyễn Văn Bình', spec: 'Tổng quát', gender: 'Nam', room: 'A101', fee: '100.000 VNĐ', session: 'Buổi sáng', currentQueue: 15 },
    { id: 'bs18', name: 'BS. Trần Thị Cúc', spec: 'Tổng quát', gender: 'Nữ', room: 'A102', fee: '100.000 VNĐ', session: 'Buổi chiều', currentQueue: 9 },
  ],
  'Nhi': [
    { id: 'bs19', name: 'BS. Đặng Thanh Mai', spec: 'Nhi', gender: 'Nữ', room: 'H101', fee: '150.000 VNĐ', session: 'Buổi sáng', currentQueue: 12 },
    { id: 'bs20', name: 'PGS. Hoàng Văn Tú', spec: 'Nhi', gender: 'Nam', room: 'H102', fee: '250.000 VNĐ', session: 'Buổi chiều', currentQueue: 3 },
  ],
  'Tâm thần kinh': [
    { id: 'bs21', name: 'TS. Bùi Thị Phương', spec: 'Tâm thần kinh', gender: 'Nữ', room: 'I201', fee: '300.000 VNĐ', session: 'Buổi sáng', currentQueue: 2 },
  ],
  'Sản - Phụ khoa': [
    { id: 'bs22', name: 'BS. Nguyễn Thị Thu', spec: 'Sản - Phụ khoa', gender: 'Nữ', room: 'J101', fee: '200.000 VNĐ', session: 'Buổi sáng', currentQueue: 6 },
    { id: 'bs23', name: 'BS. Lý Hoàng Oanh', spec: 'Sản - Phụ khoa', gender: 'Nữ', room: 'J102', fee: '200.000 VNĐ', session: 'Buổi chiều', currentQueue: 4 },
  ],
  'Vú': [
    { id: 'bs24', name: 'BS. Đỗ Minh Châu', spec: 'Vú', gender: 'Nữ', room: 'J201', fee: '250.000 VNĐ', session: 'Buổi sáng', currentQueue: 1 },
  ],
  'Phục hồi chức năng': [
    { id: 'bs25', name: 'BS. Cao Thị Hạnh', spec: 'Phục hồi chức năng', gender: 'Nữ', room: 'K101', fee: '150.000 VNĐ', session: 'Buổi sáng', currentQueue: 5 },
  ],
  'Cơ - Xương khớp': [
    { id: 'bs26', name: 'GS. Phạm Ngọc Trung', spec: 'Cơ - Xương khớp', gender: 'Nam', room: 'L301', fee: '300.000 VNĐ', session: 'Buổi sáng', currentQueue: 7 },
    { id: 'bs27', name: 'BS. Vũ Hải Long', spec: 'Cơ - Xương khớp', gender: 'Nam', room: 'L302', fee: '200.000 VNĐ', session: 'Buổi chiều', currentQueue: 0 },
  ],
};

export const MOCK_QUEUE = [
  { id: 'STT-001', patientId: 'BN-2025-014', name: 'Trần Thị Bích Ngọc', gender: 'Nữ',  dob: '12/03/1997', address: 'Thành phố Hà Nội',     reason: 'Đau răng hàm trên bên phải',         checkedIn: '07:42', status: 'waiting' },
  { id: 'STT-002', patientId: 'BN-2025-021', name: 'Lê Minh Tuấn',        gender: 'Nam', dob: '05/07/1990', address: 'Tỉnh Hải Dương',        reason: 'Chảy máu chân răng kéo dài',         checkedIn: '07:55', status: 'examining' },
  { id: 'STT-003', patientId: 'BN-2025-008', name: 'Nguyễn Thị Hà',       gender: 'Nữ',  dob: '20/11/1985', address: 'Tỉnh Tuyên Quang',      reason: 'Đau nhức toàn bộ hàm dưới, sưng má', checkedIn: '08:10', status: 'waiting' },
  { id: 'STT-004', patientId: 'BN-2025-033', name: 'Phạm Văn Đức',        gender: 'Nam', dob: '14/02/1978', address: 'TP. Hồ Chí Minh',       reason: 'Kiểm tra định kỳ 6 tháng',           checkedIn: '08:22', status: 'waiting' },
  { id: 'STT-005', patientId: 'BN-2025-011', name: 'Phạm Hoàng Long',     gender: 'Nam', dob: '08/09/2000', address: 'Tỉnh Bắc Giang',        reason: 'Răng cửa trên bị vỡ do chấn thương', checkedIn: '08:35', status: 'waiting' },
  { id: 'STT-006', patientId: 'BN-2025-045', name: 'Võ Thị Lan',          gender: 'Nữ',  dob: '30/06/1995', address: 'Thành phố Đà Nẵng',     reason: 'Nhổ răng theo yêu cầu',              checkedIn: '08:50', status: 'waiting' },
  { id: 'STT-007', patientId: 'BN-2025-017', name: 'Đặng Quốc Hùng',     gender: 'Nam', dob: '17/12/1988', address: 'Tỉnh Nghệ An',          reason: 'Đau buốt khi uống nước lạnh',        checkedIn: '09:05', status: 'examining' },
  { id: 'STT-008', patientId: 'BN-2025-052', name: 'Hoàng Thị Thu',       gender: 'Nữ',  dob: '03/04/1993', address: 'Thành phố Hà Nội',     reason: 'Mọc răng khôn đau nhức',             checkedIn: '09:18', status: 'waiting' },
  { id: 'STT-009', patientId: 'BN-2025-028', name: 'Bùi Văn Nam',         gender: 'Nam', dob: '22/08/1982', address: 'Tỉnh Thanh Hoá',        reason: 'Răng lung lay, muốn nhổ',            checkedIn: '09:30', status: 'waiting' },
];

// ─────────────────── address data ───────────────────
export const ADDRESS_DATA = {
  'Thành phố Cần Thơ': {
    'Huyện Cờ Đỏ': ['Thị trấn Cờ Đỏ', 'Xã Thới Hưng', 'Xã Đông Hiệp', 'Xã Đông Thắng'],
    'Quận Ninh Kiều': ['Phường An Hòa', 'Phường An Khánh', 'Phường Cái Khế'],
    'Huyện Phong Điền': ['Thị trấn Phong Điền', 'Xã Nhơn Ái', 'Xã Giai Xuân'],
  },
  'Thành phố Hồ Chí Minh': {
    'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho'],
    'Quận 3': ['Phường 1', 'Phường 2', 'Phường 3'],
    'Quận Bình Thạnh': ['Phường 1', 'Phường 2', 'Phường 3'],
  },
  'Thành phố Hà Nội': {
    'Quận Hoàn Kiếm': ['Phường Hàng Bạc', 'Phường Hàng Bài', 'Phường Hàng Buồm'],
    'Quận Đống Đa': ['Phường Cát Linh', 'Phường Hàng Bột', 'Phường Khâm Thiên'],
    'Huyện Gia Lâm': ['Thị trấn Trâu Quỳ', 'Xã Bát Tràng', 'Xã Đa Tốn'],
  },
  'Tỉnh Bình Định': {
    'Huyện An Lão': ['Thị trấn An Lão', 'Xã An Hòa', 'Xã An Toàn'],
    'Thành phố Quy Nhơn': ['Phường Ghềnh Ráng', 'Phường Hải Cảng', 'Phường Lê Hồng Phong'],
  },
  'Thành phố Đà Nẵng': {
    'Quận Hải Châu': ['Phường Bình Hiên', 'Phường Bình Thuận', 'Phường Hải Châu 1'],
    'Quận Sơn Trà': ['Phường An Hải Bắc', 'Phường An Hải Đông', 'Phường Mân Thái'],
  },
};

// Thêm đoạn này vào file src/data/mockData.js hiện có của bạn

export const MOCK_EXAM_QUEUE = [
  {
    id: 'BN8C09434C',
    confirmedAt: '18/01/2024 21:44:14',
    status: 'done',
    patient: {
      name: 'Bạch Cao Kỳ',
      gender: 'Nữ',
      dob: '08/07/1997',
      address: 'Tỉnh Tuyên Quang',
      phone: '0993010171',
    },
    history: [
      { date: '05/01/2024', specialty: 'Răng - hàm - mặt' },
      { date: '12/11/2023', specialty: 'Nội khoa' },
    ],
  },
  {
    id: 'BN3A12001B',
    confirmedAt: '18/01/2024 22:10:05',
    status: 'waiting',
    patient: {
      name: 'Nguyễn Văn An',
      gender: 'Nam',
      dob: '15/03/1990',
      address: 'Hà Nội',
      phone: '0912345678',
    },
    history: [
      { date: '01/12/2023', specialty: 'Tai - mũi - họng' },
    ],
  },
  {
    id: 'BN7F55810D',
    confirmedAt: '18/01/2024 22:35:48',
    status: 'waiting',
    patient: {
      name: 'Trần Thị Bích',
      gender: 'Nữ',
      dob: '22/09/2001',
      address: 'TP. Hồ Chí Minh',
      phone: '0987654321',
    },
    history: [],
  },
  {
    id: 'BN2D33901E',
    confirmedAt: '18/01/2024 22:50:00',
    status: 'waiting',
    patient: {
      name: 'Võ Thành Đạt',
      gender: 'Nam',
      dob: '01/01/1995',
      address: 'Đà Nẵng',
      phone: '0911222333',
    },
    history: [],
  },
  {
    id: 'BN5E77203F',
    confirmedAt: '18/01/2024 23:00:11',
    status: 'done',
    patient: {
      name: 'Ngô Thị Hoa',
      gender: 'Nữ',
      dob: '17/09/1988',
      address: 'Cần Thơ',
      phone: '0944555666',
    },
    history: [
      { date: '10/10/2023', specialty: 'Nội khoa' },
    ],
  },
  {
    id: 'BN1A00512G',
    confirmedAt: '18/01/2024 23:10:05',
    status: 'waiting',
    patient: {
      name: 'Đinh Quốc Hùng',
      gender: 'Nam',
      dob: '25/04/1980',
      address: 'Hải Phòng',
      phone: '0966777888',
    },
    history: [
      { date: '03/08/2023', specialty: 'Cơ xương khớp' },
      { date: '15/05/2023', specialty: 'Nội khoa' },
    ],
  },
  {
    id: 'BN9B12340H',
    confirmedAt: '18/01/2024 23:18:30',
    status: 'waiting',
    patient: {
      name: 'Lý Thị Kim Ngân',
      gender: 'Nữ',
      dob: '11/12/2002',
      address: 'Bình Dương',
      phone: '0977888999',
    },
    history: [],
  },
  {
    id: 'BN4C56781I',
    confirmedAt: '18/01/2024 23:25:00',
    status: 'done',
    patient: {
      name: 'Trương Văn Phúc',
      gender: 'Nam',
      dob: '30/06/1972',
      address: 'Long An',
      phone: '0988999000',
    },
    history: [
      { date: '20/11/2023', specialty: 'Tim mạch' },
    ],
  },
  {
    id: 'BN6D89012J',
    confirmedAt: '18/01/2024 23:33:45',
    status: 'waiting',
    patient: {
      name: 'Phan Thị Lan',
      gender: 'Nữ',
      dob: '05/03/1993',
      address: 'Vũng Tàu',
      phone: '0922111222',
    },
    history: [
      { date: '14/09/2023', specialty: 'Da liễu' },
    ],
  },
  {
    id: 'BN8F23456K',
    confirmedAt: '18/01/2024 23:40:00',
    status: 'waiting',
    patient: {
      name: 'Bùi Minh Tuấn',
      gender: 'Nam',
      dob: '19/08/1999',
      address: 'Nghệ An',
      phone: '0933222333',
    },
    history: [],
  },
  {
    id: 'BN3G45678L',
    confirmedAt: '18/01/2024 23:47:20',
    status: 'done',
    patient: {
      name: 'Đặng Thị Mỹ Linh',
      gender: 'Nữ',
      dob: '28/02/1986',
      address: 'Huế',
      phone: '0955444555',
    },
    history: [
      { date: '07/07/2023', specialty: 'Răng - hàm - mặt' },
      { date: '01/03/2023', specialty: 'Tai - mũi - họng' },
    ],
  },
  {
    id: 'BN7H67890M',
    confirmedAt: '18/01/2024 23:55:00',
    status: 'waiting',
    patient: {
      name: 'Hồ Văn Sơn',
      gender: 'Nam',
      dob: '10/10/1975',
      address: 'Quảng Nam',
      phone: '0900123456',
    },
    history: [
      { date: '22/06/2023', specialty: 'Nội khoa' },
    ],
  },
];

// ─────────────────── form constants ───────────────────
export const DAN_TOC = ['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer', 'Mông', 'Nùng', 'Hoa', 'Dao', 'Gia Rai', 'Khác'];
export const GIOI_TINH = ['Nam', 'Nữ', 'Khác'];

export const EMPTY_FORM = {
  name: '', dob: '', phone: '', cccd: '',
  danToc: '', gioiTinh: '', tinh: '', huyen: '', xa: '', diaChi: '',
};