import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './DoctorManagementPage.css';

const SpecialtyManagementPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllSpecialties();
      setSpecialties(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyên khoa!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleAddSpecialty = async (values) => {
    try {
      await adminApi.createSpecialty(values);
      message.success('Thêm chuyên khoa thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchSpecialties();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm chuyên khoa!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Tên chuyên khoa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Quản lý chuyên khoa</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          className="add-new-btn"
        >
          Thêm chuyên khoa
        </Button>
      </div>

      <div className="table-container">
        <Table 
          dataSource={specialties} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          className="data-table"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Thêm chuyên khoa mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="modal-box"
      >
        <Form form={form} layout="vertical" onFinish={handleAddSpecialty} className="admin-form">
          <Form.Item name="name" label="Tên chuyên khoa" rules={[{ required: true, message: 'Vui lòng nhập tên chuyên khoa!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className="form-actions">
            <Button className="btn-cancel" onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="btn-submit">Lưu</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecialtyManagementPage;