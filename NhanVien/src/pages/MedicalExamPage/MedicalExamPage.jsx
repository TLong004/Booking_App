import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import './MedicalExamPage.css';
import Icons from '../../components/Icons';

const MedicalExamPage = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { name: 'Bác sĩ', role: 'doctor' };
    } catch {
      return { name: 'Bác sĩ', role: 'doctor' };
    }
  });

  if (!state?.shift) {
    navigate('/', { replace: true });
    return null;
  }

  const activeMenu = pathname.includes('lich-truc') ? 'lich-truc' : 'benh-nhan';

  return (
    <div className="mep-root">

      {/* ── Sidebar ── */}
      <aside className="mep-sidebar">
        <div className="mep-sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="mep-logo-box">
            <span className="mep-logo-duck">THEDUCK</span>
            <span className="mep-logo-tagline">Hết lòng vì dân · Nâng tâm y tế</span>
          </div>
        </div>

        <div className="mep-sidebar-section">BÁC SĨ</div>

        <nav className="mep-sidebar-nav">
          <button
            className={`mep-sidebar-item ${activeMenu === 'benh-nhan' ? 'active' : ''}`}
            onClick={() => navigate('.', { state })}
          >
            <Icons.User />
            Bệnh nhân
          </button>
          <button
            className={`mep-sidebar-item ${activeMenu === 'lich-truc' ? 'active' : ''}`}
            onClick={() => navigate('lich-truc', { state })}
          >
            <Icons.Calendar />
            Lịch trực
          </button>
        </nav>

        <div className="mep-sidebar-footer">
          <div className="mep-user-info">
            <div className="mep-user-avatar">{user.name.charAt(0)}</div>
            <div className="mep-user-meta">
              <span className="mep-user-role">bác sĩ</span>
              <span className="mep-user-name">{user.name}</span>
            </div>
          </div>
          <button
            className="mep-btn-logout"
            onClick={() => { localStorage.removeItem('user'); navigate('/'); }}
          >
            <Icons.Logout />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="mep-main">
        <header className="mep-topbar">
          <div className="mep-topbar-left">
            <Icons.Building />
            <span>Phòng A104 — Khám răng · hàm · mặt</span>
          </div>
          <div
            className="mep-topbar-shift"
            style={
              state.shift === 'Buổi sáng'
                ? { background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309' }
                : { background: '#ede9fe', border: '1px solid #ddd6fe', color: '#6d28d9' }
            }
          >
            {state.shift === 'Buổi sáng' ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="3" stroke="#f59e0b" strokeWidth="1.4" />
                <path
                  d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M3.05 11.95l1.06-1.06M10.89 4.11l1.06-1.06"
                  stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M12 9A5.5 5.5 0 115 3a4 4 0 007 6z"
                  stroke="#6366f1" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            )}
            {state.shift}
          </div>
        </header>

        {/* ── Nội dung động render ở đây ── */}
        <Outlet />
      </main>

    </div>
  );
};

export default MedicalExamPage;