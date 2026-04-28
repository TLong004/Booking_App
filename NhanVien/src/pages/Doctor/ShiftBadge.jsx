import React from 'react';
import { SHIFT_STYLE } from '../scheduleData';

export default function ShiftBadge({ shift, compact }) {
  const s = SHIFT_STYLE[shift.type];
  if (compact) {
    return <span className="ds-badge-compact" style={{ background: s.dot }} title={`${shift.label} · ${shift.time}`} />;
  }
  
  return (
    <div className="ds-badge-full" style={{ background: s.bg, color: s.color }}>
      <span className="ds-badge-dot" style={{ background: s.dot }} />
      <span>{shift.label}</span>
      <span className="ds-badge-time">{shift.time}</span>
    </div>
  );
}