import React from 'react';
import { DOCS } from '../headDeptData';
import { StatCard, Avatar, ShiftTag, AlertRow } from './SharedUI';

export default function OverviewTab() {
  return (
    <div>
      <div className="hd-grid-4">
        <StatCard label="Bệnh nhân hôm nay" value="112" valueColor="#0F6E56" sub="↑ 8% so hôm qua" />
        <StatCard label="Đang chờ khám" value="14" valueColor="#854F0B" sub="P.101, 102, 103" />
        <StatCard label="Doanh thu khoa" value="25,6M đ" valueColor="#534AB7" sub="↑ 12% tuần trước" />
        <StatCard label="Bác sĩ đang trực" value="3 / 4" sub="1 bác sĩ nghỉ phép" />
      </div>
      <div className="hd-section-title">Lịch trực hôm nay</div>
      {DOCS.map(doc => (
        <div key={doc.id} className="hd-doc-row">
          <Avatar doc={doc} />
          <div className="hd-doc-info"><div className="hd-doc-name">{doc.name}</div><div className="hd-doc-room">{doc.shift !== 'off' ? 'Phòng ' + doc.room : '—'}</div></div>
          <ShiftTag shift={doc.shift} />
        </div>
      ))}
      <div className="hd-section-title" style={{ marginTop: '1.25rem' }}>Cảnh báo & ghi chú</div>
      <div className="hd-alert-list">
        <AlertRow color="#F7C1C1" iconBg="#FCEBEB" iconColor="#A32D2D" icon="!" title="BS. Phạm Minh Tuấn nghỉ phép" sub="25/04 – 30/04 · Cần phân công bác sĩ thay thế" />
        <AlertRow color="#FAC775" iconBg="#FAEEDA" iconColor="#854F0B" icon="i" title="Họp khoa định kỳ" sub="Thứ 6, 26/04 lúc 08:00 · Phòng họp A" />
      </div>
    </div>
  );
}