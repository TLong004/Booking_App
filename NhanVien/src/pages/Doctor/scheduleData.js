// ─── MOCK DATA ─────────────────────────────────────────────────────────────
export const SHIFT_DATA = {
  // key: "YYYY-M-D"
  '2025-5-6':  [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }],
  '2025-5-8':  [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }, { id: 2, type: 'afternoon', label: 'Ca Chiều', time: '13:30 – 17:30', room: 'P.101' }],
  '2025-5-13': [{ id: 2, type: 'afternoon', label: 'Ca Chiều', time: '13:30 – 17:30', room: 'P.101' }],
  '2025-5-15': [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }, { id: 2, type: 'afternoon', label: 'Ca Chiều', time: '13:30 – 17:30', room: 'P.101' }],
  '2025-5-20': [{ id: 3, type: 'evening', label: 'Ca Tối', time: '17:30 – 21:30', room: 'P.101' }],
  '2025-5-22': [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }, { id: 2, type: 'afternoon', label: 'Ca Chiều', time: '13:30 – 17:30', room: 'P.101' }],
  '2025-5-25': [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }],
  '2025-5-27': [{ id: 3, type: 'evening', label: 'Ca Tối', time: '17:30 – 21:30', room: 'P.101' }],
  '2025-5-29': [{ id: 1, type: 'morning', label: 'Ca Sáng', time: '07:30 – 11:30', room: 'P.101' }],
};

export const SHIFT_STYLE = {
  morning:   { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6', icon: '🌅' },
  afternoon: { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b', icon: '☀️' },
  evening:   { bg: '#f3e8ff', color: '#6b21a8', dot: '#a855f7', icon: '🌙' },
};

export const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

export function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
export function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
export function dateKey(year, month, day) { return `${year}-${month + 1}-${day}`; }

export function computeStats(year, month) {
  let morning = 0, afternoon = 0, evening = 0;
  Object.entries(SHIFT_DATA).forEach(([key, shifts]) => {
    const [y, m] = key.split('-').map(Number);
    if (y === year && m === month + 1) {
      shifts.forEach(s => {
        if (s.type === 'morning') morning++; else if (s.type === 'afternoon') afternoon++; else if (s.type === 'evening') evening++;
      });
    }
  });
  return { morning, afternoon, evening, total: morning + afternoon + evening };
}