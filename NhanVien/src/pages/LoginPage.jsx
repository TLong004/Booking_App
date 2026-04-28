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

    try {
      // Gọi API thực tế xuống Backend (Spring Boot)
      const response = await axiosClient.post('/auth/login', { username, password });
      
      // Lấy dữ liệu từ response (Tùy cấu trúc BE trả về flat object hoặc có bọc trong 'user')
      const data = response.data;
      const token = data.token || data.accessToken || data.jwt; // BE trả về jwt
      
      const user = data.user || {
        id: data.id,
        username: data.username,
        roles: data.roles,
        fullName: data.fullName, // Lấy thêm fullName để hiển thị trên Header
      };

      // Chuẩn hóa roles nếu BE trả về dạng mảng object (VD: [{ authority: 'ROLE_ADMIN' }])
      if (user.roles && user.roles.length > 0 && typeof user.roles[0] === 'object') {
        user.roles = user.roles.map(r => r.authority || r.name || r.roleName);
      }

      login(user, token);
      
      // Lấy role đầu tiên để điều hướng
      const primaryRole = user.roles ? user.roles[0] : '';
      navigate(roleToPathMap[primaryRole] || '/unauthorized');
    } catch (err) {
      // Đảm bảo error luôn là string để tránh lỗi văng màn hình React
      let errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng!';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data; // BE trả về chuỗi trực tiếp
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message; // BE trả về object có chứa message
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error; // BE trả về object lỗi mặc định (vd: Internal Server Error)
        }
      }
      setError(errorMessage);
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
            <Alert title={error} type="error" showIcon style={{ marginBottom: 20 }} />
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