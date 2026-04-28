import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../api/axiosClient';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import './LoginPage.css';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const roleToPathMap = {
    'ROLE_ADMIN': '/admin',
    'ROLE_HEAD_DEPT': '/head-dept',
    'ROLE_DOCTOR': '/doctor',
    'ROLE_STAFF': '/staff',
  };

  const handleLogin = async (values) => {
    const { username, password } = values;
    setError('');
    setLoading(true);

    // --- GIẢ LẬP TEST (Xóa khi có API) ---
    if (password === '123') {
      let mockUser = null;
      if (username === 'admin')  mockUser = { id: 1, username: 'Admin', roles: ['ROLE_ADMIN'] };
      else if (username === 'doctor') mockUser = { id: 2, username: 'Bác sĩ', roles: ['ROLE_DOCTOR'] };
      else if (username === 'head')   mockUser = { id: 3, username: 'Trưởng Khoa', roles: ['ROLE_HEAD_DEPT'] };
      else if (username === 'staff')  mockUser = { id: 4, username: 'Lễ Tân', roles: ['ROLE_STAFF'] };

      if (mockUser) {
        login(mockUser, 'mock-token-' + username);
        navigate(roleToPathMap[mockUser.roles[0]] || '/login');
        return;
      } else {
        setError('Tài khoản test không hợp lệ (dùng: admin, doctor, head, staff)');
        setLoading(false);
        return;
      }
    }
    // --- KẾT THÚC GIẢ LẬP ---

    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      const { token, user } = response.data;
      login(user, token);
      navigate(roleToPathMap[user.roles[0]] || '/login');
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
      console.error('Login failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* ── Left Panel ── */}
      <div className="login-left">
        <div className="login-logo">
          <div className="login-logo-icon">
            <MedicineBoxOutlined />
          </div>
          <div>
            <p className="login-logo-name">Phòng Khám Đa Khoa</p>
            <p className="login-logo-sub">Hệ thống quản lý y tế</p>
          </div>
        </div>

        <div className="login-headline">
          <h2>
            Chào mừng
            <span>quay trở lại.</span>
          </h2>
          <p>
            Nền tảng hỗ trợ đội ngũ y bác sĩ quản lý
            bệnh nhân và lịch khám một cách chuyên nghiệp.
          </p>
        </div>

        <div className="login-status">
          <div className="login-status-dot" />
          <span>Hệ thống đang hoạt động</span>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="login-right">
        <p className="login-form-title">Đăng nhập</p>
        <p className="login-form-sub">Vui lòng nhập thông tin tài khoản</p>

        <Form name="login" onFinish={handleLogin} autoComplete="off" size="large" layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
          )}

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <p className="login-hint">Liên hệ quản trị viên nếu quên mật khẩu</p>
      </div>

    </div>
  );
};

export default LoginPage;