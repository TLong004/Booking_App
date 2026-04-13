import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Exampage.css';

const MOCK_HISTORY = [
  { id: 101, date: '05/01/2024', spec: 'Răng - hàm - mặt', trieu: 'Đau buốt răng khôn số 8', chuan: 'Sâu răng độ 3', taiKham: true, ngayTai: '2024-01-20' },
  { id: 102, date: '12/12/2023', spec: 'Khám tổng quát', trieu: 'Viêm họng, sốt nhẹ', chuan: 'Viêm họng cấp', taiKham: false, ngayTai: '' },
];

export default function ExamPage() {
  const navigate = useNavigate();
  const [trieu, setTrieu] = useState('Đau và nhứt răng cùng');
  const [chuan, setChuan] = useState('Sâu răng số 8');
  const [taiKham, setTaiKham] = useState(true);
  const [ngayTai, setNgayTai] = useState('2024-02-01');
  const [activeSec, setActiveSec] = useState('xn'); 
  const [xnList, setXnList] = useState([{ id: 1, ten: 'Xét nghiệm máu', chiDinh: 'Kiểm tra đường huyết' }]);
  const [toaList, setToaList] = useState([{ id: 1, ten: 'Paracetamol 500mg', lieu: '2 viên/ngày' }]);
  
  const [tmpXN, setTmpXN] = useState({ ten: '', chiDinh: '' });
  const [tmpToa, setTmpToa] = useState({ ten: '', lieu: '' });

  const handleViewHistory = (item) => {
    setTrieu(item.trieu);
    setChuan(item.chuan);
    setTaiKham(item.taiKham);
    setNgayTai(item.ngayTai);
    // Cuộn vùng chứa nội dung lên đầu
    document.querySelector('.ep-scroll-area').scrollTop = 0;
  };

  return (
    <div className="ep-embed-wrapper">
      {/* Header cố định */}
      <div className="ep-header-fixed">
        <button className="ep-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeftIcon /> Quay lại
        </button>
      </div>

      {/* Vùng cuộn nội bộ */}
      <div className="ep-scroll-area">
        <div className="ep-layout-grid">
          
          <aside className="ep-side">
            <div className="ep-card ep-patient-summary">
              <div className="ep-p-header">
                <div className="ep-p-avatar">BK</div>
                <div className="ep-p-meta">
                  <div className="ep-p-name">Nguyễn Thị Hà</div>
                  <div className="ep-p-gender">Nữ</div>
                </div>
              </div>
              <div className="ep-p-details">
                <div className="ep-p-item"><CalIcon /> <span>Ngày sinh:</span> 20/11/1985</div>
                <div className="ep-p-item"><PinIcon /> <span>Địa chỉ:</span> Tuyên Quang</div>
              </div>
              <div className="ep-history-box">
                <div className="ep-history-label"><ClockIcon /> Lịch sử khám bệnh</div>
                <div className="ep-history-list">
                  {MOCK_HISTORY.map(h => (
                    <div key={h.id} className="ep-history-card" onClick={() => handleViewHistory(h)}>
                      <div className="ep-h-main">
                        <div className="ep-h-date">{h.date}</div>
                        <div className="ep-h-spec">{h.spec}</div>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="ep-main">
            <div className="ep-card ep-main-card">
              <h2 className="ep-title">Tạo hồ sơ khám bệnh</h2>
              
              <div className="ep-form-stack">
                <div className="ep-outline-field">
                  <label>Triệu chứng *</label>
                  <input value={trieu} onChange={e => setTrieu(e.target.value)} />
                </div>
                
                <div className="ep-outline-field">
                  <label>Chuẩn đoán *</label>
                  <input value={chuan} onChange={e => setChuan(e.target.value)} />
                </div>

                <div className="ep-reexam-bar">
                  <label className="ep-checkbox">
                    <input type="checkbox" checked={taiKham} onChange={e => setTaiKham(e.target.checked)} />
                    Tái khám
                  </label>
                  <input type="date" className="ep-date-input" value={ngayTai} disabled={!taiKham} onChange={e => setNgayTai(e.target.value)} />
                </div>

                {/* Section Xét nghiệm */}
                <div className="ep-section">
                  <div className={`ep-sec-btn ${activeSec === 'xn' ? 'active' : ''}`} onClick={() => setActiveSec(activeSec === 'xn' ? '' : 'xn')}>
                    <ChevronDownIcon /> Thực hiện xét nghiệm
                  </div>
                  {activeSec === 'xn' && (
                    <div className="ep-sec-content">
                      <div className="ep-quick-add">
                        <input placeholder="Tên dịch vụ..." value={tmpXN.ten} onChange={e => setTmpXN({...tmpXN, ten: e.target.value})} />
                        <input placeholder="Chỉ định..." value={tmpXN.chiDinh} onChange={e => setTmpXN({...tmpXN, chiDinh: e.target.value})} />
                        <button onClick={() => setXnList([...xnList, {...tmpXN, id: Date.now()}])}>Thêm</button>
                      </div>
                      <table className="ep-table">
                        <thead><tr><th>#</th><th>Dịch vụ</th><th>Chỉ định</th><th>Xoá</th></tr></thead>
                        <tbody>
                          {xnList.map((x, i) => (
                            <tr key={x.id}><td>{i + 1}</td><td>{x.ten}</td><td>{x.chiDinh}</td><td><button className="ep-del-row" onClick={() => setXnList(xnList.filter(v => v.id !== x.id))}><TrashIcon /></button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Section Toa thuốc */}
                <div className="ep-section">
                  <div className={`ep-sec-btn ${activeSec === 'toa' ? 'active' : ''}`} onClick={() => setActiveSec(activeSec === 'toa' ? '' : 'toa')}>
                    <ChevronDownIcon /> Toa thuốc
                  </div>
                  {activeSec === 'toa' && (
                    <div className="ep-sec-content">
                      <div className="ep-quick-add">
                        <input placeholder="Tên thuốc..." value={tmpToa.ten} onChange={e => setTmpToa({...tmpToa, ten: e.target.value})} />
                        <input placeholder="Liều dùng..." value={tmpToa.lieu} onChange={e => setTmpToa({...tmpToa, lieu: e.target.value})} />
                        <button onClick={() => setToaList([...toaList, {...tmpToa, id: Date.now()}])}>Thêm</button>
                      </div>
                      <table className="ep-table">
                        <thead><tr><th>#</th><th>Tên thuốc</th><th>Liều dùng</th><th>Xoá</th></tr></thead>
                        <tbody>
                          {toaList.map((t, i) => (
                            <tr key={t.id}><td>{i + 1}</td><td>{t.ten}</td><td>{t.lieu}</td><td><button className="ep-del-row" onClick={() => setToaList(toaList.filter(v => v.id !== t.id))}><TrashIcon /></button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer trong Main Card */}
              <div className="ep-form-actions">
                <button className="ep-btn-draft">Lưu nháp</button>
                <button className="ep-btn-finish">Hoàn thành khám</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Icons (SVG rút gọn)
const ChevronLeftIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronDownIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const CalIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const PinIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const PhoneIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.09 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const ClockIcon = () => <svg width="14" height="14" fill="none" stroke="#0ea5e9" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>;