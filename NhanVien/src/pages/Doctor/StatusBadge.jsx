import React from 'react';
import { STATUS_CONFIG } from '../doctorDashboardData';

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;
  return <span className={`badge badge-${cfg.color}`}>{cfg.label}</span>;
}