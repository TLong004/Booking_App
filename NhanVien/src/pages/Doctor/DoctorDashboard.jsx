import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PatientQueue from './components/PatientQueue';
import ConsultationPanel from './components/ConsultationPanel';
import Toast from './components/Toast';
import { consultationApi } from '../../api/consultationApi';
import './DoctorDashboard.css';

// --- MAIN COMPONENT ---
export default function DoctorDashboard() {
  const queryClient = useQueryClient();
  const [activePatient, setActivePatient] = useState(null);
  const [toast, setToast] = useState(null);

  // 1. GỌI API LẤY DANH SÁCH BỆNH NHÂN BẰNG useQuery
  const { data: queueResponse, isLoading } = useQuery({
    queryKey: ['patientQueue'],
    queryFn: consultationApi.getQueue,
  });
  const queue = queueResponse?.data || [];

  const counts = useMemo(() => ({
    all: queue.length,
    waiting: queue.filter(p => p.status === 'waiting').length,
    'in-progress': queue.filter(p => p.status === 'in-progress').length,
    completed: queue.filter(p => p.status === 'completed').length,
  }), [queue]);

  // 2. GỌI API LƯU CA KHÁM BẰNG useMutation
  const finishMutation = useMutation({
    mutationFn: ({ patientId, payload }) => consultationApi.finishConsultation(patientId, payload),
    onSuccess: () => {
      // Yêu cầu React Query gọi lại API lấy danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ['patientQueue'] });
      setToast({ message: `Hoàn tất khám thành công!`, type: 'success' });
      setActivePatient(null);
    },
    onError: () => {
      setToast({ message: 'Có lỗi xảy ra khi lưu thông tin!', type: 'error' });
    }
  });

  return (
    <div className="dd" style={{ padding: '0 24px', paddingTop: 16 }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* PAGE HEADER */}
      <div className="dd-header">
        <div>
          <h2 className="dd-title">Phòng khám · BS. Lê Trọng Bình</h2>
          <p className="dd-sub">Phòng 101 &nbsp;·&nbsp; Chuyên khoa Đa khoa &nbsp;·&nbsp; {new Date().toLocaleDateString('vi-VN', {weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
        <div className="dd-stats">
          <div className="hstat"><span className="hstat-n">{counts.waiting}</span><span className="hstat-l">Đang đợi</span></div>
          <div className="hstat"><span className="hstat-n hstat-blue">{counts['in-progress']}</span><span className="hstat-l">Đang khám</span></div>
          <div className="hstat"><span className="hstat-n hstat-green">{counts.completed}</span><span className="hstat-l">Đã xong</span></div>
        </div>
      </div>

      {/* BODY */}
      <div className="dd-body">
        {isLoading ? (
          <div className="queue-panel" style={{ alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <PatientQueue queue={queue} activePatient={activePatient} onSelectPatient={setActivePatient} counts={counts} />
        )}

        {/* RIGHT: CONSULTATION */}
        <main className="consult-panel">
          {!activePatient ? (
            <div className="empty-state">
              <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg></div>
              <p className="empty-title">Chưa chọn bệnh nhân</p>
              <p className="empty-sub">Chọn bệnh nhân từ danh sách bên trái để bắt đầu ca khám</p>
            </div>
          ) : (
            <ConsultationPanel 
              key={activePatient.id} 
              patient={activePatient} 
              onClose={() => setActivePatient(null)} 
              onFinish={(data) => finishMutation.mutate(data)} 
              onShowToast={setToast}
              isSubmitting={finishMutation.isPending}
            />
          )}
        </main>
      </div>
    </div>
  );
}
