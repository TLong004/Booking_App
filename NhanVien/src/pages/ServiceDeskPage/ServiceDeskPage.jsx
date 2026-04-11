import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceDeskPage.css';

import Icons from '../../components/Icons';
import PatientCard from '../../components/PatientCard';
import CreateModal from '../../components/CreateModal';
import SuccessModal from '../../components/SuccessModal';
import AcceptPage from './AcceptPage';
import { MOCK_PATIENTS } from '../../data/mockData';

const ServiceDeskPage = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
        try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : { name: 'Điều dưỡng', role: 'Điều dưỡng' };
        } catch {
        return { name: 'Điều dưỡng', role: 'Điều dưỡng' };
        }
    });
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [notifCount] = useState(5);
  const [activeMenu, setActiveMenu] = useState('tiep-nhan');
  const [showModal, setShowModal] = useState(false);

  // view: 'list' | 'accept'
  const [view, setView] = useState('list');
  const [acceptingPatient, setAcceptingPatient] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSearch = () => {
    const filtered = MOCK_PATIENTS.filter((p) => {
      const matchName = searchName ? p.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchId = searchId ? p.phone.includes(searchId) || p.cccd.includes(searchId) : true;
      return matchName && matchId;
    });
    setPatients(filtered);
  };

  const handleAccept = (patient) => {
    setAcceptingPatient(patient);
    setView('accept');
  };

  const handleBack = () => {
    setView('list');
    setAcceptingPatient(null);
  };

  const handleConfirm = (data) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === data.patient.id && p.phone === data.patient.phone
          ? { ...p, accepted: true }
          : p
      )
    );
    setSuccessData(data);
    setView('list');
    setAcceptingPatient(null);
  };

  const handleCreateSubmit = (form) => {
    const newPatient = {
      id: 'BN' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      name: form.name,
      gender: form.gioiTinh || 'Đang cập nhật',
      dob: form.dob,
      phone: form.phone,
      cccd: form.cccd || 'Đang cập nhật',
      address: form.address,
      accepted: false,
    };
    setPatients((prev) => [newPatient, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="sdp-root">
      {/* ── Sidebar ── */}
      <aside className="sdp-sidebar">

        <div 
          className="sdp-sidebar-logo" 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="sdp-logo-box">
            <span className="sdp-logo-duck">THEDUCK</span>
            <span className="sdp-logo-tagline">Đặt lịch · Lấy số · Không chờ đợi</span>
          </div>
        </div>
        <div className="sdp-sidebar-section">QUẢN LÝ</div>
        <nav className="sdp-sidebar-nav">
          <button
            className={`sdp-sidebar-item ${activeMenu === 'tiep-nhan' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('tiep-nhan'); handleBack(); }}
          >
            <Icons.User />
            Tiếp nhận bệnh nhân
          </button>
        </nav>
        <div className="sdp-sidebar-footer">
          <div className="sdp-user-info">
            <div className="sdp-user-avatar">{user.name.charAt(0)}</div>
            <div className="sdp-user-meta">
              <span className="sdp-user-role">điều dưỡng</span>
              <span className="sdp-user-name">{user.name}</span>
            </div>
          </div>
          <button className="sdp-btn-logout" onClick={() => navigate('/login')}>
            <Icons.Logout />
            Đăng xuất
          </button>
        </div>
        <div className="sdp-notif-badge">{notifCount}</div>
      </aside>

      {/* ── Main ── */}
      <main className="sdp-main">
        <header className="sdp-topbar">
          <div className="sdp-topbar-left">
            <Icons.Building />
            <span>Quầy dịch vụ</span>
          </div>
          <div className="sdp-topbar-right">
            <div className="sdp-notif-icon">
              <Icons.Bell />
              <span className="sdp-notif-dot" />
            </div>
          </div>
        </header>

        {/* ── VIEW: Danh sách bệnh nhân ── */}
        {view === 'list' && (
          <div className="sdp-content">
            <div className="sdp-title-row">
              <h2 className="sdp-page-title">Tiếp nhận bệnh nhân</h2>
              <button className="sdp-btn-create" onClick={() => setShowModal(true)}>
                <Icons.Plus />
                Tạo hồ sơ
              </button>
            </div>

            {/* Search */}
            <div className="sdp-search-row">
              <div className="sdp-search-field">
                <span className="sdp-search-label">Tên</span>
                <input
                  className="sdp-search-input"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Nhập tên bệnh nhân"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="sdp-search-divider" />
              <div className="sdp-search-field">
                <span className="sdp-search-label">CCCD/ SĐT</span>
                <input
                  className="sdp-search-input"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Nhập CCCD hoặc số điện thoại"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="sdp-btn-search" onClick={handleSearch}>
                <Icons.Search />
                TÌM KIẾM
              </button>
            </div>

            {/* Grid */}
            <div className="sdp-grid">
              {patients.map((p, i) => (
                <PatientCard key={i} patient={p} onAccept={handleAccept} />
              ))}
              {patients.length === 0 && (
                <div className="sdp-empty">Không tìm thấy bệnh nhân phù hợp.</div>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW: Chọn chuyên khoa + bác sĩ ── */}
        {view === 'accept' && acceptingPatient && (
          <div className="sdp-content">
            <AcceptPage
              patient={acceptingPatient}
              onBack={handleBack}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onSubmit={handleCreateSubmit} />
      )}

      {/* Success Modal */}
      {successData && (
        <SuccessModal data={successData} onClose={() => setSuccessData(null)} />
      )}
    </div>
  );
};

export default ServiceDeskPage;