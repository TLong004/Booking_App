import { useState } from 'react';
import './QueueDisplay.css';

const QueueDisplay = ({ room, queue = [] }) => {
  const waiting = queue.filter((p) => p.trangThai === 'Đang chờ');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentNumber = String(currentIndex).padStart(2, '0');
  const remaining = Math.max(0, waiting.length - currentIndex);

  const handleNext = () => {
    if (currentIndex < waiting.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };


  return (
    <div className="qd-root">
      {/* Topbar */}
      <div className="qd-topbar">
        <div className="qd-topbar-left">
          <span className="qd-current-label">
            Số thứ tự hiện tại:
            <span className="qd-current-num"> {currentNumber}</span>
          </span>
          <span className="qd-remaining">({remaining} người còn lại)</span>
          <button className="qd-btn-next" onClick={handleNext} disabled={currentIndex >= waiting.length}>
            TIẾP THEO
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="qd-board">
        {/* Trái: số hiện tại */}
        <div className="qd-board-left">
          <div className="qd-board-title">Số thứ tự hiện tại</div>
          <div className="qd-board-number">{currentNumber}</div>
        </div>

        {/* Phải: danh sách chờ tiếp theo */}
        <div className="qd-board-right">
          <div className="qd-board-title">Số thứ tự tiếp theo</div>
          <div className="qd-next-list">
            {waiting.slice(currentIndex, currentIndex + 5).map((p, i) => (
              <div key={p.ma} className={`qd-next-item ${i === 0 ? 'qd-next-item--first' : ''}`}>
                <span className="qd-next-stt">{String(currentIndex + i + 1).padStart(2, '0')}</span>
                <span className="qd-next-name">{p.hoTen}</span>
              </div>
            ))}
            {waiting.slice(currentIndex).length === 0 && (
              <div className="qd-empty">Không còn bệnh nhân chờ</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="qd-footer">
        <div className="qd-footer-hospital">THE DUCK HOSPITAL</div>
        <div className="qd-footer-khoa">{room?.khoa ?? 'Chuyên khoa'}</div>
        <div className="qd-footer-room">Phòng khám {room?.room ?? '---'}</div>
      </div>
    </div>
  );
};

export default QueueDisplay;