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
  { stt: 1,  ma: 'DK240001', hoTen: 'Nguyễn Văn An',  gioiTinh: 'Nam', ngaySinh: '15/03/1985', sdt: '0912345678', trangThai: 'Đang chờ' },
  { stt: 2,  ma: 'DK240002', hoTen: 'Trần Thị Bình',  gioiTinh: 'Nữ',  ngaySinh: '22/07/1990', sdt: '0987654321', trangThai: 'Đang khám' },
  { stt: 3,  ma: 'DK240003', hoTen: 'Lê Minh Cường',  gioiTinh: 'Nam', ngaySinh: '08/11/1978', sdt: '0901234567', trangThai: 'Đang chờ' },
  { stt: 4,  ma: 'DK240004', hoTen: 'Phạm Thị Dung',  gioiTinh: 'Nữ',  ngaySinh: '30/01/2000', sdt: '0934567890', trangThai: 'Đang chờ' },
  { stt: 5,  ma: 'DK240005', hoTen: 'Hoàng Văn Em',   gioiTinh: 'Nam', ngaySinh: '14/06/1965', sdt: '0956789012', trangThai: 'Đã khám' },
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

// ─────────────────── form constants ───────────────────
export const DAN_TOC = ['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer', 'Mông', 'Nùng', 'Hoa', 'Dao', 'Gia Rai', 'Khác'];
export const GIOI_TINH = ['Nam', 'Nữ', 'Khác'];

export const EMPTY_FORM = {
  name: '', dob: '', phone: '', cccd: '',
  danToc: '', gioiTinh: '', tinh: '', huyen: '', xa: '', diaChi: '',
};