import { useState } from 'react';
import Icons from '../../components/Icons';
import { CHUYEN_KHOA, BAC_SI_DATA } from '../../data/mockData';
import './AcceptPage.css';

/* ── inline SVG icons ── */
const IconGender = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7 8.5v4M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconSpec = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 2.5v4a4 4 0 008 0v-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11 7a3 3 0 010 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="11" cy="12.5" r="1" fill="currentColor"/>
    <circle cx="2.5" cy="2.5" r="1" fill="currentColor"/>
    <circle cx="5" cy="2.5" r="1" fill="currentColor"/>
  </svg>
);
const IconMoney = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 5.5h1.5M11.5 5.5H13M1 8.5h1.5M11.5 8.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const AcceptPage = ({ patient, onBack, onConfirm }) => {
  const [selCK, setSelCK] = useState('');
  const [selBS, setSelBS] = useState(null);

  const chuyenKhoaOptions = CHUYEN_KHOA.filter((ck) => ck !== 'Chuyên khoa');
  const bacSiList = selCK ? (BAC_SI_DATA[selCK] || []) : [];

  const handleChangeCK = (e) => {
    setSelCK(e.target.value);
    setSelBS(null);
  };

  const handleConfirm = () => {
    onConfirm({ patient, chuyenKhoa: selCK, bacSi: selBS });
  };

  const fmtQueue = (n) => String(n).padStart(2, '0');

  return (
    <div className="ap-root">
      <div className="ap-back-bar" onClick={onBack}>
        <Icons.Back />
        <span>Quay lại</span>
      </div>

      <div className="ap-main-card">
        <div className="ap-card-header">
          <span>Vui lòng chọn Bác sĩ</span>
        </div>

        <div className="ap-dropdown-wrap">
          <select className="ap-ck-select" value={selCK} onChange={handleChangeCK}>
            <option value="">Chuyên khoa</option>
            {chuyenKhoaOptions.map((ck) => (
              <option key={ck} value={ck}>{ck}</option>
            ))}
          </select>
          <span className="ap-select-arrow">▾</span>
        </div>

        <div className="ap-bs-list">
          {!selCK ? (
            <div className="ap-empty">
              <span>Vui lòng chọn chuyên khoa để xem danh sách bác sĩ</span>
            </div>
          ) : bacSiList.length === 0 ? (
            <div className="ap-empty">
              <span>Không có bác sĩ khả dụng cho chuyên khoa này</span>
            </div>
          ) : (
            bacSiList.map((bs) => (
              <div
                key={bs.id}
                className={`ap-bs-row ${selBS?.id === bs.id ? 'selected' : ''}`}
                onClick={() => setSelBS(bs)}
              >
                <div className="ap-bs-left">
                  <div className="ap-bs-name">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
                      <circle cx="8" cy="5.5" r="3" stroke="#e05a2b" strokeWidth="1.4"/>
                      <path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#e05a2b" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {bs.name} - {bs.session}
                  </div>
                  <div className="ap-bs-meta-row"><IconGender /><span>Giới tính: {bs.gender}</span></div>
                  <div className="ap-bs-meta-row"><IconSpec /><span>Chuyên khoa: {bs.spec}</span></div>
                  <div className="ap-bs-meta-row"><IconMoney /><span>Phí khám: {bs.fee}</span></div>
                </div>
                <div className="ap-bs-divider" />
                <div className="ap-bs-right">
                  <div className="ap-bs-room">Phòng khám: <strong>{bs.room}</strong></div>
                  <div className="ap-bs-queue">{fmtQueue(bs.currentQueue)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {selBS && (
          <div className="ap-confirm-bar">
            <div className="ap-confirm-info">
              <strong>{selCK}</strong> — {selBS.name} — Phòng {selBS.room}
            </div>
            <button className="ap-btn-confirm" onClick={handleConfirm}>
              Xác nhận tiếp nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptPage;