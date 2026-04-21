import React, { useState } from 'react';
import { Tabs, Calendar, Badge, Modal, Form, Select, Button, Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { TeamOutlined, DollarOutlined, SolutionOutlined } from '@ant-design/icons';
import DoctorDashboard from '../doctor/DoctorDashboard'; // Trưởng khoa cũng cần khám bệnh
import './HeadDeptDashboard.css';

const { Title } = Typography;

// --- MOCK DATA ---
const mockDoctorsInDept = [
  { value: 'D1', label: 'BS. Lê Trọng B' },
  { value: 'D2', label: 'BS. Nguyễn Thị Y' },
  { value: 'D3', label: 'BS. Trần Văn Z' },
];

// Dữ liệu lịch trực giả lập
const getListData = (value) => {
  let listData = [];
  const date = value.date();
  if (date === 8 || date === 15) {
    listData = [{ type: 'success', content: 'Sáng: BS. Lê Trọng B (P.101)' }, { type: 'warning', content: 'Chiều: BS. Trần Văn Z (P.102)' }];
  } else if (date === 10) {
    listData = [{ type: 'success', content: 'Cả ngày: BS. Nguyễn Thị Y' }];
  }
  return listData;
};

const HeadDeptDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  // --- XỬ LÝ LỊCH TRỰC ---
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} className="text-xs" />
          </li>
        ))}
      </ul>
    );
  };

  const handleSelectDate = (value) => {
    setSelectedDate(value);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleAssignShift = (values) => {
    console.log('Gán ca trực:', { date: selectedDate.format('YYYY-MM-DD'), ...values });
    setIsModalVisible(false);
    // Gọi API lưu lịch trực...
  };

  // --- RENDER TAB: LỊCH TRỰC ---
  const renderShiftSchedule = () => (
    <div className="fade-in">
      <Card title="Phân công Lịch trực Khoa Đa Khoa">
        <Calendar dateCellRender={dateCellRender} onSelect={handleSelectDate} />
      </Card>

      <Modal title={`Phân ca trực - Ngày ${selectedDate?.format('DD/MM/YYYY')}`} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAssignShift}>
          <Form.Item name="doctor_id" label="Chọn Bác sĩ" rules={[{ required: true }]}>
            <Select options={mockDoctorsInDept} placeholder="-- Chọn bác sĩ --" />
          </Form.Item>
          <Form.Item name="shift" label="Ca làm việc" rules={[{ required: true }]}>
            <Select options={[{ value: 'morning', label: 'Ca Sáng (07:30 - 11:30)' }, { value: 'afternoon', label: 'Ca Chiều (13:30 - 17:30)' }, { value: 'full', label: 'Cả ngày' }]} />
          </Form.Item>
          <Form.Item name="room" label="Phòng khám" rules={[{ required: true }]}>
            <Select options={[{ value: '101', label: 'Phòng 101' }, { value: '102', label: 'Phòng 102' }]} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu Phân công</Button>
        </Form>
      </Modal>
    </div>
  );

  // --- RENDER TAB: THỐNG KÊ ---
  const renderAnalytics = () => {
    const cols = [
      { title: 'Bác sĩ', dataIndex: 'doctor', key: 'doctor' },
      { title: 'Ca đã khám', dataIndex: 'completed', key: 'completed' },
      { title: 'Đang đợi', dataIndex: 'waiting', key: 'waiting' },
    ];
    const data = [
      { key: '1', doctor: 'BS. Lê Trọng B', completed: 15, waiting: 2 },
      { key: '2', doctor: 'BS. Nguyễn Thị Y', completed: 8, waiting: 5 },
    ];

    return (
      <div className="fade-in">
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card><Statistic title="Tổng bệnh nhân (Hôm nay)" value={112} prefix={<TeamOutlined />} valueStyle={{ color: '#3f8600' }} /></Card>
          </Col>
          <Col span={8}>
            <Card><Statistic title="Doanh thu Khoa (VNĐ)" value={25600000} prefix={<DollarOutlined />} valueStyle={{ color: '#cf1322' }} /></Card>
          </Col>
          <Col span={8}>
            <Card><Statistic title="Bác sĩ đang trực" value={3} suffix="/ 5" prefix={<SolutionOutlined />} valueStyle={{ color: '#1d4ed8' }} /></Card>
          </Col>
        </Row>
        <Card title="Hiệu suất khám bệnh hôm nay">
          <Table columns={cols} dataSource={data} pagination={false} />
        </Card>
      </div>
    );
  };

  // CHÍNH: QUẢN LÝ TAB BẰNG ANTD
  const items = [
    {
      key: '1',
      label: '🩺 Bàn Khám Bệnh',
      children: <DoctorDashboard />, // Nhúng nguyên trang bác sĩ vào đây
    },
    {
      key: '2',
      label: '📅 Quản lý Lịch trực',
      children: renderShiftSchedule(),
    },
    {
      key: '3',
      label: '📊 Thống kê Khoa',
      children: renderAnalytics(),
    },
  ];

  return (
    <div className="head-dept-dashboard">
      <div className="dashboard-header mb-4 flex justify-between items-end">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Quản lý Khoa Đa Khoa</Title>
          <span className="text-gray-500">Quyền truy cập: Trưởng Khoa</span>
        </div>
      </div>
      {/* Thanh Tabs lớn ở trên cùng */}
      <Tabs defaultActiveKey="1" items={items} size="large" className="custom-large-tabs" />
    </div>
  );
};

export default HeadDeptDashboard;