import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import SearchableSelect from './SearchableSelect';
import PrescriptionRow from './PrescriptionRow';
import { TABS } from '../doctorDashboardData';
import { consultationApi } from '../../api/consultationApi';

export default function ConsultationPanel({ patient, onClose, onFinish, onShowToast, isSubmitting }) {
  const [activeTab, setActiveTab] = useState('exam');

  // Toàn bộ State nhập liệu chỉ gói gọn ở component này
  const [vitals, setVitals] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [services, setServices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Gọi API lấy danh mục thuốc & dịch vụ
  const { data: servicesRes } = useQuery({
    queryKey: ['services'],
    queryFn: consultationApi.getServices,
  });
  const { data: medicinesRes } = useQuery({
    queryKey: ['medicines'],
    queryFn: consultationApi.getMedicines,
  });
  
  const serviceOptions = servicesRes?.data || [];
  const medicineOptions = medicinesRes?.data || [];

  const addPrescription = () => setPrescriptions(p => [...p, { medicine_id: '', quantity: '', dosage: '', usage: '' }]);
  const updatePrescription = (i, field, val) => setPrescriptions(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const removePrescription = (i) => setPrescriptions(p => p.filter((_, idx) => idx !== i));

  const handleFinish = () => {
    if (!symptoms.trim() || !diagnosis.trim()) {
      onShowToast({ message: 'Vui lòng điền triệu chứng và chẩn đoán', type: 'error' });
      setActiveTab('exam');
      return;
    }
    onFinish({
      patientId: patient.id,
      payload: { vitals, symptoms, diagnosis, advice, followUpDate, services, prescriptions }
    });
  };

  return (
    <div className="consult-content">
      {/* PATIENT HEADER */}
      <div className="pt-header">
        <Avatar name={patient.name} size={48} />
        <div className="pt-info">
          <div className="pt-name">{patient.name}</div>
          <div className="pt-meta">
            <span>#{patient.id}</span><span>·</span>
            <span>{patient.age} tuổi</span><span>·</span>
            <span>{patient.gender}</span><span>·</span>
            <span>{patient.phone}</span>
          </div>
        </div>
        <div className="pt-actions">
          <StatusBadge status={patient.status} />
          <button className="btn btn-ghost">Lịch sử khám</button>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content">
        {activeTab === 'info' && (
          <div className="fade-in">
            <div className="info-grid">
              <div className="info-item"><label>Mã bệnh nhân</label><span>{patient.id}</span></div>
              <div className="info-item"><label>Họ và tên</label><span>{patient.name}</span></div>
              <div className="info-item"><label>Tuổi</label><span>{patient.age}</span></div>
              <div className="info-item"><label>Giới tính</label><span>{patient.gender}</span></div>
              <div className="info-item"><label>Số điện thoại</label><span>{patient.phone}</span></div>
              <div className="info-item"><label>Giờ đăng ký</label><span>{patient.time}</span></div>
            </div>
            <div className="form-row">
              <label className="form-label">Lý do đến khám</label>
              <textarea className="field textarea" rows={3} value={patient.reason} readOnly />
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="fade-in">
            <div className="form-row">
              <label className="form-label">Dấu hiệu sinh tồn</label>
              <input className="field" placeholder="Mạch, Nhiệt độ, Huyết áp, SpO2..." value={vitals} onChange={e => setVitals(e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label required">Mô tả triệu chứng & Bệnh sử</label>
              <textarea className="field textarea" rows={4} placeholder="Mô tả chi tiết triệu chứng, thời gian khởi phát..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label required">Chẩn đoán</label>
              <input className="field" placeholder="VD: Viêm họng cấp, Trào ngược dạ dày..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">Lời dặn của Bác sĩ</label>
              <textarea className="field textarea" rows={2} placeholder="Kiêng ăn, vận động, tái khám..." value={advice} onChange={e => setAdvice(e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">Ngày hẹn tái khám (Tùy chọn)</label>
              <input type="date" className="field" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} style={{ maxWidth: '200px' }} />
            </div>
          </div>
        )}

        {activeTab === 'rx' && (
          <div className="fade-in">
            <div className="form-row">
              <label className="form-label">Chỉ định Cận lâm sàng / Dịch vụ</label>
              <SearchableSelect options={serviceOptions} value={services} onChange={setServices} placeholder="Tìm dịch vụ..." multiple />
            </div>

            <div className="rx-section">
              <div className="rx-header">
                <div><span className="rx-title">Đơn thuốc điện tử</span><span className="rx-count">{prescriptions.length} thuốc</span></div>
                <button className="btn btn-outline" onClick={addPrescription}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Thêm thuốc
                </button>
              </div>
              {prescriptions.length === 0 ? (
                <div className="rx-empty" onClick={addPrescription}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <span>Nhấn để thêm thuốc vào đơn</span>
                </div>
              ) : (
                <div className="rx-list">
                  <div className="rx-col-labels"><span style={{paddingLeft:28}}>Thuốc</span><span style={{width:64}}>SL</span><span style={{flex:1.2}}>Liều dùng</span><span style={{flex:1}}>Cách dùng</span><span style={{width:28}}></span></div>
                  {prescriptions.map((item, i) => <PrescriptionRow key={i} item={item} index={i} onChange={updatePrescription} onRemove={removePrescription} medicines={medicineOptions} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="consult-footer">
        <div className="footer-hint">
          {!symptoms.trim() && <span className="hint-warn">⚠ Chưa điền triệu chứng</span>}
          {!diagnosis.trim() && <span className="hint-warn">⚠ Chưa điền chẩn đoán</span>}
          {symptoms.trim() && diagnosis.trim() && <span className="hint-ok">✓ Sẵn sàng hoàn tất</span>}
        </div>
        <div className="footer-btns">
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
          <button className="btn btn-secondary" onClick={() => setActiveTab(activeTab === 'rx' ? 'exam' : 'rx')}>{activeTab === 'rx' ? '← Quay lại' : 'Đơn thuốc →'}</button>
          <button className="btn btn-primary" onClick={handleFinish} disabled={isSubmitting}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất & In đơn'}
          </button>
        </div>
      </div>
    </div>
  );
}