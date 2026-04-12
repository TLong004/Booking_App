// src/components/ExamForm.jsx

import { useState } from 'react';
import Icons from './Icons';

const initials = (name) =>
  name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

const ExamForm = ({ ticket, onBack, onSave }) => {
  const [expandHistory, setExpandHistory] = useState(false);
  const [expandLab, setExpandLab] = useState(true);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [reExam, setReExam] = useState(false);
  const [reExamDate, setReExamDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!symptoms.trim() || !diagnosis.trim()) {
      alert('Vui lòng nhập triệu chứng và chuẩn đoán.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    onSave && onSave({ ticket, symptoms, diagnosis, reExam, reExamDate });
  };

  const { patient, history } = ticket;

  return (
    <div className="mep-detail-area">
      {/* Back */}
      <button className="mep-back-btn" onClick={onBack}>
        <Icons.ArrowLeft />
        Quay lại
      </button>

      <div className="mep-ticket-id">{ticket.id}</div>
      <div className="mep-ticket-time">
        <Icons.Clock />
        Xác nhận lúc {ticket.confirmedAt}
      </div>

      <div className="mep-two-col">
        {/* Patient card */}
        <div className="mep-patient-card">
          <div className="mep-patient-avatar">{initials(patient.name)}</div>
          <div className="mep-patient-name">{patient.name}</div>
          <div className="mep-patient-gender">Giới tính: {patient.gender}</div>

          <div className="mep-patient-meta">
            <div className="mep-meta-row">
              <Icons.Clock />
              <span>Ngày sinh:</span>
              <strong>{patient.dob}</strong>
            </div>
            <div className="mep-meta-row">
              <Icons.Pin />
              <span>Địa chỉ:</span>
              <strong>{patient.address}</strong>
            </div>
            <div className="mep-meta-row">
              <Icons.Phone />
              <span>SĐT:</span>
              <strong>{patient.phone}</strong>
            </div>
          </div>

          {/* Lịch sử khám */}
          <button
            className="mep-history-toggle"
            onClick={() => setExpandHistory(!expandHistory)}
          >
            <Icons.Clock />
            Lịch sử khám bệnh
            <Icons.ChevronDown open={expandHistory} />
          </button>

          {expandHistory && (
            <div className="mep-history-list">
              {history.length === 0 ? (
                <div className="mep-history-empty">Chưa có lịch sử khám</div>
              ) : (
                history.map((h, i) => (
                  <button key={i} className="mep-history-item">
                    <span>Ngày khám: <strong>{h.date}</strong></span>
                    <span>Chuyên khoa: {h.specialty}</span>
                    <Icons.ChevronRight />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Form hồ sơ */}
        <div className="mep-form-card">
          <div className="mep-form-title">Tạo hồ sơ khám bệnh</div>

          <textarea
            className="mep-textarea"
            placeholder="Triệu chứng *"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
          />

          <textarea
            className="mep-textarea"
            placeholder="Chuẩn đoán *"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={3}
          />

          {/* Tái khám */}
          <div className="mep-reexam-row">
            <label className="mep-checkbox-label">
              <input
                type="checkbox"
                checked={reExam}
                onChange={(e) => setReExam(e.target.checked)}
              />
              <span>Tái khám</span>
            </label>
            {reExam && (
              <input
                type="date"
                className="mep-date-input"
                value={reExamDate}
                onChange={(e) => setReExamDate(e.target.value)}
              />
            )}
          </div>

          {/* Xét nghiệm */}
          <div className="mep-lab-section">
            <button
              className="mep-lab-toggle"
              onClick={() => setExpandLab(!expandLab)}
            >
              <Icons.ChevronDown open={expandLab} />
              Thực hiện xét nghiệm
            </button>

            {expandLab && (
              <div className="mep-lab-body">
                <table className="mep-lab-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên dịch vụ</th>
                      <th>Chỉ định thực hiện</th>
                      <th>Tuỳ chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="mep-lab-empty-row">
                        Chưa có xét nghiệm nào
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="mep-add-lab-btn">+ Thêm xét nghiệm</button>
              </div>
            )}
          </div>

          {/* Lưu */}
          <button
            className={`mep-save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving || saved}
          >
            {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu hồ sơ' : 'Lưu hồ sơ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;