import React, { useState, useEffect } from 'react';
import './ScheduleList.css';
import Icons from '../../components/Icons';

const ScheduleList = () => {
  // --- STATE QUẢN LÝ ---
  const [selectedDate, setSelectedDate] = useState('2024-01-18');
  const [selectedRoom, setSelectedRoom] = useState('A104');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null); // { type: 'morning' | 'afternoon', data: ... }

  // Giả lập Database ca trực
  const [db, setDb] = useState({
    '2024-01-18-A104': {
      morning: { name: 'PGS. Đức Xuân Minh', gender: 'Nam', phone: '0333692418', cccd: '497092937325', dob: '19/05/1988', booked: 5, available: 25 },
      afternoon: { name: 'PGS. Đức Xuân Minh', gender: 'Nam', phone: '0333692418', cccd: '497092937325', dob: '19/05/1988', booked: 2, available: 28 }
    },
    '2024-01-18-A105': {
      morning: { name: 'BS. Nguyễn Thị Thu', gender: 'Nữ', phone: '0987654321', cccd: '123456789012', dob: '10/02/1990', booked: 10, available: 20 },
      afternoon: null
    }
  });

  const rooms = ['A104', 'A105', 'A106', 'A107'];
  const currentKey = `${selectedDate}-${selectedRoom}`;
  const currentShifts = db[currentKey] || { morning: null, afternoon: null };

  // --- XỬ LÝ SỰ KIỆN ---
  const handleDelete = (type) => {
    if (window.confirm(`Xóa ca trực ${type === 'morning' ? 'Sáng' : 'Chiều'} phòng ${selectedRoom}?`)) {
      setDb({
        ...db,
        [currentKey]: { ...currentShifts, [type]: null }
      });
    }
  };

  const openEditModal = (type, data) => {
    setEditingShift({ type, data: data || { name: '', phone: '', available: 30, booked: 0 } });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      ...editingShift.data,
      name: formData.get('name'),
      phone: formData.get('phone'),
      available: parseInt(formData.get('available')),
    };

    setDb({
      ...db,
      [currentKey]: { ...currentShifts, [editingShift.type]: updatedData }
    });
    setIsEditModalOpen(false);
  };

  // --- SUB-COMPONENTS ---
  const ShiftCard = ({ title, type, data }) => (
    <div className={`sl-shift-card ${!data ? 'is-empty' : ''}`}>
      <div className="sl-card-header">
        <h3 className="sl-card-title">{title}</h3>
        {data && <span className="sl-status-tag">Đang hoạt động</span>}
      </div>
      
      {data ? (
        <div className="sl-card-body">
          <div className="sl-info-item"><Icons.User /> <label>Bác sĩ</label> <span>{data.name}</span></div>
          <div className="sl-info-item"><Icons.Phone /> <label>SĐT</label> <span>{data.phone}</span></div>
          <div className="sl-info-item"><Icons.Clock /> <label>Còn trống</label> <strong>{data.available}</strong></div>
          <div className="sl-card-actions">
            <button className="sl-btn-delete" onClick={() => handleDelete(type)}>Xóa</button>
            <button className="sl-btn-update" onClick={() => openEditModal(type, data)}>Cập nhật</button>
          </div>
        </div>
      ) : (
        <div className="sl-empty-content">
          <Icons.Calendar />
          <p>Trống lịch trực</p>
          <button className="sl-btn-add" onClick={() => openEditModal(type, null)}>+ Thêm bác sĩ</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="mep-content sl-fade-in">
      <div className="sl-top-bar">
        <h2 className="sl-main-title">Quản lý ca trực khoa</h2>
        <div className="sl-filter-group">
          <div className="sl-input-wrapper">
            <span className="sl-label">Ngày làm việc</span>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="sl-layout">
        <div className="sl-left">
          <ShiftCard title="Ca Sáng (07:30 - 11:30)" type="morning" data={currentShifts.morning} />
          <ShiftCard title="Ca Chiều (13:30 - 17:30)" type="afternoon" data={currentShifts.afternoon} />
        </div>

        <div className="sl-right">
          <div className="sl-sidebar">
            <div className="sl-sidebar-header">Danh sách phòng</div>
            <div className="sl-room-grid">
              {rooms.map(r => (
                <div 
                  key={r} 
                  className={`sl-room-card ${selectedRoom === r ? 'active' : ''}`}
                  onClick={() => setSelectedRoom(r)}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL CHỈNH SỬA --- */}
      {isEditModalOpen && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <h3>{editingShift.data?.name ? 'Cập nhật ca trực' : 'Thêm ca trực mới'}</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Họ tên bác sĩ</label>
                <input name="name" defaultValue={editingShift.data?.name} required />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input name="phone" defaultValue={editingShift.data?.phone} required />
              </div>
              <div className="form-group">
                <label>Số lượng chỗ nhận khám</label>
                <input name="available" type="number" defaultValue={editingShift.data?.available} />
              </div>
              <div className="sl-modal-btns">
                <button type="button" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;