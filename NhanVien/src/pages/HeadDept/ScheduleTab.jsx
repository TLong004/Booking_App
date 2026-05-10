import React, { useState, useCallback, useMemo } from 'react';
import { now, fk, todayKey, buildInitialSchedule, getDoc, getDates, SHIFT_META, DOT_COLORS, DOCS } from './headDeptData';
import { Avatar, ShiftTag, Toast } from './SharedUI';

export default function ScheduleTab() {
  const [sched, setSched] = useState(buildInitialSchedule);
  const [calYear, setCalY] = useState(now.getFullYear());
  const [calMonth, setCalM] = useState(now.getMonth());
  const [selKey, setSelKey] = useState(null);
  const [form, setForm] = useState({ date: todayKey(), doctorId: '', shift: '', room: '', repeat: 'none', note: '' });
  const [recent, setRecent] = useState([]);
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'ok' });

  const showToast = useCallback((msg, type = 'ok') => { setToast({ visible: true, msg, type }); setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500); }, []);
  const changeMonth = (dir) => { let m = calMonth + dir, y = calYear; if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; } setCalM(m); setCalY(y); };
  const selectDate = (key) => { setSelKey(key); setForm(f => ({ ...f, date: key })); };
  const deleteShift = (key, id) => setSched(prev => ({ ...prev, [key]: (prev[key] || []).filter(s => s.id !== id) }));
  const previewDates = useMemo(() => getDates(form.date, form.repeat), [form.date, form.repeat]);

  const saveShift = () => {
    if (!form.date || !form.doctorId || !form.shift || !form.room) { showToast('Vui lòng điền đầy đủ thông tin.', 'err'); return; }
    const dates = getDates(form.date, form.repeat);
    setSched(prev => {
      const next = { ...prev };
      dates.forEach(k => {
        if (!next[k]) next[k] = [];
        const dup = next[k].find(s => s.doctorId === form.doctorId && s.shift === form.shift);
        if (!dup) next[k] = [...next[k], { id: Date.now() + Math.random(), doctorId: form.doctorId, shift: form.shift, room: form.room, note: form.note }];
      }); return next;
    });
    const doc = getDoc(form.doctorId); const sm = SHIFT_META[form.shift]; const [y, m, d] = form.date.split('-');
    setRecent(prev => [{ label: `${doc.short || doc.name} · ${d}/${m} · ${sm.label}`, doc, sm, shiftCls: sm.cls, count: dates.length }, ...prev].slice(0, 5));
    setForm(f => ({ ...f, doctorId: '', shift: '', room: '', repeat: 'none', note: '' }));
    showToast(dates.length > 1 ? `Đã tạo ${dates.length} ca trực thành công!` : 'Đã lưu lịch trực thành công!');
  };

  const calCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1).getDay(); const days = new Date(calYear, calMonth + 1, 0).getDate(); const prev = new Date(calYear, calMonth, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push({ day: prev - first + 1 + i, type: 'prev' });
    for (let d = 1; d <= days; d++) cells.push({ day: d, type: 'cur', key: fk(calYear, calMonth, d) });
    const rem = (first + days) % 7; if (rem) for (let i = 1; i <= 7 - rem; i++) cells.push({ day: i, type: 'next' });
    return cells;
  }, [calYear, calMonth]);

  const shiftListData = selKey ? (sched[selKey] || []) : [];
  const MONTH_NAMES = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

  return (
    <div className="hd-sched-layout">
      {/* LEFT COL */}
      <div>
        <div className="hd-card">
          <div className="hd-cal-nav"><button className="hd-cal-btn" onClick={() => changeMonth(-1)}>‹</button><div className="hd-cal-month">{MONTH_NAMES[calMonth]} {calYear}</div><button className="hd-cal-btn" onClick={() => changeMonth(1)}>›</button></div>
          <div className="hd-cal-dow">{['CN','T2','T3','T4','T5','T6','T7'].map(d => <div key={d}>{d}</div>)}</div>
          <div className="hd-cal-grid">
            {calCells.map((cell, i) => {
              if (cell.type !== 'cur') return <div key={i} className="hd-cal-cell disabled"><div className="hd-cal-day">{cell.day}</div></div>;
              const isToday = calYear === now.getFullYear() && calMonth === now.getMonth() && cell.day === now.getDate();
              const isSel = selKey === cell.key; const shifts = sched[cell.key] || [];
              return (
                <div key={i} onClick={() => selectDate(cell.key)} className={`hd-cal-cell ${isSel ? 'selected' : ''} ${isToday ? 'today' : ''}`}>
                  <div className="hd-cal-day">{cell.day}</div>
                  {shifts.length > 0 && <div className="hd-cal-dot" />}
                  {shifts.slice(0, 2).map((s, j) => {
                    const col = DOT_COLORS[s.shift] || '#888'; const doc = getDoc(s.doctorId);
                    return <div key={j} className="hd-cal-shift" style={{ background: col + '18', color: col }}>{doc.init}</div>;
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="hd-card" style={{ marginTop: 10 }}>
          <div className="hd-shift-title">{selKey ? (() => { const [y,m,d] = selKey.split('-'); return `Lịch trực ngày ${d}/${m}/${y}`; })() : 'Chọn ngày để xem lịch trực'}</div>
          {shiftListData.length === 0 ? <div className="hd-shift-empty">{selKey ? 'Chưa có ca trực nào được phân công.' : '← Nhấn vào một ngày trên lịch'}</div> : shiftListData.map(s => {
            const doc = getDoc(s.doctorId); return (
              <div key={s.id} className="hd-shift-item">
                <Avatar doc={doc} size={26} />
                <div className="hd-shift-info"><div className="hd-shift-name">{doc.name}</div><div className="hd-shift-room">P.{s.room}{s.note ? ' · ' + s.note : ''}</div></div>
                <ShiftTag shift={s.shift} /><button className="hd-shift-del" onClick={() => deleteShift(selKey, s.id)}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
      {/* RIGHT COL (Form) */}
      <div className="hd-card">
        <div className="hd-form-header">Tạo lịch trực <span className="hd-form-badge">{form.date ? (() => { const [y,m,d]=form.date.split('-'); return `${d}/${m}/${y}`; })() : 'Chưa chọn ngày'}</span></div>
        <div className="hd-form-fields">
          <div className="hd-form-row"><label className="hd-form-label">Ngày trực</label><input type="date" className="hd-form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div className="hd-form-row"><label className="hd-form-label">Bác sĩ phụ trách</label><select className="hd-form-input" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))}><option value="">— Chọn bác sĩ —</option>{DOCS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div className="hd-form-grid">
            <div className="hd-form-row"><label className="hd-form-label">Ca làm việc</label><select className="hd-form-input" value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))}><option value="">— Chọn ca —</option><option value="morning">Ca sáng 07:30–11:30</option><option value="afternoon">Ca chiều 13:30–17:30</option><option value="full">Cả ngày 07:30–17:30</option></select></div>
            <div className="hd-form-row"><label className="hd-form-label">Phòng khám</label><select className="hd-form-input" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}><option value="">— Phòng —</option><option value="101">Phòng 101</option><option value="102">Phòng 102</option><option value="103">Phòng 103</option></select></div>
          </div>
          <div className="hd-form-row"><label className="hd-form-label">Lặp lại</label><select className="hd-form-input" value={form.repeat} onChange={e => setForm(f => ({ ...f, repeat: e.target.value }))}><option value="none">Không lặp</option><option value="weekly">Hàng tuần (4 tuần)</option><option value="biweekly">Cách tuần (8 tuần)</option></select></div>
          <div className="hd-form-row"><label className="hd-form-label">Ghi chú (tuỳ chọn)</label><input type="text" className="hd-form-input" placeholder="VD: Phụ trách hội chẩn..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} /></div>
          <button className="hd-btn-submit" onClick={saveShift}>Lưu lịch trực</button>
        </div>
        {form.doctorId && form.shift && form.room && previewDates.length > 0 && (
          <div className="hd-preview-section">
            <div className="hd-preview-title">Xem trước</div>
            <div className="hd-preview-list">
              {previewDates.slice(0, 4).map(k => { const [y, m, d] = k.split('-'); const doc = getDoc(form.doctorId); return (<div key={k} className="hd-preview-item"><Avatar doc={doc} size={20} /><span className="hd-preview-date">{d}/{m}/{y}</span><ShiftTag shift={form.shift} /><span className="hd-preview-room">P.{form.room}</span></div>); })}
              {previewDates.length > 4 && <div className="hd-preview-more">+ {previewDates.length - 4} ngày nữa...</div>}
            </div>
          </div>
        )}
        <div className="hd-recent-section">
          <div className="hd-preview-title">Vừa tạo</div>
          {recent.length === 0 ? <div className="hd-recent-empty">Chưa có lịch nào được tạo.</div> : recent.map((r, i) => (<div key={i} className="hd-recent-item"><Avatar doc={r.doc} size={24} /><div className="hd-recent-info">{r.label}{r.count > 1 && <span className="hd-recent-count"> (+{r.count - 1} ngày)</span>}</div><ShiftTag shift={r.sm?.label === 'Ca sáng' ? 'morning' : r.sm?.label === 'Ca chiều' ? 'afternoon' : 'full'} /></div>))}
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </div>
  );
}