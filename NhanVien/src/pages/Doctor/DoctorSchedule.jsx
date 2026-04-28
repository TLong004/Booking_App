import React, { useState, useMemo } from 'react';
import DayCell from './components/DayCell';
import DetailPanel from './components/DetailPanel';
import { 
  SHIFT_DATA, SHIFT_STYLE, WEEKDAYS, MONTHS, 
  getDaysInMonth, getFirstDayOfMonth, dateKey, computeStats 
} from './scheduleData';
import './DoctorSchedule.css';

export default function DoctorSchedule() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDay = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);
  const stats = useMemo(() => computeStats(year, month), [year, month]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setSelected(null); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setSelected(null); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelected(today.getDate()); };

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [firstDay, daysInMonth]);

  return (
    <div className="ds-container">
      {/* HEADER */}
      <div className="ds-header">
        <div>
          <h2 className="ds-title">Lịch Trực Của Tôi</h2>
          <p className="ds-subtitle">BS. Lê Trọng Bình · Phòng 101 · Đa khoa</p>
        </div>

        <div className="ds-stats">
          {[
            { label: 'Tổng ca', value: stats.total, bg: '#f1f5f9', color: '#0f172a' },
            { label: 'Ca Sáng', value: stats.morning, bg: '#dbeafe', color: '#1e40af' },
            { label: 'Ca Chiều', value: stats.afternoon, bg: '#fef3c7', color: '#92400e' },
            { label: 'Ca Tối', value: stats.evening, bg: '#f3e8ff', color: '#6b21a8' },
          ].map(s => (
            <div key={s.label} className="ds-stat-card" style={{ background: s.bg }}>
              <div className="ds-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="ds-stat-lbl" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="ds-body">
        {/* CALENDAR */}
        <div className="ds-calendar">
          <div className="ds-cal-nav">
            <button onClick={prevMonth} className="ds-nav-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="ds-nav-month">
              <span>{MONTHS[month]} {year}</span>
              <button onClick={goToday} className="ds-nav-today">Hôm nay</button>
            </div>
            <button onClick={nextMonth} className="ds-nav-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div className="ds-cal-weekdays">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`ds-weekday ${i === 0 ? 'sunday' : ''}`}>{d}</div>
            ))}
          </div>

          <div className="ds-cal-grid-wrap">
            <div className="ds-cal-grid">
              {cells.map((day, i) => day === null
                ? <div key={`e-${i}`} className="ds-day-empty" />
                : <DayCell key={`d-${day}`} day={day} year={year} month={month}
                    isToday={day === today.getDate() && month === today.getMonth() && year === today.getFullYear()}
                    isSelected={selected === day}
                    onClick={setSelected}
                    shifts={SHIFT_DATA[dateKey(year, month, day)] || []}
                  />
              )}
            </div>
          </div>
        </div>

      {/* SIDE PANEL */}
      <div className="ds-side-panel">
          {selected ? (
            <DetailPanel day={selected} year={year} month={month} onClose={() => setSelected(null)} shifts={SHIFT_DATA[dateKey(year, month, selected)] || []} />
          ) : (
          <div className="ds-detail-empty">
            <div className="ds-detail-empty-icon">📅</div>
            <div className="ds-detail-empty-title">Chọn một ngày</div>
            <div className="ds-detail-empty-sub">để xem chi tiết ca trực</div>
            </div>
          )}

        <div className="ds-legend">
          <div className="ds-legend-title">Chú thích</div>
            {Object.entries(SHIFT_STYLE).map(([type, s]) => (
            <div key={type} className="ds-legend-item">
              <span className="ds-legend-dot" style={{ background: s.dot }} />
              <span className="ds-legend-lbl">
                  {type === 'morning' ? 'Ca Sáng (07:30–11:30)' : type === 'afternoon' ? 'Ca Chiều (13:30–17:30)' : 'Ca Tối (17:30–21:30)'}
                </span>
              </div>
            ))}
          <div className="ds-legend-item" style={{ marginTop: 12 }}>
            <span className="ds-legend-today">H</span>
            <span className="ds-legend-lbl">Hôm nay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}