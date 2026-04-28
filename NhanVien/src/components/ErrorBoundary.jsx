import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị UI lỗi
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Bạn có thể log lỗi này lên các dịch vụ như Sentry, LogRocket...
    console.error('Lỗi giao diện bị bắt bởi ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626', background: '#fef2f2', borderRadius: '8px', margin: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Đã xảy ra lỗi khi tải khu vực này!</h2>
          <p style={{ fontSize: '13px', color: '#991b1b', marginBottom: '16px' }}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;