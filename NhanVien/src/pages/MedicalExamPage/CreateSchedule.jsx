import React, { useState } from 'react';
import './CreateSchedule.css';
import Icons from '../../components/Icons';

const CreateSchedule = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    shift: 'Buổi sáng',
    room: 'A104',
    note: ''
  });

  const [history, setHistory] = useState([
    { id: 1, dr: 'PGS. Đức Xuân Minh', date: '2024-01-20', shift: 'Sáng', room: 'A104' },
    { id: 2, dr: 'BS. Nguyễn Thị Thu', date: '2024-01-21', shift: 'Chiều', room: 'A105' },
  ]);

  const mockDoctors = [
    { id: 'dr1', name: 'PGS. Đức Xuân Minh', spec: 'Răng Hàm Mặt' },
    { id: 'dr2', name: 'BS. Nguyễn Thị Thu', spec: 'Nha khoa thẩm mỹ' },
    { id: 'dr3', name: 'ThS. Lê Văn Nam', spec: 'Phẫu thuật hàm mặt' },
  ];

  const rooms = ['A104', 'A105', 'A106'];

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra trùng lịch giả lập
    const isDuplicate = history.some(item => item.date === formData.date && item.shift.includes(formData.shift.slice(-4)) && item.room === formData.room);
    
    if (isDuplicate) {
      alert("Cảnh báo: Phòng này đã có bác sĩ trực vào thời gian đã chọn!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      dr: mockDoctors.find(d => d.id === formData.doctorId)?.name,
      date: formData.date,
      shift: formData.shift === 'Buổi sáng' ? 'Sáng' : 'Chiều',
      room: formData.room
    };

    setHistory([newEntry, ...history]);
    alert("Tạo lịch trực thành công!");
    // Reset form một phần
    setFormData({ ...formData, doctorId: '', note: '' });
  };

  return (
    <div className="mep-content cs-fade-in">
      <div className="cs-container">
        {/* BÊN TRÁI: FORM TẠO LỊCH */}
        <div className="cs-form-section">
          <div className="cs-card">
            <h2 className="cs-title">Thiết lập lịch trực mới</h2>
            <p className="cs-subtitle">Chọn bác sĩ và phân bổ ca làm việc cho khoa</p>

            <form onSubmit={handleSubmit} className="cs-main-form">
              <div className="cs-form-group">
                <label><Icons.User /> Chọn bác sĩ</label>
                <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} required>
                  <option value="">-- Danh sách bác sĩ trong khoa --</option>
                  {mockDoctors.map(dr => (
                    <option key={dr.id} value={dr.id}>{dr.name} ({dr.spec})</option>
                  ))}
                </select>
              </div>

              <div className="cs-form-row">
                <div className="cs-form-group">
                  <label><Icons.Calendar /> Ngày trực</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="cs-form-group">
                  <label><Icons.Clock /> Ca làm việc</label>
                  <select name="shift" value={formData.shift} onChange={handleInputChange}>
                    <option value="Buổi sáng">Buổi sáng (07:30 - 11:30)</option>
                    <option value="Buổi chiều">Buổi chiều (13:30 - 17:30)</option>
                  </select>
                </div>
              </div>

              <div className="cs-form-group">
                <label><Icons.Building /> Phòng khám định danh</label>
                <select name="room" value={formData.room} onChange={handleInputChange}>
                  {rooms.map(r => <option key={r} value={r}>Phòng {r}</option>)}
                </select>
              </div>

              <div className="cs-form-group">
                <label><Icons.Queue /> Ghi chú điều hành</label>
                <textarea 
                  name="note" 
                  placeholder="Ví dụ: Trực thay cho BS. A, yêu cầu hỗ trợ sinh viên thực tập..."
                  value={formData.note}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="cs-btn-submit">
                <Icons.Plus /> Xác nhận phân lịch
              </button>
            </form>
          </div>
        </div>

        {/* BÊN PHẢI: LỊCH SỬ TẠO GẦN ĐÂY */}
        <div className="cs-history-section">
          <h3 className="cs-history-title">Lịch vừa tạo</h3>
          <div className="cs-history-list">
            {history.length > 0 ? (
              history.map(item => (
                <div key={item.id} className="cs-history-item">
                  <div className="cs-item-icon">
                    {item.shift === 'Sáng' ? '☀️' : '🌙'}
                  </div>
                  <div className="cs-item-info">
                    <strong>{item.dr}</strong>
                    <span>{item.date} • Ca {item.shift} • {item.room}</span>
                  </div>
                  <button className="cs-btn-cancel" onClick={() => setHistory(history.filter(h => h.id !== item.id))}>
                    <Icons.Close />
                  </button>
                </div>
              ))
            ) : (
              <div className="cs-no-data">Chưa có lịch trực nào được tạo trong phiên này.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;