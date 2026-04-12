import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamHistoryPage.css';
import Icons from '../../components/Icons';

/* ─── Mock data ─────────────────────────────────────────────────────────── */
const MOCK_HISTORY = [
  {
    id: 'EX-2025-041',
    patientId: 'BN-2025-001',
    patientName: 'Trần Thị Bích Ngọc',
    gender: 'Nữ',
    dob: '12/03/1997',
    phone: '0901 234 567',
    date: '2025-04-14',
    displayDate: '14/04/2025',
    shift: 'Buổi sáng',
    reason: 'Đau răng hàm trên bên phải khi nhai',
    diagnosis: 'Sâu răng số 16 độ 3',
    treatment: 'Trám composite răng 16. Vệ sinh nha chu.',
    reexam: '28/04/2025',
    status: 'done',
    labs: [],
  },
  {
    id: 'EX-2025-040',
    patientId: 'BN-2025-002',
    patientName: 'Lê Minh Tuấn',
    gender: 'Nam',
    dob: '05/07/1990',
    phone: '0912 345 678',
    date: '2025-04-14',
    displayDate: '14/04/2025',
    shift: 'Buổi sáng',
    reason: 'Chảy máu chân răng kéo dài',
    diagnosis: 'Viêm nha chu mãn tính',
    treatment: 'Cạo cao vôi răng toàn hàm. Hướng dẫn chải răng đúng cách.',
    reexam: null,
    status: 'done',
    labs: [{ name: 'Xét nghiệm công thức máu', result: 'Chờ kết quả' }],
  },
  {
    id: 'EX-2025-038',
    patientId: 'BN-2025-005',
    patientName: 'Nguyễn Thị Hà',
    gender: 'Nữ',
    dob: '20/11/1985',
    phone: '0933 456 789',
    date: '2025-04-11',
    displayDate: '11/04/2025',
    shift: 'Buổi chiều',
    reason: 'Đau nhức toàn bộ hàm dưới, sưng má',
    diagnosis: 'Viêm quanh thân răng khôn hàm dưới',
    treatment: 'Kháng sinh Amoxicillin 500mg × 7 ngày. Tái khám nhổ răng khôn.',
    reexam: '18/04/2025',
    status: 'reexam',
    labs: [],
  },
  {
    id: 'EX-2025-037',
    patientId: 'BN-2025-007',
    patientName: 'Phạm Văn Đức',
    gender: 'Nam',
    dob: '14/02/1978',
    phone: '0944 567 890',
    date: '2025-04-11',
    displayDate: '11/04/2025',
    shift: 'Buổi sáng',
    reason: 'Kiểm tra định kỳ 6 tháng',
    diagnosis: 'Răng miệng bình thường',
    treatment: 'Cạo cao vôi. Đánh bóng răng.',
    reexam: null,
    status: 'done',
    labs: [],
  },
  {
    id: 'EX-2025-035',
    patientId: 'BN-2025-003',
    patientName: 'Phạm Hoàng Long',
    gender: 'Nam',
    dob: '08/09/2000',
    phone: '0955 678 901',
    date: '2025-04-10',
    displayDate: '10/04/2025',
    shift: 'Buổi sáng',
    reason: 'Răng cửa trên bị vỡ do chấn thương',
    diagnosis: 'Gãy thân răng 11 độ II',
    treatment: 'Phục hồi thân răng bằng composite. Chụp X-quang kiểm tra tủy.',
    reexam: '24/04/2025',
    status: 'reexam',
    labs: [{ name: 'X-quang răng số 11', result: 'Tủy còn sống' }],
  },
  {
    id: 'EX-2025-030',
    patientId: 'BN-2025-010',
    patientName: 'Võ Thị Lan',
    gender: 'Nữ',
    dob: '30/06/1995',
    phone: '0966 789 012',
    date: '2025-04-08',
    displayDate: '08/04/2025',
    shift: 'Buổi chiều',
    reason: 'Nhổ răng theo yêu cầu',
    diagnosis: 'Răng 48 lệch gần toàn phần',
    treatment: 'Phẫu thuật nhổ răng 48. Khâu 2 mũi.',
    reexam: '15/04/2025',
    status: 'reexam',
    labs: [],
  },
  {
    id: 'EX-2025-025',
    patientId: 'BN-2025-012',
    patientName: 'Đặng Quốc Hùng',
    gender: 'Nam',
    dob: '17/12/1988',
    phone: '0977 890 123',
    date: '2025-04-07',
    displayDate: '07/04/2025',
    shift: 'Buổi sáng',
    reason: 'Đau buốt khi uống nước lạnh',
    diagnosis: 'Tụt nướu, ê buốt cổ răng nhiều răng',
    treatment: 'Bôi fluoride. Tư vấn kem đánh răng chống ê buốt.',
    reexam: null,
    status: 'done',
    labs: [],
  },
];

