export const DOCS = [
  { id: 'D1', name: 'BS. Lê Trọng Bình',  short: 'Lê T. Bình',  init: 'LB', color: '#534AB7', bg: '#EEEDFE', shift: 'morning',   room: '101' },
  { id: 'D2', name: 'BS. Nguyễn Thị Yến', short: 'Ng. T. Yến',  init: 'NY', color: '#0F6E56', bg: '#E1F5EE', shift: 'afternoon', room: '102' },
  { id: 'D3', name: 'BS. Trần Văn Khoa',  short: 'Tr. V. Khoa', init: 'TK', color: '#3B6D11', bg: '#EAF3DE', shift: 'full',      room: '101' },
  { id: 'D4', name: 'BS. Phạm Minh Tuấn', short: 'Ph. M. Tuấn', init: 'PT', color: '#854F0B', bg: '#FAEEDA', shift: 'off',       room: ''    },
];

export const SHIFT_META = {
  morning:   { label: 'Ca sáng',   cls: 'tag-morning' },
  afternoon: { label: 'Ca chiều',  cls: 'tag-afternoon' },
  full:      { label: 'Cả ngày',   cls: 'tag-full' },
  off:       { label: 'Nghỉ phép', cls: 'tag-off' },
};

export const DOT_COLORS = { morning: '#BA7517', afternoon: '#185FA5', full: '#534AB7' };

export const PERF = [
  { name: 'Lê Trọng Bình',  completed: 89, waiting: 3, rating: 98, color: '#534AB7' },
  { name: 'Ng. Thị Yến',    completed: 74, waiting: 5, rating: 94, color: '#1D9E75' },
  { name: 'Trần Văn Khoa',  completed: 58, waiting: 2, rating: 91, color: '#3B6D11' },
  { name: 'Ph. Minh Tuấn',  completed: 26, waiting: 0, rating: 87, color: '#BA7517' },
];

export const now = new Date();

export function fk(y, m, d) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }
export function todayKey() { return fk(now.getFullYear(), now.getMonth(), now.getDate()); }
export function getDoc(id) { return DOCS.find(d => d.id === id) || {}; }
export function buildInitialSchedule() {
  const d = now.getDate(), m = now.getMonth(), y = now.getFullYear();
  const d2 = d + 2 <= 28 ? d + 2 : d - 2;
  const d3 = d + 5 <= 28 ? d + 5 : d - 3;
  return {
    [fk(y, m, d)]:  [{ id: 1, doctorId: 'D1', shift: 'morning', room: '101', note: '' }, { id: 2, doctorId: 'D2', shift: 'afternoon', room: '102', note: '' }, { id: 3, doctorId: 'D3', shift: 'full', room: '101', note: '' }],
    [fk(y, m, d2)]: [{ id: 4, doctorId: 'D1', shift: 'full', room: '103', note: '' }, { id: 5, doctorId: 'D2', shift: 'morning', room: '101', note: '' }],
    [fk(y, m, d3)]: [{ id: 6, doctorId: 'D3', shift: 'afternoon', room: '102', note: '' }],
  };
}
export function getDates(dateVal, repeat) {
  if (!dateVal) return [];
  const dates = [dateVal];
  if (repeat === 'none') return dates;
  const step  = repeat === 'weekly' ? 7 : 14;
  const weeks = repeat === 'weekly' ? 4 : 8;
  const [y, m, d] = dateVal.split('-').map(Number);
  for (let i = 1; i < weeks; i++) {
    const dt = new Date(y, m - 1, d + i * step);
    dates.push(fk(dt.getFullYear(), dt.getMonth(), dt.getDate()));
  }
  return dates;
}