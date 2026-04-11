import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icons from '../../components/Icons';
import SearchBar from '../../components/SearchBar';
import QueueTable from '../../components/QueueTable';
import EmptyState from '../../components/EmptyState';
import RoomPickerModal from '../../components/RoomPickerModal';
import QueueDisplay from '../../components/QueueDisplay';
import './NurseStationPage.css';
import { MOCK_QUEUE } from '../../data/mockData';

const NurseStationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

 const [user] = useState(() => {
    try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : { name: 'Điều dưỡng', role: 'Điều dưỡng' };
    } catch {
    return { name: 'Điều dưỡng', role: 'Điều dưỡng' };
    }
});
  const [activeMenu, setActiveMenu] = useState('tiep-nhan');

  const [room, setRoom] = useState(location.state?.room ?? null);
  const [showRoomPicker, setShowRoomPicker] = useState(!room);

  const [search, setSearch] = useState('');
  const [queue] = useState(MOCK_QUEUE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter(
      (r) =>
        r.ma.toLowerCase().includes(q) ||
        r.hoTen.toLowerCase().includes(q) ||
        r.sdt.includes(q)
    );
  }, [search, queue]);

  const handleRoomSelect = (selected) => {
    setRoom(selected);
    setShowRoomPicker(false);
  };

  return (
    <div className="ns-root">
      {/* ── Sidebar ── */}
      <aside className="ns-sidebar">
        <div className="ns-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="ns-logo-icon"><Icons.Building /></div>
          <div className="ns-logo-text">
            <span className="ns-logo-name">THEDUCK</span>
            <span className="ns-logo-sub">Hết lòng vì dân · Nâng tầm y tế</span>
          </div>
        </div>

        <div className="ns-sidebar-section">QUẢN LÝ</div>

        <nav className="ns-sidebar-nav">
          <button
            className={`ns-sidebar-item ${activeMenu === 'tiep-nhan' ? 'active' : ''}`}
            onClick={() => setActiveMenu('tiep-nhan')}
          >
            <Icons.User />
            Tiếp nhận bệnh nhân
          </button>
          <button
            className={`ns-sidebar-item ${activeMenu === 'so-thu-tu' ? 'active' : ''}`}
            onClick={() => setActiveMenu('so-thu-tu')}
          >
            <Icons.Queue />
            Số thứ tự
          </button>
        </nav>

        <div className="ns-sidebar-footer">
          <div className="ns-user-info">
            <div className="ns-user-avatar">{user.name.charAt(0)}</div>
            <div className="ns-user-meta">
              <span className="ns-user-role">{user.role}</span>
              <span className="ns-user-name">{user.name}</span>
            </div>
          </div>
          <button className="ns-btn-logout" onClick={() => navigate('/login')}>
            <Icons.Logout />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ns-main">
        {/* Topbar */}
        <header className="ns-topbar">
          <div className="ns-topbar-left">
            <Icons.Building />
            {room ? (
              <>
                <span className="ns-topbar-room">Phòng {room.room} - Chuyên khoa</span>
                <span className="ns-topbar-spec">{room.khoa}</span>
              </>
            ) : (
              <span className="ns-topbar-room">Chưa chọn phòng</span>
            )}
            <button className="ns-btn-change-room" onClick={() => setShowRoomPicker(true)}>
              {room ? 'Đổi phòng' : 'Chọn phòng'}
            </button>
          </div>
        </header>

        {/* Content — đổi theo activeMenu */}
        {activeMenu === 'tiep-nhan' && (
          <div className="ns-content">
            <div className="ns-content-top">
              <h2 className="ns-page-title">Tiếp nhận bệnh nhân</h2>
              <SearchBar value={search} onChange={setSearch} />
            </div>
            {filtered.length === 0 ? <EmptyState /> : <QueueTable rows={filtered} />}
          </div>
        )}

        {activeMenu === 'so-thu-tu' && (
          <QueueDisplay room={room} queue={queue} />
        )}
      </main>

      {/* Room Picker Modal */}
      {showRoomPicker && (
        <RoomPickerModal
          onClose={() => setShowRoomPicker(false)}
          onSelect={handleRoomSelect}
        />
      )}
    </div>
  );
};

export default NurseStationPage;