/* Shifts per day in April 2025 (1=am, 2=pm, 0=off) */
const APRIL_SHIFTS = {
  1:'am',2:'pm',3:'off',4:'am',5:'pm',
  7:'am',8:'pm',9:'off',10:'am',11:'pm',12:'am',
  14:'am',15:'pm',16:'am',17:'off',18:'pm',
  21:'am',22:'pm',23:'am',24:'off',25:'pm',
  28:'am',29:'pm',30:'am',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const statusLabel = (s) => {
  if (s === 'done')   return { label: 'Hoàn thành', cls: 'ehp-badge-done' };
  if (s === 'reexam') return { label: 'Tái khám', cls: 'ehp-badge-reexam' };
  return                    { label: 'Chuyển viện', cls: 'ehp-badge-refer' };
};

const initials = (name) =>
  name.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

/* ─── Calendar ───────────────────────────────────────────────────────────── */
const Calendar = ({ year, month, selectedDay, onSelect }) => {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: daysInPrev - firstDow + 1 + i, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, other: false });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) cells.push({ day: i, other: true });
  }

  const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <>
      <div className="ehp-dow-row">
        {DOW.map((d) => <div key={d} className="ehp-dow">{d}</div>)}
      </div>
      <div className="ehp-day-grid">
        {cells.map((c, i) => {
          const shift = !c.other ? APRIL_SHIFTS[c.day] : null;
          const isToday = isCurrentMonth && !c.other && c.day === today.getDate();
          const isSelected = !c.other && c.day === selectedDay;
          return (
            <div
              key={i}
              className={`ehp-day${c.other ? ' other-month' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => !c.other && onSelect(c.day)}
            >
              <div className="ehp-day-num">{c.day}</div>
              {shift === 'am' && <div className="ehp-shift-dot ehp-dot-am" />}
              {shift === 'pm' && <div className="ehp-shift-dot ehp-dot-pm" />}
            </div>
          );
        })}
      </div>
      <div className="ehp-cal-legend">
        <div className="ehp-legend-item">
          <div className="ehp-legend-dot" style={{ background: '#f59e0b' }} />Buổi sáng
        </div>
        <div className="ehp-legend-item">
          <div className="ehp-legend-dot" style={{ background: '#6366f1' }} />Buổi chiều
        </div>
      </div>
    </>
  );
};

/* ─── Detail Drawer ──────────────────────────────────────────────────────── */
const DetailDrawer = ({ record, onClose }) => {
  if (!record) return null;
  const { label, cls } = statusLabel(record.status);
  return (
    <div className="ehp-drawer-overlay" onClick={onClose}>
      <div className="ehp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ehp-drawer-header">
          <span className="ehp-drawer-title">Chi tiết phiếu khám — {record.id}</span>
          <button className="ehp-drawer-close" onClick={onClose}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="ehp-drawer-body">
          {/* Patient info */}
          <div className="ehp-drawer-section">
            <div className="ehp-drawer-section-title">Thông tin bệnh nhân</div>
            <div className="ehp-info-grid">
              <div className="ehp-info-item">
                <span className="ehp-info-label">Họ tên</span>
                <span className="ehp-info-value">{record.patientName}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Mã BN</span>
                <span className="ehp-info-value" style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>{record.patientId}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Giới tính</span>
                <span className="ehp-info-value">{record.gender}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Ngày sinh</span>
                <span className="ehp-info-value">{record.dob}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Điện thoại</span>
                <span className="ehp-info-value">{record.phone}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Trạng thái</span>
                <span className={`ehp-badge ${cls}`} style={{ width: 'fit-content' }}>{label}</span>
              </div>
            </div>
          </div>

          {/* Visit info */}
          <div className="ehp-drawer-section">
            <div className="ehp-drawer-section-title">Thông tin lần khám</div>
            <div className="ehp-info-grid">
              <div className="ehp-info-item">
                <span className="ehp-info-label">Ngày khám</span>
                <span className="ehp-info-value">{record.displayDate}</span>
              </div>
              <div className="ehp-info-item">
                <span className="ehp-info-label">Ca khám</span>
                <span className={`ehp-shift-badge ${record.shift === 'Buổi sáng' ? 'ehp-shift-am' : 'ehp-shift-pm'}`}
                  style={{ width: 'fit-content' }}>
                  {record.shift}
                </span>
              </div>
              {record.reexam && (
                <div className="ehp-info-item">
                  <span className="ehp-info-label">Ngày tái khám</span>
                  <span className="ehp-info-value" style={{ color: '#d97706' }}>{record.reexam}</span>
                </div>
              )}
            </div>
          </div>

          {/* Clinical notes */}
          <div className="ehp-drawer-section">
            <div className="ehp-drawer-section-title">Ghi chú lâm sàng</div>
            <div className="ehp-drawer-field">
              <div className="ehp-drawer-field-label">Lý do khám</div>
              <div className="ehp-drawer-field-value">{record.reason}</div>
            </div>
            <div className="ehp-drawer-field">
              <div className="ehp-drawer-field-label">Chẩn đoán</div>
              <div className="ehp-drawer-field-value">{record.diagnosis}</div>
            </div>
            <div className="ehp-drawer-field">
              <div className="ehp-drawer-field-label">Phương án điều trị</div>
              <div className="ehp-drawer-field-value">{record.treatment}</div>
            </div>
          </div>

          {/* Labs */}
          {record.labs?.length > 0 && (
            <div className="ehp-drawer-section">
              <div className="ehp-drawer-section-title">Xét nghiệm / Chẩn đoán hình ảnh</div>
              {record.labs.map((lab, i) => (
                <div key={i} className="ehp-drawer-field">
                  <div className="ehp-drawer-field-label">{lab.name}</div>
                  <div className="ehp-drawer-field-value">{lab.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main page ──────────────────────────────────────────────────────────── */
const ExamHistoryPage = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : { name: 'Bác sĩ', role: 'doctor' };
    } catch { return { name: 'Bác sĩ', role: 'doctor' }; }
  });

  const [activeMenu, setActiveMenu] = useState('lich-su');
  const [calYear]  = useState(2025);
  const [calMonth] = useState(3); // April = index 3
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);

  const PAGE_SIZE = 5;

  /* Filter logic */
  const filtered = useMemo(() => {
    let list = MOCK_HISTORY;

    if (selectedDay) {
      const pad = String(selectedDay).padStart(2, '0');
      list = list.filter((r) => r.displayDate.startsWith(pad));
    }

    if (activeTab === 'reexam') list = list.filter((r) => r.status === 'reexam');
    if (activeTab === 'done')   list = list.filter((r) => r.status === 'done');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.patientName.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          r.diagnosis.toLowerCase().includes(q),
      );
    }

    return list;
  }, [selectedDay, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* Stats */
  const total   = MOCK_HISTORY.length;
  const thisMonth = MOCK_HISTORY.filter((r) => r.date.startsWith('2025-04')).length;
  const reexams = MOCK_HISTORY.filter((r) => r.status === 'reexam').length;
  const withLabs = MOCK_HISTORY.filter((r) => r.labs?.length > 0).length;

  const MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                     'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

  return (
    <div className="ehp-root">

      {/* ── Sidebar ── */}
      <aside className="ehp-sidebar">
        <div className="ehp-sidebar-logo" onClick={() => navigate('/')}>
          <div className="ehp-logo-box">
            <span className="ehp-logo-duck">THEDUCK</span>
            <span className="ehp-logo-tagline">Hết lòng vì dân · Nâng tâm y tế</span>
          </div>
        </div>

        <div className="ehp-sidebar-section">Bác sĩ</div>

        <nav className="ehp-sidebar-nav">
          <button
            className={`ehp-sidebar-item ${activeMenu === 'benh-nhan' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('benh-nhan'); navigate('/kham-benh'); }}
          >
            <Icons.User />
            Bệnh nhân
          </button>
          <button
            className={`ehp-sidebar-item ${activeMenu === 'lich-su' ? 'active' : ''}`}
            onClick={() => setActiveMenu('lich-su')}
          >
            <Icons.Calendar />
            Lịch sử khám bệnh
          </button>
        </nav>

        <div className="ehp-sidebar-footer">
          <div className="ehp-user-info">
            <div className="ehp-user-avatar">{user.name.charAt(0)}</div>
            <div className="ehp-user-meta">
              <span className="ehp-user-role">bác sĩ</span>
              <span className="ehp-user-name">{user.name}</span>
            </div>
          </div>
          <button
            className="ehp-btn-logout"
            onClick={() => { localStorage.removeItem('user'); navigate('/'); }}
          >
            <Icons.Logout />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ehp-main">
        <header className="ehp-topbar">
          <div className="ehp-topbar-left">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Phòng A104 — Khám răng · hàm · mặt
          </div>
        </header>

        <div className="ehp-content">

          {/* Page header + search */}
          <div className="ehp-page-header">
            <div>
              <h2 className="ehp-page-title">Lịch sử khám bệnh</h2>
              <p className="ehp-page-sub">Tháng 4, 2025 · Phòng A104</p>
            </div>
            <div className="ehp-search-box">
              <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="ehp-search-input"
                placeholder="Tìm bệnh nhân, mã, chẩn đoán..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="ehp-stats-row">
            <div className="ehp-stat-card">
              <div className="ehp-stat-label">Tổng lượt khám</div>
              <div className="ehp-stat-value">{total}</div>
              <div className="ehp-stat-sub">Tất cả thời gian</div>
            </div>
            <div className="ehp-stat-card">
              <div className="ehp-stat-label">Tháng này</div>
              <div className="ehp-stat-value blue">{thisMonth}</div>
              <div className="ehp-stat-sub">Tháng 04/2025</div>
            </div>
            <div className="ehp-stat-card">
              <div className="ehp-stat-label">Cần tái khám</div>
              <div className="ehp-stat-value amber">{reexams}</div>
              <div className="ehp-stat-sub">Có lịch hẹn</div>
            </div>
            <div className="ehp-stat-card">
              <div className="ehp-stat-label">Có xét nghiệm</div>
              <div className="ehp-stat-value green">{withLabs}</div>
              <div className="ehp-stat-sub">Lượt có kết quả</div>
            </div>
          </div>

          {/* Layout: Calendar + Records */}
          <div className="ehp-layout">

            {/* Calendar */}
            <div className="ehp-cal-card">
              <div className="ehp-cal-header">
                <span className="ehp-cal-title">{MONTHS_VI[calMonth]}, {calYear}</span>
                <div className="ehp-cal-nav">
                  <button className="ehp-cal-nav-btn" title="Tháng trước">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button className="ehp-cal-nav-btn" title="Tháng sau">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <Calendar
                year={calYear}
                month={calMonth}
                selectedDay={selectedDay}
                onSelect={(d) => {
                  setSelectedDay((prev) => (prev === d ? null : d));
                  setPage(1);
                }}
              />
            </div>

            {/* Records panel */}
            <div className="ehp-right-panel">
              {/* Tabs */}
              <div className="ehp-tab-bar">
                {[
                  { key: 'all',    label: `Tất cả (${MOCK_HISTORY.length})` },
                  { key: 'reexam', label: `Tái khám (${reexams})` },
                  { key: 'done',   label: 'Hoàn thành' },
                ].map((t) => (
                  <button
                    key={t.key}
                    className={`ehp-tab ${activeTab === t.key ? 'active' : ''}`}
                    onClick={() => { setActiveTab(t.key); setPage(1); }}
                  >
                    {t.label}
                  </button>
                ))}
                {selectedDay && (
                  <button
                    className="ehp-tab active"
                    style={{ marginLeft: 'auto', fontSize: 12, color: '#d97706' }}
                    onClick={() => { setSelectedDay(null); setPage(1); }}
                  >
                    Ngày {String(selectedDay).padStart(2, '0')}/04 ×
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="ehp-table-wrap">
                <table className="ehp-table">
                  <thead>
                    <tr>
                      <th>Bệnh nhân</th>
                      <th>Ngày khám</th>
                      <th>Ca</th>
                      <th>Chẩn đoán</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr className="ehp-empty-rows">
                        <td colSpan={6}>Không có dữ liệu phù hợp.</td>
                      </tr>
                    ) : (
                      paginated.map((r) => {
                        const { label, cls } = statusLabel(r.status);
                        return (
                          <tr key={r.id} onClick={() => setDrawer(r)}>
                            <td>
                              <div className="ehp-patient-cell">
                                <div className="ehp-pt-avatar">{initials(r.patientName)}</div>
                                <div>
                                  <div className="ehp-pt-name">{r.patientName}</div>
                                  <div className="ehp-pt-id">{r.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>{r.displayDate}</td>
                            <td>
                              <span className={`ehp-shift-badge ${r.shift === 'Buổi sáng' ? 'ehp-shift-am' : 'ehp-shift-pm'}`}>
                                {r.shift === 'Buổi sáng' ? 'Sáng' : 'Chiều'}
                              </span>
                            </td>
                            <td><div className="ehp-diag-text">{r.diagnosis}</div></td>
                            <td><span className={`ehp-badge ${cls}`}>{label}</span></td>
                            <td>
                              <button
                                className="ehp-view-btn"
                                onClick={(e) => { e.stopPropagation(); setDrawer(r); }}
                              >
                                Chi tiết
                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M9 18l6-6-6-6" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="ehp-table-footer">
                  <span>
                    {filtered.length === 0
                      ? 'Không có kết quả'
                      : `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} / ${filtered.length} lượt khám`}
                  </span>
                  <div className="ehp-pagination">
                    <button
                      className="ehp-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`ehp-page-btn ${p === currentPage ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="ehp-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail drawer */}
      {drawer && <DetailDrawer record={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
};

export default ExamHistoryPage;