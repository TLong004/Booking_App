import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MOCK_QUEUE = [
  { id: 'STT-001', patientId: 'BN-2025-014', name: 'Trần Thị Bích Ngọc', gender: 'Nữ', dob: '12/03/1997', reason: 'Đau răng hàm trên bên phải', checkedIn: '07:42', status: 'waiting' },
  { id: 'STT-002', patientId: 'BN-2025-021', name: 'Lê Minh Tuấn',        gender: 'Nam', dob: '05/07/1990', reason: 'Chảy máu chân răng kéo dài', checkedIn: '07:55', status: 'done' },
  { id: 'STT-003', patientId: 'BN-2025-008', name: 'Nguyễn Thị Hà',       gender: 'Nữ', dob: '20/11/1985', reason: 'Đau nhức toàn bộ hàm dưới, sưng má', checkedIn: '08:10', status: 'done' },
  { id: 'STT-004', patientId: 'BN-2025-033', name: 'Phạm Văn Đức',        gender: 'Nam', dob: '14/02/1978', reason: 'Kiểm tra định kỳ 6 tháng', checkedIn: '08:22', status: 'waiting' },
  { id: 'STT-005', patientId: 'BN-2025-011', name: 'Phạm Hoàng Long',     gender: 'Nam', dob: '08/09/2000', reason: 'Răng cửa trên bị vỡ do chấn thương', checkedIn: '08:35', status: 'waiting' },
  { id: 'STT-006', patientId: 'BN-2025-045', name: 'Võ Thị Lan',          gender: 'Nữ', dob: '30/06/1995', reason: 'Nhổ răng theo yêu cầu', checkedIn: '08:50', status: 'waiting' },
  { id: 'STT-007', patientId: 'BN-2025-017', name: 'Đặng Quốc Hùng',     gender: 'Nam', dob: '17/12/1988', reason: 'Đau buốt khi uống nước lạnh', checkedIn: '09:05', status: 'done' },
  { id: 'STT-008', patientId: 'BN-2025-052', name: 'Hoàng Thị Thu',       gender: 'Nữ', dob: '03/04/1993', reason: 'Mọc răng khôn đau nhức', checkedIn: '09:18', status: 'waiting' },
  { id: 'STT-009', patientId: 'BN-2025-028', name: 'Bùi Văn Nam',         gender: 'Nam', dob: '22/08/1982', reason: 'Răng lung lay, muốn nhổ', checkedIn: '09:30', status: 'waiting' },
  { id: 'STT-010', patientId: 'BN-2025-061', name: 'Lý Thị Hồng',        gender: 'Nữ', dob: '14/01/2001', reason: 'Khám chỉnh nha lần đầu', checkedIn: '09:45', status: 'waiting' },
  { id: 'STT-011', patientId: 'BN-2025-039', name: 'Trịnh Văn Bình',     gender: 'Nam', dob: '09/05/1975', reason: 'Đau hàm khi há miệng rộng', checkedIn: '10:00', status: 'waiting' },
  { id: 'STT-012', patientId: 'BN-2025-072', name: 'Cao Thị Mỹ Duyên',   gender: 'Nữ', dob: '27/10/1999', reason: 'Tẩy trắng răng', checkedIn: '10:15', status: 'waiting' },
];

const PAGE_SIZE = 3;
const initials = (name) => name.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

const S = {
  content:     { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 },
  pageTitle:   { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 },
  pageSub:     { fontSize: 12.5, color: '#94a3b8', margin: '3px 0 0' },
  toolbar:     { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  searchWrap:  { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, padding: '0 12px', height: 38, flex: '1 1 220px' },
  searchInput: { border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', background: 'transparent', flex: 1, fontFamily: 'inherit' },
  filterBtn:   (on) => ({ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 38, borderRadius: 9, border: '1px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: on ? '#1d4ed8' : '#fff', borderColor: on ? '#1d4ed8' : '#e2e8f0', color: on ? '#fff' : '#64748b' }),
  countPill:   (on) => ({ marginLeft: 2, padding: '1px 7px', borderRadius: 99, fontSize: 11, background: on ? 'rgba(255,255,255,0.22)' : '#f1f5f9', color: on ? '#fff' : '#64748b' }),
  dot:         (c) => ({ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }),
  tableCard:   { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' },
  table:       { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:          { padding: '11px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #f1f5f9', background: '#fafbfc' },
  td:          { padding: '13px 14px', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
  ptCell:      { display: 'flex', alignItems: 'center', gap: 10 },
  ptAvatar:    { width: 34, height: 34, borderRadius: 9, background: '#dbeafe', color: '#1d4ed8', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ptName:      { fontSize: 13.5, fontWeight: 600, color: '#1e293b' },
  ptId:        { fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' },
  sttBadge:    (done) => ({ width: 30, height: 30, borderRadius: 8, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#f0fdf4' : '#eff6ff', color: done ? '#16a34a' : '#1d4ed8' }),
  badgeWait:   { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' },
  badgeDone:   { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
  btnPrimary:  { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 7, border: 'none', background: '#1d4ed8', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' },
  btnSecond:   { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12.5, fontWeight: 500, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' },
  footer:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f1f5f9', fontSize: 12.5, color: '#94a3b8' },
  paginate:    { display: 'flex', alignItems: 'center', gap: 4 },
  pageBtn:     (on, dis) => ({ width: 30, height: 30, borderRadius: 7, border: '1px solid', fontSize: 12.5, fontWeight: on ? 700 : 500, cursor: dis ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#1d4ed8' : '#fff', borderColor: on ? '#1d4ed8' : '#e2e8f0', color: on ? '#fff' : dis ? '#cbd5e1' : '#475569', opacity: dis ? 0.5 : 1 }),
  empty:       { textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 13.5 },
};

export default function ExamQueuePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [queue, setQueue]   = useState(MOCK_QUEUE);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage]     = useState(1);

  const shift        = state?.shift || 'Buổi sáng';
  const waitingCount = queue.filter((q) => q.status === 'waiting').length;
  const doneCount    = queue.filter((q) => q.status === 'done').length;

  const filtered = useMemo(() => {
    let list = queue;
    if (filter === 'waiting') list = list.filter((q) => q.status === 'waiting');
    if (filter === 'done')    list = list.filter((q) => q.status === 'done');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q),
      );
    }
    return list;
  }, [queue, filter, search]);

  // FIX: tính totalPages và curPage độc lập, clamp page mỗi lần render
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage    = Math.min(Math.max(1, page), totalPages);
  const paginated  = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  // FIX: goToPage luôn clamp vào đúng range
  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // FIX: reset page về 1 khi đổi filter hoặc search
  const handleFilter = (f) => { setFilter(f); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  const toggleDone = (id) =>
    setQueue((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === 'done' ? 'waiting' : 'done' } : r));

  // FIX: pre-compute pageNumbers — luôn có ít nhất 1 phần tử
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const FILTERS = [
    { key: 'all',     label: 'Tất cả',    count: queue.length },
    { key: 'waiting', label: 'Chưa khám', count: waitingCount, dot: '#f59e0b', dotOn: '#fbbf24' },
    { key: 'done',    label: 'Đã khám',   count: doneCount,    dot: '#16a34a', dotOn: '#86efac' },
  ];

  return (
    <div style={S.content}>

      {/* Header */}
      <div>
        <h2 style={S.pageTitle}>Danh sách bệnh nhân</h2>
        <p style={S.pageSub}>14/04/2025 · {shift}</p>
      </div>

      {/* Toolbar */}
      <div style={S.toolbar}>
        <div style={S.searchWrap}>
          <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            style={S.searchInput}
            placeholder="Tìm tên, mã bệnh nhân, lý do khám..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => handleSearch('')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {FILTERS.map((f) => (
          <button key={f.key} style={S.filterBtn(filter === f.key)} onClick={() => handleFilter(f.key)}>
            {f.dot && <span style={S.dot(filter === f.key ? f.dotOn : f.dot)} />}
            {f.label}
            <span style={S.countPill(filter === f.key)}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={S.tableCard}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>STT</th>
              <th style={S.th}>Bệnh nhân</th>
              <th style={S.th}>Giờ đăng ký</th>
              <th style={S.th}>Lý do khám</th>
              <th style={S.th}>Trạng thái</th>
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6}>
                <div style={S.empty}>
                  <svg width="36" height="36" fill="none" stroke="#cbd5e1" strokeWidth="1.4" viewBox="0 0 24 24"
                    style={{ margin: '0 auto 10px', display: 'block' }}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  Không tìm thấy bệnh nhân phù hợp.
                </div>
              </td></tr>
            ) : paginated.map((r) => (
              <tr key={r.id}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <td style={{ ...S.td, width: 52 }}>
                  <div style={S.sttBadge(r.status === 'done')}>{r.id.replace('STT-', '')}</div>
                </td>
                <td style={S.td}>
                  <div style={S.ptCell}>
                    <div style={S.ptAvatar}>{initials(r.name)}</div>
                    <div>
                      <div style={S.ptName}>{r.name}</div>
                      <div style={S.ptId}>{r.patientId} · {r.gender} · {r.dob}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...S.td, whiteSpace: 'nowrap', color: '#475569' }}>{r.checkedIn}</td>
                <td style={{ ...S.td, maxWidth: 220 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#334155' }}>
                    {r.reason}
                  </div>
                </td>
                <td style={S.td}>
                  {r.status === 'waiting'
                    ? <span style={S.badgeWait}><span style={S.dot('#f59e0b')} />Chưa khám</span>
                    : <span style={S.badgeDone}><span style={S.dot('#16a34a')} />Đã khám</span>}
                </td>
                <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {r.status === 'waiting' && (
                      <button style={S.btnPrimary} onClick={(e) => { e.stopPropagation(); navigate('kham', { state: { ...state, patient: r } }); }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
                        </svg>
                        Khám
                      </button>
                    )}
                    <button style={S.btnSecond} onClick={(e) => { e.stopPropagation(); toggleDone(r.id); }}>
                      {r.status === 'done' ? (
                        <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>Huỷ</>
                      ) : (
                        <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>Xong</>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FIX: Footer luôn render, dùng curPage thay vì page */}
        <div style={S.footer}>
          <span>
            {filtered.length === 0
              ? 'Không có kết quả'
              : `${(curPage - 1) * PAGE_SIZE + 1}–${Math.min(curPage * PAGE_SIZE, filtered.length)} / ${filtered.length} bệnh nhân`}
          </span>
          <div style={S.paginate}>
            <button style={S.pageBtn(false, curPage === 1)} disabled={curPage === 1} onClick={() => goToPage(curPage - 1)}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {/* FIX: dùng pageNumbers pre-computed, không tính inline */}
            {pageNumbers.map((p) => (
              <button key={p} style={S.pageBtn(p === curPage, false)} onClick={() => goToPage(p)}>{p}</button>
            ))}
            <button style={S.pageBtn(false, curPage === totalPages)} disabled={curPage === totalPages} onClick={() => goToPage(curPage + 1)}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}