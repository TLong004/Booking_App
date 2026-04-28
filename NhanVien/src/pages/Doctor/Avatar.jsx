import React from 'react';
import { getAvatarColor, getInitials } from '../doctorDashboardData';

export default function Avatar({ name, size = 40 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: getAvatarColor(name), fontSize: size * 0.32 }}>
      {getInitials(name)}
    </div>
  );
}