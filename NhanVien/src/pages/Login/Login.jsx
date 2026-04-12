import React from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const HospitalIllustration = () => (
  <svg width="100%" viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg" className="illustration-svg">
    <rect x="30" y="100" width="260" height="260" rx="6" fill="#185FA5"/>
    <rect x="50" y="80" width="220" height="40" rx="4" fill="#0C447C"/>
    <rect x="55" y="125" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="105" y="125" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="155" y="125" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="205" y="125" width="35" height="28" rx="3" fill="#E6F1FB"/>
    <rect x="55" y="170" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="105" y="170" width="35" height="28" rx="3" fill="#E6F1FB"/>
    <rect x="155" y="170" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="205" y="170" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="55" y="215" width="35" height="28" rx="3" fill="#E6F1FB"/>
    <rect x="105" y="215" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="155" y="215" width="35" height="28" rx="3" fill="#B5D4F4"/>
    <rect x="205" y="215" width="35" height="28" rx="3" fill="#E6F1FB"/>
    <rect x="140" y="52" width="40" height="12" rx="3" fill="white"/>
    <rect x="154" y="38" width="12" height="40" rx="3" fill="white"/>
    <rect x="0" y="340" width="320" height="40" fill="#B5D4F4"/>
    <rect x="130" y="270" width="60" height="90" rx="4" fill="#0C447C"/>
    <circle cx="183" cy="315" r="4" fill="#85B7EB"/>
    <rect x="118" y="240" width="44" height="60" rx="8" fill="white"/>
    <path d="M134 258 Q128 268 132 275 Q136 280 142 278" fill="none" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="142" cy="278" r="4" fill="#378ADD"/>
    <circle cx="140" cy="228" r="18" fill="#F5C4B3"/>
    <path d="M122 222 Q130 208 140 210 Q150 208 158 222 Q155 215 140 213 Q125 215 122 222Z" fill="#633806"/>
    <circle cx="134" cy="226" r="2" fill="#2C2C2A"/>
    <circle cx="146" cy="226" r="2" fill="#2C2C2A"/>
    <path d="M134 234 Q140 239 146 234" fill="none" stroke="#993C1D" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="132" y="248" width="16" height="16" rx="2" fill="#85B7EB"/>
    <rect x="157" y="248" width="20" height="26" rx="3" fill="#F1EFE8"/>
    <rect x="162" y="244" width="10" height="6" rx="2" fill="#B4B2A9"/>
    <line x1="160" y1="257" x2="174" y2="257" stroke="#888780" strokeWidth="1.2"/>
    <line x1="160" y1="262" x2="174" y2="262" stroke="#888780" strokeWidth="1.2"/>
    <line x1="160" y1="267" x2="170" y2="267" stroke="#888780" strokeWidth="1.2"/>
    <rect x="124" y="296" width="14" height="44" rx="4" fill="#185FA5"/>
    <rect x="142" y="296" width="14" height="44" rx="4" fill="#185FA5"/>
    <ellipse cx="131" cy="340" rx="10" ry="5" fill="#2C2C2A"/>
    <ellipse cx="149" cy="340" rx="10" ry="5" fill="#2C2C2A"/>
    <rect x="195" y="218" width="64" height="44" rx="8" fill="white" stroke="#378ADD" strokeWidth="1.5"/>
    <text x="227" y="234" textAnchor="middle" fontSize="9" fill="#185FA5" fontWeight="600" fontFamily="system-ui">Số thứ tự</text>
    <text x="227" y="252" textAnchor="middle" fontSize="18" fill="#185FA5" fontWeight="700" fontFamily="system-ui">A12</text>
    <circle cx="42" cy="75" r="3" fill="#EF9F27"/>
    <circle cx="272" cy="62" r="2.5" fill="#EF9F27"/>
    <circle cx="290" cy="90" r="2" fill="#5DCAA5"/>
  </svg>
);

// Danh sách tài khoản test
const TEST_ACCOUNTS = [
  { phone: '0111111111', password: '123456', name: 'Nguyễn Thị Lan', role: 'receptionist' },
  { phone: '0222222222', password: '123456', name: 'BS. Trần Văn Minh', role: 'doctor' },
  { phone: '0333333333', password: '123456', name: 'TK. Toản', role: 'truong_khoa' },
];

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const account = TEST_ACCOUNTS.find(
      (acc) => acc.phone === values.phone && acc.password === values.password
    );

    if (account) {
      localStorage.setItem('user', JSON.stringify({
        name: account.name,
        phone: account.phone,
        role: account.role,
      }));
      navigate('/');
    } else {
      alert('Sai số điện thoại hoặc mật khẩu!');
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1877f2', borderRadius: 8 } }}>
      <div className="login-page">
        <div className="login-wrapper">

          <div className="illustration-panel">
            <div className="illustration-inner">
              <HospitalIllustration />
              <p className="illustration-caption">Đặt lịch · Lấy số · Không chờ đợi</p>
            </div>
          </div>

          <div className="form-panel">
            <div className="login-header">
              <div className="logo-wrap">
                <img src="/assets/logo.png" alt="TheDuck logo" className="logo-img" />
              </div>
              <h1 className="brand-name">THEDUCK</h1>
              <p className="brand-sub">Vui lòng đăng nhập để tiếp tục</p>
            </div>

            <Form form={form} layout="vertical" size="large" onFinish={onFinish}>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input
                  prefix={<span className="flag-prefix">🇻🇳</span>}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div className="helper-links">
                <a href="#">Quên mật khẩu?</a>
              </div>

              <Button type="primary" htmlType="submit" block className="login-btn">
                ĐĂNG NHẬP
              </Button>
            </Form>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;