import React, { useEffect, useRef } from 'react';
import { SHIFT_META } from '../headDeptData';

export function Avatar({ doc, size = 32 }) {
  return (
    <div className="hd-avatar" style={{ width: size, height: size, background: doc.bg, color: doc.color, fontSize: size * 0.34 }}>
      {doc.init}
    </div>
  );
}

export function ShiftTag({ shift }) {
  const sm = SHIFT_META[shift] || SHIFT_META.off;
  const colors = { 'tag-morning': ['#FAEEDA','#854F0B'], 'tag-afternoon': ['#E6F1FB','#185FA5'], 'tag-full': ['#EEEDFE','#534AB7'], 'tag-off': ['#F1EFE8','#5F5E5A'] };
  const [bg, color] = colors[sm.cls] || ['#eee','#333'];
  return <span className="hd-shift-tag" style={{ background: bg, color }}>{sm.label}</span>;
}

export function StatCard({ label, value, sub, valueColor }) {
  return (
    <div className="hd-stat-card">
      <div className="hd-stat-lbl">{label}</div>
      <div className="hd-stat-val" style={{ color: valueColor || 'var(--color-text-primary)' }}>{value}</div>
      {sub && <div className="hd-stat-sub">{sub}</div>}
    </div>
  );
}

export function Toast({ msg, type, visible }) {
  return (
    <div className={`hd-toast ${type}`} style={{ opacity: visible ? 1 : 0 }}>{msg}</div>
  );
}

export function AlertRow({ color, iconBg, iconColor, icon, title, sub }) {
  return (
    <div className="hd-alert-row" style={{ borderColor: color }}>
      <span className="hd-alert-icon" style={{ background: iconBg, color: iconColor }}>{icon}</span>
      <div>
        <div className="hd-alert-title">{title}</div>
        <div className="hd-alert-sub">{sub}</div>
      </div>
    </div>
  );
}

export function DonutChart({ data }) {
  const canvasRef = useRef(null);
  const total = data.reduce((a, b) => a + b.value, 0);
  
  useEffect(() => {
    const cv = canvasRef.current; 
    if (!cv) return;
    
    const ctx = cv.getContext('2d');
    let ang = -Math.PI / 2; 
    
    ctx.clearRect(0, 0, 90, 90);
    
    data.forEach(d => { 
      const sl = (d.value / total) * 2 * Math.PI; 
      ctx.beginPath(); 
      ctx.moveTo(45, 45); 
      ctx.arc(45, 45, 38, ang, ang + sl); 
      ctx.closePath(); 
      ctx.fillStyle = d.color; 
      ctx.fill(); 
      ang += sl; 
    });
    
    ctx.beginPath(); 
    ctx.arc(45, 45, 24, 0, 2 * Math.PI); 
    ctx.fillStyle = 'white'; 
    ctx.fill();
  }, [data]);
  
  return <canvas ref={canvasRef} width={90} height={90} />;
}