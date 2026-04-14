import React, { useState } from 'react';
import './ScheduleTab.css';

const ScheduleTab = () => {
  // 1. Khởi tạo ngày hiện tại và ngày được chọn
  const today = 18; // Ngày hiện tại (có vòng tròn bao quanh)
  const [selectedDay, setSelectedDay] = useState(12); // Ngày đang xem (màu xanh đậm)

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 1; // Tháng bắt đầu từ Thứ 2

  // Giả lập dữ liệu ca trực: Ngày chẵn ca sáng, ngày lẻ ca chiều
  const getShiftInfo = (day) => {
    return day % 2 === 0 
      ? { name: "Buổi sáng", icon: "☀️", color: "#f59e0b" }
      : { name: "Buổi chiều", icon: "🌙", color: "#6366f1" };
  };

  const currentShift = getShiftInfo(selectedDay);

  return (
    <div className="mep-content">
      <div className="mep-title-row">
        <h2 className="mep-page-title">Lịch khám chữa bệnh</h2>
      </div>

      <div className="schedule-container">
        {/* BÊN TRÁI: LỊCH */}
        <div className="calendar-card">
          <div className="calendar-header">
            <span className="calendar-month-year">January 2024</span>
            <div className="calendar-nav">
              <button className="nav-btn">❮</button>
              <button className="nav-btn">❯</button>
            </div>
          </div>

          <div className="calendar-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="grid-weekday">{d}</div>
            ))}
            
            {/* Ô trống đầu tháng */}
            {Array(startDayOffset).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="grid-day empty"></div>
            ))}

            {/* Danh sách ngày */}
            {daysInMonth.map(day => (
              <div 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`grid-day 
                  ${day === selectedDay ? 'active' : ''} 
                  ${day === today ? 'is-today' : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* BÊN PHẢI: CHI TIẾT (Màu xanh dương) */}
        <div className="schedule-detail-card">
          <div className="detail-big-number">{selectedDay < 10 ? `0${selectedDay}` : selectedDay}</div>
          <div className="detail-month-label">THÁNG 01</div>
          
          <div className="detail-info-box">
            <div className="detail-shift">
              <span className="shift-icon">{currentShift.icon}</span>
              {currentShift.name}
            </div>
            <div className="detail-room">Phòng A104</div>
            <div className="detail-dept">Khám răng - hàm - mặt</div>
          </div>

          <div className="detail-footer-note">
            Vui lòng liên hệ trưởng khoa để thay đổi lịch khám
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;