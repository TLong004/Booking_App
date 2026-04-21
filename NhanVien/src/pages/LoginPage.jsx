import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../api/axiosClient';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // --- BẮT ĐẦU: CODE GIẢ LẬP TEST GIAO DIỆN (Xóa phần này khi đã có API Backend) ---
    if (password === '123') {
      let mockUser = null;
      if (username === 'admin') mockUser = { id: 1, username: 'Admin', roles: ['ROLE_ADMIN'] };
      else if (username === 'doctor') mockUser = { id: 2, username: 'Bác sĩ', roles: ['ROLE_DOCTOR'] };
      else if (username === 'head') mockUser = { id: 3, username: 'Trưởng Khoa', roles: ['ROLE_HEAD_DEPT'] };
      else if (username === 'staff') mockUser = { id: 4, username: 'Lễ Tân', roles: ['ROLE_STAFF'] };

      if (mockUser) {
        login(mockUser, 'mock-token-' + username);
        const firstRole = mockUser.roles[0];
        if (firstRole === 'ROLE_ADMIN') navigate('/admin');
        else if (firstRole === 'ROLE_HEAD_DEPT') navigate('/head-dept');
        else if (firstRole === 'ROLE_DOCTOR') navigate('/doctor');
        else if (firstRole === 'ROLE_STAFF') navigate('/staff');
        return;
      } else {
        setError('Tài khoản test không đúng (chỉ dùng: admin, doctor, head, staff)');
        return;
      }
    }
    // --- KẾT THÚC: CODE GIẢ LẬP ---

    try {
      // TODO: Thay thế '/auth/login' bằng endpoint đăng nhập thật của bạn
      const response = await axiosClient.post('/auth/login', { username, password });
      
      // Giả sử API trả về: { token: '...', user: { id, username, roles: ['ROLE_...'] } }
      const { token, user } = response.data;

      // 1. Lưu token và thông tin user vào store
      login(user, token);

      // 2. Điều hướng tới trang phù hợp với quyền cao nhất của user
      const firstRole = user.roles[0];
      if (firstRole === 'ROLE_ADMIN') navigate('/admin');
      else if (firstRole === 'ROLE_HEAD_DEPT') navigate('/head-dept');
      else if (firstRole === 'ROLE_DOCTOR') navigate('/doctor');
      else if (firstRole === 'ROLE_STAFF') navigate('/staff');
      else navigate('/login'); // Nếu không có quyền phù hợp, ở lại trang login

    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2>Phòng Khám Đa Khoa</h2>
          <p>Đăng nhập để tiếp tục</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nhập tên đăng nhập" />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu" />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;