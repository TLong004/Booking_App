import { useState } from 'react';
import { BAC_SI_DATA } from '../../data/mockData';
import './SchedulePage.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const toDateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayStr = new Date().toISOString().slice(0, 10);

const MONTH_NAMES = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];
const DOW_SHORT = ['CN','T2','T3','T4','T5','T6','T7'];
const DOW_LONG  = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];

const SHIFTS = [
  { key: 'am', label: 'Sáng',  time: '07:00 – 11:30', session: 'Buổi sáng' },
  { key: 'pm', label: 'Chiều', time: '13:00 – 17:00', session: 'Buổi chiều' },
];

// Flatten tất cả bác sĩ
const ALL_DOCTORS = Object.values(BAC_SI_DATA).flat();

// Tạo lịch trực mock từ danh sách bác sĩ thực
const buildSchedule = () => {
  const sched = {};
  const base = new Date();
  for (let i = -15; i < 30; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const k = d.toISOString().slice(0, 10);
    sched[`${k}_am`] = ALL_DOCTORS[Math.abs(i * 3)     % ALL_DOCTORS.length];
    if (i % 4 !== 0)
      sched[`${k}_pm`] = ALL_DOCTORS[Math.abs(i * 3 + 5) % ALL_DOCTORS.length];
  }
  return sched;
};

const SCHEDULE = buildSchedule();

const getWeekStart = (date) => {
  const d = new Date(date);
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d;
};

