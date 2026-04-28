import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import axiosClient from '../../api/axiosClient';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './DoctorManagementPage.css'; // Sử dụng chung style của trang admin

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axiosClient.get('/admin/specialties');
      setSpecialties(response.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyên khoa!');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSpecialties();
  }, []);

  const handleAddUser = async (values) => {
    try {
      await adminApi.createUser(values);
      message.success('Tạo người dùng thành công!');
      setIsModalVisible(false);
      form.resetFields();
      setSelectedRole(''); // Reset role đã chọn
      fetchUsers(); // Tải lại danh sách sau khi thêm mới
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng!';
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      key: 'roles',
      dataIndex: 'roles',
      render: (roles) => (
        <>
          {roles?.map(role => {
            let color = 'blue';
            if (role.roleName === 'ROLE_ADMIN') color = 'red';
            else if (role.roleName === 'ROLE_DOCTOR') color = 'green';
            else if (role.roleName === 'ROLE_HEAD_DEPT') color = 'geekblue';
            else if (role.roleName === 'ROLE_STAFF') color = 'orange';
            return (
              <Tag color={color} key={role.id}>
                {role.roleName.replace('ROLE_', '')}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Quản lý người dùng</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalVisible(true);
          }}
          className="add-new-btn"
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="table-container">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          className="data-table"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Thêm người dùng mới"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedRole('');
        }}
        footer={null}
        className="modal-box"
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser} className="admin-form">
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roleName" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
            <Select onChange={(value) => setSelectedRole(value)} placeholder="Chọn vai trò cho người dùng">
              <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
              <Select.Option value="ROLE_HEAD_DEPT">Trưởng khoa</Select.Option>
              <Select.Option value="ROLE_DOCTOR">Bác sĩ</Select.Option>
              <Select.Option value="ROLE_STAFF">Lễ tân</Select.Option>
            </Select>
          </Form.Item>

          {/* Các trường chỉ hiển thị khi vai trò là Bác sĩ */}
          {selectedRole === 'ROLE_DOCTOR' && (
            <>
              <Form.Item name="specialtyId" label="Chuyên khoa" rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa!' }]}>
                <Select placeholder="Chọn chuyên khoa cho bác sĩ">
                  {specialties.map(spec => (
                    <Select.Option key={spec.id} value={spec.id}>{spec.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="degree" label="Học vị" rules={[{ required: true, message: 'Vui lòng nhập học vị!' }]}>
                <Input placeholder="Ví dụ: Thạc sĩ, Bác sĩ Chuyên khoa I..." />
              </Form.Item>
            </>
          )}

          <div className="form-actions">
            <Button className="btn-cancel" onClick={() => {
              setIsModalVisible(false);
              form.resetFields();
              setSelectedRole('');
            }}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="btn-submit">Lưu</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;