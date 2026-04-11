import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BAC_SI_DATA } from '../data/mockData';
import './RoomPickerModal.css';

const buildRoomList = () => {
  const grouped = {};
  Object.entries(BAC_SI_DATA).forEach(([khoa, bsList]) => {
    bsList.forEach((bs) => {
      if (!grouped[bs.room]) {
        grouped[bs.room] = { room: bs.room, khoa, doctors: [] };
      }
      grouped[bs.room].doctors.push({ ...bs, khoa });
    });
  });
  return Object.values(grouped).sort((a, b) => a.room.localeCompare(b.room));
};

const ROOM_LIST = buildRoomList();
const SESSION_ORDER = ['Buổi sáng', 'Buổi chiều'];

/* ── Icons ── */
const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="#aaa" strokeWidth="1.4"/>
    <path d="M9 9l3 3" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="3" fill="#0288d1"/>
    <line x1="7.5" y1="1" x2="7.5" y2="3" stroke="#0288d1" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="7.5" y1="12" x2="7.5" y2="14" stroke="#0288d1" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="1"   y1="7.5" x2="3"   y2="7.5" stroke="#0288d1" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="12"  y1="7.5" x2="14"  y2="7.5" stroke="#0288d1" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M12.5 9.5A5.5 5.5 0 014.5 2.5a5.5 5.5 0 107.9 7.9"
      stroke="#0288d1" strokeWidth="1.3" strokeLinecap="round" fill="#0288d1" fillOpacity="0.15"/>
  </svg>
);
const IconPerson = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="5" r="2.5" stroke="#e57373" strokeWidth="1.2"/>
    <path d="M2.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="#e57373" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IconPin = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" stroke="#888" strokeWidth="1.2"/>
    <circle cx="7" cy="5" r="1.3" stroke="#888" strokeWidth="1.1"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" fill="#0288d1"/>
    <path d="M4 7l2.5 2.5L10 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── DoctorCard ── */
const DoctorCard = ({ doctor, selected, onSelect }) => (
  <div
    className={`rpm-doctor-card${selected ? ' rpm-doctor-card--selected' : ''}`}
    onClick={() => onSelect(doctor)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect(doctor)}
  >
    {selected && (
      <span className="rpm-card-check"><IconCheck /></span>
    )}
    <div className="rpm-card-session">
      {doctor.session === 'Buổi sáng' ? <IconSun /> : <IconMoon />}
      <span className="rpm-card-session-label">{doctor.session}</span>
    </div>
    <div className="rpm-card-row">
      <IconPerson />
      <span className="rpm-card-name">{doctor.name}</span>
    </div>
    <div className="rpm-card-row">
      <IconPin />
      <span className="rpm-card-meta">{doctor.khoa}</span>
    </div>
  </div>
);

/* ── RoomPickerModal ── */
const RoomPickerModal = ({ onClose }) => {
  const navigate = useNavigate();

  const [search, setSearch]         = useState('');
  const [expanded, setExpanded]     = useState({});
  const [pendingDoc, setPendingDoc] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ROOM_LIST;
    return ROOM_LIST.filter(
      (r) =>
        r.room.toLowerCase().includes(q) ||
        r.khoa.toLowerCase().includes(q) ||
        r.doctors.some((d) => d.name.toLowerCase().includes(q))
    );
  }, [search]);

  const toggle = (room) => {
    setExpanded((prev) => ({ ...prev, [room]: !prev[room] }));
    setPendingDoc(null);
  };

  const handleCardClick = (doctor) => {
    setPendingDoc(doctor);
  };

  const handleConfirm = () => {
    if (!pendingDoc) return;

    const payload = {
      id:           pendingDoc.id,
      name:         pendingDoc.name,
      spec:         pendingDoc.spec,
      gender:       pendingDoc.gender,
      room:         pendingDoc.room,
      khoa:         pendingDoc.khoa,
      fee:          pendingDoc.fee,
      session:      pendingDoc.session,
      currentQueue: pendingDoc.currentQueue,
    };

    navigate('/nurse-station', { state: { room: payload } });
    onClose();
  };

  return (
    <div className="rpm-overlay" onClick={onClose}>
      <div className="rpm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="rpm-header">
          <div>
            <div className="rpm-title">Tìm kiếm phòng khám</div>
            <div className="rpm-subtitle">Vui lòng nhập tên phòng khám để tiếp tục</div>
          </div>
          <button className="rpm-close" onClick={onClose} aria-label="Đóng">
            <IconClose />
          </button>
        </div>

        {/* Search */}
        <div className="rpm-search-wrap">
          <label className="rpm-search-label">Tên phòng khám</label>
          <div className="rpm-search-inner">
            <IconSearch />
            <input
              className="rpm-search-input"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPendingDoc(null); }}
              placeholder="Nhập tên phòng hoặc chuyên khoa..."
              autoFocus
            />
            {search && (
              <button
                className="rpm-search-clear"
                onClick={() => { setSearch(''); setPendingDoc(null); }}
              >✕</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="rpm-list">
          {filtered.length === 0 ? (
            <div className="rpm-empty">Không tìm thấy phòng khám phù hợp</div>
          ) : (
            filtered.map((r) => {
              const bySession = {};
              SESSION_ORDER.forEach((s) => { bySession[s] = null; });
              r.doctors.forEach((d) => {
                if (!bySession[d.session]) bySession[d.session] = d;
              });
              const sessionDoctors = SESSION_ORDER.map((s) => bySession[s]).filter(Boolean);

              return (
                <div key={r.room} className="rpm-item">
                  <div className="rpm-item-row" onClick={() => toggle(r.room)}>
                    <span className="rpm-room-code">{r.room}</span>
                    <span className="rpm-room-khoa">{r.khoa}</span>
                    <span className="rpm-chevron"><IconChevron open={!!expanded[r.room]} /></span>
                  </div>

                  {expanded[r.room] && (
                    <div className="rpm-expanded">
                      <div className="rpm-session-title">Chọn ca trực</div>
                      <div className="rpm-cards-grid">
                        {sessionDoctors.map((d) => (
                          <DoctorCard
                            key={d.id}
                            doctor={d}
                            selected={pendingDoc?.id === d.id}
                            onSelect={handleCardClick}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {pendingDoc && (
          <div className="rpm-footer">
            <div className="rpm-footer-info">
              <span className="rpm-footer-room">Phòng {pendingDoc.room}</span>
              <span className="rpm-footer-sep">·</span>
              <span className="rpm-footer-session">{pendingDoc.session}</span>
              <span className="rpm-footer-sep">·</span>
              <span className="rpm-footer-doctor">{pendingDoc.name}</span>
            </div>
            <button className="rpm-btn-confirm" onClick={handleConfirm}>
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPickerModal;