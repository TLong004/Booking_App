import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Examqueuepage.css';
import { MOCK_QUEUE } from '../../data/mockData'; 

const PAGE_SIZE = 3;

export default function ExamQueuePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [queue]              = useState(MOCK_QUEUE);
  const [tab, setTab]        = useState('waiting');
  const [search, setSearch]  = useState('');
  const [page, setPage]      = useState(1);

  const waitingCount   = queue.filter(q => q.status === 'waiting').length;
  const examiningCount = queue.filter(q => q.status === 'examining').length;

  const filtered = useMemo(() => {
    let list = queue.filter(q => q.status === tab);
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(kw) ||
        r.patientId.toLowerCase().includes(kw)
      );
    }
    return list;
  }, [queue, tab, search]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage     = Math.min(Math.max(1, page), totalPages);
  const paginated   = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage     = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const handleTab    = (t) => { setTab(t); setPage(1); setSearch(''); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  return (
    <div className="eq-page">
      <h2 className="eq-title">Danh sách bệnh nhân</h2>

      <div className="eq-card">

        {/* Tabs */}
        <div className="eq-tabs">
          <button className={`eq-tab ${tab === 'waiting' ? 'active' : ''}`} onClick={() => handleTab('waiting')}>
            TIẾP NHẬN
            <span className={`eq-tab-badge ${tab === 'waiting' ? 'active' : ''}`}>{waitingCount}</span>
          </button>
          <button className={`eq-tab ${tab === 'examining' ? 'active' : ''}`} onClick={() => handleTab('examining')}>
            ĐANG KHÁM
            <span className={`eq-tab-badge ${tab === 'examining' ? 'active' : ''}`}>{examiningCount}</span>
          </button>
        </div>

        {/* Search */}
        <div className="eq-search-row">
          <div className="eq-search-box">
            <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="eq-search-input"
              placeholder="Tìm kiếm theo tên khách hàng"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <button className="eq-search-btn" onClick={() => handleSearch(search)}>TÌM KIẾM</button>
        </div>

        {/* Table */}
        <table className="eq-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã bệnh nhân</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Tuỳ Chọn</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="eq-empty">Không tìm thấy bệnh nhân phù hợp.</td>
              </tr>
            ) : paginated.map((r, idx) => (
              <tr key={r.id} className="eq-row">
                <td className="eq-td-num">{(curPage - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="eq-td-id">{r.patientId}</td>
                <td>{r.name}</td>
                <td>{r.dob}</td>
                <td>{r.gender}</td>
                <td>{r.address}</td>
                <td className="eq-td-action">
                  <button
                    className="eq-action-btn"
                    onClick={() => navigate('kham', { state: { ...state, patient: r } })}
                    title="Khám"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="eq-pagination">
          <button className="eq-page-arrow" disabled={curPage === 1} onClick={() => goToPage(curPage - 1)}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          {pageNumbers.map(p => (
            <button key={p} className={`eq-page-num ${p === curPage ? 'active' : ''}`} onClick={() => goToPage(p)}>
              {p}
            </button>
          ))}
          <button className="eq-page-arrow" disabled={curPage === totalPages} onClick={() => goToPage(curPage + 1)}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}