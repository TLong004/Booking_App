import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b' }}>
      <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', lineHeight: 1 }}>404</h1>
      <p style={{ fontSize: '16px', marginBottom: '24px' }}>Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di dời.</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
        Trở về trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage;