import React from 'react';
import { SHIFT_STYLE, MONTHS } from '../scheduleData';

export default function DetailPanel({ day, year, month, onClose, shifts }) {
  const date = new Date(year, month, day);
  const weekday = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][date.getDay()];

  return (
    <div className="ds-detail-panel">
      <div className="ds-detail-header">
        <div>
          <div className="ds-detail-weekday">{weekday}</div>
          <div className="ds-detail-date">{day} {MONTHS[month]} {year}</div>
        </div>
        <button onClick={onClose} className="ds-detail-close">×</button>
      </div>

      <div className="ds-detail-body">
        {shifts.length === 0 ? (
          <div className="ds-detail-no-shift">
            <div className="ds-detail-no-shift-icon">🗓️</div>
            <div className="ds-detail-no-shift-title">Không có ca trực</div>
            <div className="ds-detail-no-shift-sub">Ngày nghỉ hoặc chưa phân công</div>
          </div>
        ) : (
          <div className="ds-shift-list">
            {shifts.map((s, i) => {
              const style = SHIFT_STYLE[s.type];
              return (
                <div key={i} className="ds-shift-card" style={{ background: style.bg, border: `1px solid ${style.dot}22` }}>
                  <div className="ds-shift-card-header">
                    <span className="ds-shift-card-icon">{style.icon}</span>
                    <span className="ds-shift-card-title" style={{ color: style.color }}>{s.label}</span>
                  </div>
                  <div className="ds-shift-card-info">
                    <div className="ds-shift-card-row" style={{ color: style.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {s.time}
                    </div>
                    <div className="ds-shift-card-row" style={{ color: style.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      {s.room}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}