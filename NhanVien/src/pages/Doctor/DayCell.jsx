import React from 'react';
import ShiftBadge from './ShiftBadge';

export default function DayCell({ day, year, month, isToday, isSelected, onClick, shifts }) {
  const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;

  let cellClass = "ds-day-cell";
  if (isSelected) cellClass += " selected";
  else if (isToday) cellClass += " today";

  let numClass = "ds-day-num";
  if (isToday) numClass += " today";
  else if (isWeekend) numClass += " weekend";

  return (
    <div className={cellClass} onClick={() => onClick(day)}>
      <div className="ds-day-top">
        <span className={numClass}>{day}</span>
        {shifts.length > 0 && (
          <div className="ds-badges-compact">
            {shifts.map((s, i) => <ShiftBadge key={i} shift={s} compact />)}
          </div>
        )}
      </div>
      <div className="ds-badges-list">
        {shifts.map((s, i) => <ShiftBadge key={i} shift={s} />)}
      </div>
    </div>
  );
}