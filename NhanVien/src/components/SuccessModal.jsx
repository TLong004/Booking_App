import { useState } from 'react';
import Icons from './Icons';

const SuccessModal = ({ data, onClose }) => {
  const [queueNum] = useState(() => Math.floor(Math.random() * 90 + 10));

  return (
    <div className="sdp-modal-overlay" onClick={onClose}>
      <div className="sdp-modal sdp-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sdp-success-icon">
          <Icons.Check />
        </div>
        <h3 className="sdp-success-title">Tiếp nhận thành công!</h3>
        <div className="sdp-success-body">
          <div className="sdp-success-row">
            <span>Bệnh nhân</span>
            <strong>{data.patient.name}</strong>
          </div>
          <div className="sdp-success-row">
            <span>Chuyên khoa</span>
            <strong>{data.chuyenKhoa}</strong>
          </div>
          <div className="sdp-success-row">
            <span>Bác sĩ</span>
            <strong>{data.bacSi.name}</strong>
          </div>
          <div className="sdp-success-row">
            <span>Phòng khám</span>
            <strong>{data.bacSi.room}</strong>
          </div>
          <div className="sdp-success-row">
            <span>Buổi khám</span>
            <strong>{data.bacSi.session}</strong>
          </div>
          <div className="sdp-success-row">
            <span>Số thứ tự</span>
            <strong className="sdp-success-number">#{String(queueNum).padStart(2, '0')}</strong>
          </div>
        </div>
        <button className="sdp-btn-success-close" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;