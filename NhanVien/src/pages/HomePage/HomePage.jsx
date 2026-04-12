import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import RoomPickerModal from '../../components/RoomPickerModal';
import ShiftPickerModal from '../../components/Shiftpickermodal ';

// ─── Menu theo role ───────────────────────────────────────────────────────────
const ROLE_MENUS = {
  receptionist: [
    {
      label: 'Quầy dịch vụ',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1" y="4" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M1 8h13" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      ),
      path: '/quay-dich-vu',
    },
    {
      label: 'Phòng khám',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v4M5.5 3h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <rect x="1" y="5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="4" y="8" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="8" y="8" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      action: 'room-picker',
    },
  ],
  doctor: [
    {
      label: 'Khám chữa bệnh',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M2 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      action: 'shift-picker',
    },
    {
      label: 'Lịch trực',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M1 6h13" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1v2M10 1v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M4 9h3M4 11.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      path: '/lich-truc',
    },
  ],
  truong_khoa: [
    {
      label: 'Khám chữa bệnh',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M2 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      action: 'shift-picker',
    },
    {
      label: 'Lịch trực',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M1 6h13" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1v2M10 1v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M4 9h3M4 11.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      path: '/lich-truc',
    },
    {
      label: 'Tạo lịch trực',
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M1 6h13" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1v2M10 1v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M7.5 9v3M6 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      path: '/tao-lich-truc',
    },
  ],
};

const ROLE_LABELS = {
  receptionist: 'Tiếp tân',
  doctor: 'Bác sĩ',
  truong_khoa: 'Trưởng khoa',
};

const ROLE_COLORS = {
  receptionist: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  doctor:       { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  truong_khoa:  { bg: '#fdf4ff', text: '#6b21a8', border: '#e9d5ff' },
};

// ─── Component ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRoomPicker, setShowRoomPicker]   = useState(false); // tiếp tân
  const [showShiftPicker, setShowShiftPicker] = useState(false); // bác sĩ / trưởng khoa
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
  };

  const handleMenuClick = (item) => {
    setDropdownOpen(false);
    if (item.action === 'room-picker') {
      setShowRoomPicker(true);
    } else if (item.action === 'shift-picker') {
      setShowShiftPicker(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Tiếp tân chọn phòng xong → lưu / điều hướng tuỳ business logic
  const handleRoomSelect = (room) => {
    console.log('Phòng đã chọn (tiếp tân):', room);
    setShowRoomPicker(false);
  };

  // Bác sĩ / trưởng khoa chọn ca xong → điều hướng vào trang khám
  const handleShiftSelect = (shift) => {
    // shift = 'Buổi sáng' | 'Buổi chiều'
    setShowShiftPicker(false);
    navigate('/kham-benh', { state: { shift } });
  };

  const roleMenuItems = user ? ROLE_MENUS[user.role] || [] : [];
  const roleColor     = user ? ROLE_COLORS[user.role] : null;

  return (
    <div className="home-page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-title">THEDUCK</span>
          <span className="logo-sub">Đặt lịch · Lấy số · Không chờ đợi</span>
        </div>

        <div className="navbar-links">
          <a href="/" className="active">Trang chủ</a>
          <a href="/gioi-thieu">Giới thiệu</a>
          <a href="/quy-trinh">Quy trình</a>
          <a href="/thac-mac">Thắc mắc</a>
          <a href="/lien-he">Liên hệ</a>
        </div>

        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button
              className="btn-user"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <span className="user-name">{user.name}</span>
              <svg
                className={`chevron ${dropdownOpen ? 'open' : ''}`}
                width="12" height="12" viewBox="0 0 12 12" fill="none"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {/* User info */}
                <div className="dropdown-info">
                  <div className="dropdown-name">{user.name}</div>
                  <div className="dropdown-phone">{user.phone}</div>
                  <span
                    className="dropdown-role-badge"
                    style={{
                      background: roleColor?.bg,
                      color:      roleColor?.text,
                      border:     `1px solid ${roleColor?.border}`,
                    }}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>

                <div className="dropdown-divider" />

                {/* Menu theo role */}
                {roleMenuItems.map((item) => (
                  <button
                    key={item.path || item.action}
                    className="dropdown-item"
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <div className="dropdown-divider" />

                {/* Đăng xuất */}
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5"
                      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-login-nav" onClick={() => navigate('/login')}>
            ĐĂNG NHẬP
          </button>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="deco deco-1" />
        <div className="deco deco-2" />

        <div className="hero-left">
          <div className="hero-inner">
            <h1 className="hero-title">
              Chúng tôi ở đây<br />
              <span>vì sức khoẻ</span><br />
              của bạn
            </h1>
            <p className="hero-desc">
              Người có sức khoẻ là người có hy vọng, người có hy vọng là người có tất cả.
              Hãy trao cho chúng tôi niềm tin — chúng tôi sẽ trao lại cho bạn hy vọng.
            </p>
            <button className="btn-hero" onClick={() => navigate('/gioi-thieu')}>
              Tìm hiểu về chúng tôi
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrap">
            <img src="/assets/doctor.png" alt="Bác sĩ" className="hero-img" />
          </div>
        </div>
      </section>

      {/* ── Modal: Tiếp tân chọn phòng ── */}
      {showRoomPicker && (
        <RoomPickerModal
          onClose={() => setShowRoomPicker(false)}
          onSelect={handleRoomSelect}
        />
      )}

      {/* ── Modal: Bác sĩ / Trưởng khoa chọn ca trực ── */}
      {showShiftPicker && (
        <ShiftPickerModal
          onClose={() => setShowShiftPicker(false)}
          onSelect={handleShiftSelect}
        />
      )}

    </div>
  );
};

export default HomePage;