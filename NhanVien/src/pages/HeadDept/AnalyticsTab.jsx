import React from 'react';
import { PERF } from './headDeptData';
import { StatCard, DonutChart } from './SharedUI';

export default function AnalyticsTab() {
  const maxC = Math.max(...PERF.map(p => p.completed));

  return (
    <div>
      <div className="hd-grid-4">
        <StatCard label="Tổng ca tháng này" value="247" sub="↑ 15% tháng trước" />
        <StatCard label="Tỉ lệ đúng giờ" value="96%" valueColor="#0F6E56" sub="+2% so tháng 3" />
        <StatCard label="Ca hủy / vắng" value="3" valueColor="#854F0B" sub="Lý do có phép: 3" />
        <StatCard label="Hài lòng trung bình" value="4.7/5" valueColor="#534AB7" sub="89 đánh giá" />
      </div>

      <div className="hd-chart-row">
        <div className="hd-card">
          <div className="hd-preview-title" style={{ marginBottom: 12 }}>Ca khám hoàn thành (tháng này)</div>
          <div className="hd-perf-list">
            {PERF.map(p => (
              <div key={p.name} className="hd-perf-item">
                <div className="hd-perf-name">{p.name}</div>
                <div className="hd-perf-track"><div className="hd-perf-fill" style={{ width: `${Math.round(p.completed / maxC * 100)}%` }} /></div>
                <div className="hd-perf-val">{p.completed}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hd-card">
          <div className="hd-preview-title" style={{ marginBottom: 12 }}>Phân bổ ca trực</div>
          <div className="hd-donut-wrap">
            <DonutChart data={PERF.map((p, i) => ({ label: p.name, value: [32,28,22,18][i], color: p.color }))} />
            <div className="hd-donut-legend">
              {PERF.map((p, i) => (<div key={p.name} className="hd-donut-item"><div className="hd-donut-dot" style={{ background: p.color }} />{p.name} · {[32,28,22,18][i]}</div>))}
            </div>
          </div>
        </div>
      </div>

      <div className="hd-card">
        <div className="hd-preview-title" style={{ marginBottom: 12 }}>Hiệu suất bác sĩ</div>
        <table className="hd-table">
          <thead><tr>{['Bác sĩ','Hoàn thành','Chờ','Hiệu suất'].map(h => <th key={h} className="hd-th">{h}</th>)}</tr></thead>
          <tbody>
            {PERF.map(p => (<tr key={p.name}><td className="hd-td">{p.name}</td><td className="hd-td hd-td-comp">{p.completed}</td><td className="hd-td hd-td-wait">{p.waiting}</td><td className="hd-td"><div className="hd-rating-wrap"><div className="hd-rating-track"><div className="hd-rating-fill" style={{ width: `${p.rating}%`, background: p.rating >= 95 ? '#1D9E75' : p.rating >= 90 ? '#534AB7' : '#BA7517' }} /></div><span className="hd-rating-val">{p.rating}%</span>{p.rating >= 95 && <span className="hd-rating-star">★</span>}</div></td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}