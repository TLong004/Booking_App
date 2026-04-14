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
      return stored ? JSON.parse(stored) : { name: 'Người dùng', role: 'doctor' };
    } catch {
      return { name: 'Người dùng', role: 'doctor' };
    }
  });

  // Kiểm tra quyền truy cập (Dành cho Bác sĩ và Trưởng khoa)
  if (!state?.shift && (user.role === 'doctor' || user.role === 'truong_khoa')) {
    navigate('/', { replace: true });
    return null;
  }

  // Xác định menu đang active dựa trên đường dẫn
  const getActiveMenu = () => {
    if (pathname.includes('tao-lich-truc')) return 'tao-lich';
    if (pathname.includes('danh-sach-lich')) return 'danh-sach';
    if (pathname.includes('lich-truc')) return 'lich-truc';
    return 'benh-nhan';
  };

  const activeMenu = getActiveMenu();

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

        <div className="mep-sidebar-section">
          {user.role === 'truong_khoa' ? 'TRƯỞNG KHOA' : 'BÁC SĨ'}
        </div>

        <nav className="mep-sidebar-nav">
          {/* Menu chung cho cả 2 role */}
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
            Lịch trực cá nhân
          </button>

          {/* Menu riêng cho Trưởng khoa */}
          {user.role === 'truong_khoa' && (
            <>
              <div className="mep-sidebar-divider" />
              <div className="mep-sidebar-section small">QUẢN LÝ KHOA</div>
              
              <button
                className={`mep-sidebar-item ${activeMenu === 'danh-sach' ? 'active' : ''}`}
                onClick={() => navigate('danh-sach-lich', { state })}
              >
                <Icons.List /> {/* Giả sử bạn có icon List */}
                Danh sách lịch trực
              </button>

              <button
                className={`mep-sidebar-item ${activeMenu === 'tao-lich' ? 'active' : ''}`}
                onClick={() => navigate('tao-lich-truc', { state })}
              >
                <Icons.Plus /> {/* Giả sử bạn có icon Plus */}
                Tạo lịch trực
              </button>
            </>
          )}
        </nav>

        <div className="mep-sidebar-footer">
          <div className="mep-user-info">
            <div className="mep-user-avatar">{user.name.charAt(0)}</div>
            <div className="mep-user-meta">
              <span className="mep-user-role">
                {user.role === 'truong_khoa' ? 'Trưởng khoa' : 'Bác sĩ'}
              </span>
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
          
          {state?.shift && (
            <div
              className="mep-topbar-shift"
              style={
                state.shift === 'Buổi sáng'
                  ? { background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309' }
                  : { background: '#ede9fe', border: '1px solid #ddd6fe', color: '#6d28d9' }
              }
            >
              {/* Icon mặt trời/mặt trăng giữ nguyên như code cũ */}
              {state.shift}
            </div>
          )}
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default MedicalExamPage;