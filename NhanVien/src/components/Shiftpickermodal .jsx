import React, { useEffect } from 'react';

/**
 * ShiftPickerModal
 *
 * Bác sĩ / Trưởng khoa chọn ca làm trong ngày hôm nay.
 *
 * Props:
 *   onClose  () => void
 *   onSelect (shift: 'Buổi sáng' | 'Buổi chiều') => void
 */

const SHIFTS = [
  {
    id: 'sang',
    label: 'Buổi Sáng',
    time: '07:00 – 12:00',
    sessionKey: 'Buổi sáng',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M14 3v2.5M14 22.5V25M3 14h2.5M22.5 14H25M5.93 5.93l1.77 1.77M20.3 20.3l1.77 1.77M5.93 22.07l1.77-1.77M20.3 7.7l1.77-1.77"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'chieu',
    label: 'Buổi Chiều',
    time: '13:00 – 17:00',
    sessionKey: 'Buổi chiều',
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M22 16A9 9 0 1110 5a6.5 6.5 0 0012 11z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const ShiftPickerModal = ({ onClose, onSelect }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div style={s.backdrop} onClick={onClose} />

      {/* Modal */}
      <div style={s.modal} role="dialog" aria-modal="true" aria-label="Chọn ca trực">

        {/* Header */}
        <div style={s.header}>
          <div>
            <h2 style={s.title}>Chọn ca trực</h2>
            <p style={s.subtitle}>Vui lòng chọn ca trực hôm nay để có thể tiếp tục</p>
          </div>
          <button style={s.closeBtn} onClick={onClose} aria-label="Đóng">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={s.divider} />

        {/* Shift cards */}
        <div style={s.body}>
          {SHIFTS.map((sh) => (
            <button
              key={sh.id}
              style={s.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = sh.border;
                e.currentTarget.style.background  = sh.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background  = '#f9fafb';
              }}
              onClick={() => onSelect(sh.sessionKey)}
            >
              <div style={{ ...s.iconWrap, color: sh.color, background: sh.bg }}>
                {sh.icon}
              </div>
              <div style={s.cardText}>
                <div style={s.cardLabel}>{sh.label}</div>
                <div style={s.cardTime}>{sh.time}</div>
              </div>
              <svg style={{ color: '#d1d5db', flexShrink: 0 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

      </div>
    </>
  );
};

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(3px)',
    zIndex: 999,
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    background: '#fff', borderRadius: 18,
    width: 'min(400px, 92vw)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
    zIndex: 1000, overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 12,
    padding: '22px 22px 0',
  },
  title:    { margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' },
  subtitle: { margin: '4px 0 0', fontSize: 12.5, color: '#6b7280', lineHeight: 1.5 },
  closeBtn: {
    background: '#f3f4f6', border: 'none', borderRadius: 8,
    width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#374151', flexShrink: 0,
  },
  divider: { height: 1, background: '#f3f4f6', margin: '18px 22px' },
  body:    { display: 'flex', flexDirection: 'column', gap: 10, padding: '0 22px 22px' },
  card: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: '#f9fafb', border: '1.5px solid #e5e7eb',
    borderRadius: 14, padding: '16px',
    cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'border-color 0.15s, background 0.15s',
  },
  iconWrap:  { width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardText:  { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: 600, color: '#111827' },
  cardTime:  { fontSize: 13, color: '#6b7280', marginTop: 3 },
};

export default ShiftPickerModal;