// ── Component ─────────────────────────────────────────────────────────────────
const SchedulePage = () => {
  const [viewMode, setViewMode]       = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected]       = useState(null);

  // Week
  const weekStart = getWeekStart(currentDate);
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const shiftDate = (n) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + n);
    setCurrentDate(d);
  };

  // Month
  const year         = currentDate.getFullYear();
  const month        = currentDate.getMonth();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstDow     = new Date(year, month, 1).getDay();

  const shiftMonth = (n) => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    setCurrentDate(d);
  };

  const handleClick = (dateStr, shift, doctor) => {
    if (!doctor) return;
    setSelected(prev =>
      prev?.dateStr === dateStr && prev?.shift.key === shift.key ? null : { dateStr, shift, doctor }
    );
  };

  return (
    <div className="mep-content">

      {/* Header */}
      <div className="sch-header">
        <div>
          <h2 className="mep-page-title">Lịch trực</h2>
          <p className="sch-sub">Phòng A104 — Khám răng · hàm · mặt</p>
        </div>
        <div className="sch-toggle-group">
          <button className={`sch-toggle-btn ${viewMode === 'week'  ? 'active' : ''}`} onClick={() => setViewMode('week')}>Tuần</button>
          <button className={`sch-toggle-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>Tháng</button>
        </div>
      </div>

      <div className={`sch-body ${selected ? 'has-drawer' : ''}`}>
        <div className="sch-main">

          {/* ── WEEK VIEW ── */}
          {viewMode === 'week' && (
            <div className="sch-card">
              <div className="sch-nav-row">
                <button className="sch-nav-btn" onClick={() => shiftDate(-7)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="sch-nav-label">
                  {weekDays[0].getDate()}/{weekDays[0].getMonth()+1} – {weekDays[6].getDate()}/{weekDays[6].getMonth()+1}/{weekDays[6].getFullYear()}
                </span>
                <button className="sch-nav-btn" onClick={() => shiftDate(7)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              <div className="sch-week-grid">
                <div className="sch-corner" />
                {weekDays.map((d, i) => {
                  const isToday = d.toISOString().slice(0,10) === todayStr;
                  return (
                    <div key={i} className={`sch-day-head ${isToday ? 'today' : ''}`}>
                      <span className="sch-dow">{DOW_LONG[d.getDay()]}</span>
                      <span className={`sch-day-num ${isToday ? 'today' : ''}`}>{d.getDate()}</span>
                    </div>
                  );
                })}

                {SHIFTS.map(shift => (
                  <>
                    <div key={shift.key + '-lbl'} className="sch-shift-lbl">
                      <span className={`sch-shift-tag ${shift.key}`}>{shift.label}</span>
                      <span className="sch-shift-time">{shift.time}</span>
                    </div>
                    {weekDays.map((d, i) => {
                      const ds      = d.toISOString().slice(0,10);
                      const doctor  = SCHEDULE[`${ds}_${shift.key}`];
                      const isToday = ds === todayStr;
                      const isActive = selected?.dateStr === ds && selected?.shift.key === shift.key;
                      return (
                        <div
                          key={i}
                          className={`sch-cell ${isToday ? 'today-col' : ''} ${doctor ? 'clickable' : ''} ${isActive ? 'active' : ''}`}
                          onClick={() => handleClick(ds, shift, doctor)}
                        >
                          {doctor
                            ? <div className={`sch-chip ${shift.key}`}>{doctor.name}</div>
                            : <span className="sch-empty">—</span>
                          }
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          )}

          {/* ── MONTH VIEW ── */}
          {viewMode === 'month' && (
            <div className="sch-card">
              <div className="sch-nav-row">
                <button className="sch-nav-btn" onClick={() => shiftMonth(-1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="sch-nav-label">{MONTH_NAMES[month]} {year}</span>
                <button className="sch-nav-btn" onClick={() => shiftMonth(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              <div className="sch-month-dow-row">
                {DOW_SHORT.map(d => <div key={d} className="sch-month-dow">{d}</div>)}
              </div>

              <div className="sch-month-grid">
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={'pad' + i} className="sch-month-cell other" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const ds      = toDateKey(year, month, day);
                  const am      = SCHEDULE[`${ds}_am`];
                  const pm      = SCHEDULE[`${ds}_pm`];
                  const isToday = ds === todayStr;
                  return (
                    <div key={day} className={`sch-month-cell ${isToday ? 'today' : ''}`}>
                      <span className={`sch-month-num ${isToday ? 'today' : ''}`}>{day}</span>
                      {am && (
                        <div
                          className={`sch-month-pill am ${selected?.dateStr === ds && selected?.shift.key === 'am' ? 'active' : ''}`}
                          onClick={() => handleClick(ds, SHIFTS[0], am)}
                        >
                          {am.name.replace('BS. ', '').replace('PGS. ', '').replace('TS. ', '').replace('GS. ', '')}
                        </div>
                      )}
                      {pm && (
                        <div
                          className={`sch-month-pill pm ${selected?.dateStr === ds && selected?.shift.key === 'pm' ? 'active' : ''}`}
                          onClick={() => handleClick(ds, SHIFTS[1], pm)}
                        >
                          {pm.name.replace('BS. ', '').replace('PGS. ', '').replace('TS. ', '').replace('GS. ', '')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="sch-legend">
            <div className="sch-legend-item"><span className="sch-legend-dot am"/>Sáng (07:00 – 11:30)</div>
            <div className="sch-legend-item"><span className="sch-legend-dot pm"/>Chiều (13:00 – 17:00)</div>
          </div>
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <aside className="sch-detail">
            <div className="sch-detail-header">
              <span className="sch-detail-title">Chi tiết ca trực</span>
              <button className="sch-detail-close" onClick={() => setSelected(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="sch-detail-body">
              <div className="sch-detail-section">
                <div className="sch-detail-section-title">Thông tin ca</div>
                <div className="sch-detail-row">
                  <span>Ngày</span>
                  <span>{selected.dateStr}</span>
                </div>
                <div className="sch-detail-row">
                  <span>Ca trực</span>
                  <span className={`sch-shift-tag ${selected.shift.key}`}>{selected.shift.label}</span>
                </div>
                <div className="sch-detail-row">
                  <span>Giờ</span>
                  <span>{selected.shift.time}</span>
                </div>
              </div>

              <div className="sch-detail-section">
                <div className="sch-detail-section-title">Bác sĩ trực</div>
                <div className="sch-doctor-box">
                  <div className="sch-doctor-avatar">
                    {selected.doctor.name.split(' ').pop().charAt(0)}
                  </div>
                  <div>
                    <div className="sch-doctor-name">{selected.doctor.name}</div>
                    <div className="sch-doctor-spec">{selected.doctor.spec}</div>
                  </div>
                </div>
              </div>

              <div className="sch-detail-section">
                <div className="sch-detail-section-title">Chi tiết</div>
                <div className="sch-detail-row"><span>Phòng</span>  <span>{selected.doctor.room}</span></div>
                <div className="sch-detail-row"><span>Phí khám</span><span>{selected.doctor.fee}</span></div>
                <div className="sch-detail-row">
                  <span>Hàng chờ</span>
                  <span className="sch-queue-count">{selected.doctor.currentQueue} người</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

    </div>
  );
};

export default SchedulePage;