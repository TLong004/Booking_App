import React, { useState, useMemo } from 'react';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';

export default function PatientQueue({ queue, activePatient, onSelectPatient, counts }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredQueue = useMemo(() => {
    return queue.filter(p => filterStatus === 'all' || p.status === filterStatus);
  }, [queue, filterStatus]);

  return (
    <aside className="queue-panel">
      <div className="queue-top">
        <span className="queue-title">Hàng chờ</span>
        <span className="queue-count">{filteredQueue.length}</span>
      </div>
      <div className="queue-filters">
        {[['all','Tất cả'], ['waiting','Đợi'], ['in-progress','Đang khám'], ['completed','Xong']].map(([v, l]) => (
          <button key={v} className={`qf-pill ${filterStatus === v ? 'active' : ''}`} onClick={() => setFilterStatus(v)}>
            {l}{v !== 'all' && <span className="qf-n">{counts[v]}</span>}
          </button>
        ))}
      </div>
      <div className="queue-list">
        {filteredQueue.length === 0 && <div className="queue-empty">Không có bệnh nhân nào</div>}
        {filteredQueue.map(p => (
          <div key={p.id} className={`qitem ${activePatient?.id === p.id ? 'active' : ''} ${p.status}`} onClick={() => onSelectPatient(p)}>
            <Avatar name={p.name} size={38} />
            <div className="qitem-info">
              <div className="qitem-name">{p.name}</div>
              <div className="qitem-meta">{p.age} tuổi · {p.gender}</div>
              <div className="qitem-reason">{p.reason}</div>
            </div>
            <div className="qitem-right">
              <div className="qitem-time">{p.time}</div>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}