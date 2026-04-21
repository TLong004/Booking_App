import React, { useState } from "react";
import { Typography, Card, Row, Col, Input, Button, Table, Tag, Tabs, Form, Select, Space, message, Popconfirm, Statistic, List, Avatar, Badge } from "antd";
import { SearchOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined, PrinterOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined, SwapOutlined, SyncOutlined, FileTextOutlined, CalendarOutlined, SolutionOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import './StaffDashboard.css';

const { Title, Text } = Typography;

const StaffDashboard = () => {
  const [form] = Form.useForm();

  // STATE MOCK DATA để cho phép tương tác
  const [queueData, setQueueData] = useState([
    { id: "Q001", name: "Nguyễn Văn A", phone: "0901234567", doctor: "BS. Lê Trọng B", room: "P.101", status: "waiting", time: "08:30" },
    { id: "Q002", name: "Trần Thị C", phone: "0987654321", doctor: "BS. Phạm D", room: "P.102", status: "in-progress", time: "08:45" },
    { id: "Q003", name: "Lê Hoàng E", phone: "0912233445", doctor: "BS. Lê Trọng B", room: "P.101", status: "done", time: "09:00" },
  ]);

  const [billingData, setBillingData] = useState([
    { id: "INV-1001", patient: "Lê Hoàng E", total: "550,000đ", type: "Phí khám + Siêu âm", status: "pending", time: "09:15" },
    { id: "INV-1002", patient: "Đỗ Văn F", total: "1,200,000đ", type: "Phí khám + Tiền thuốc", status: "paid", time: "08:20" },
  ]);

  const [appointmentsData, setAppointmentsData] = useState([
    { id: "APT-01", patient: "Vũ Thị G", phone: "0933445566", doctor: "BS. Lê Trọng B", time: "10:00 - Hôm nay", status: "confirmed" },
    { id: "APT-02", patient: "Hoàng Minh H", phone: "0988776655", doctor: "BS. Phạm D", time: "14:30 - Hôm nay", status: "pending" },
  ]);

  // --- CÁC HÀNH ĐỘNG ---
  const handleRegister = (values) => {
    const newId = `Q${String(queueData.length + 1).padStart(3, "0")}`;
    const newPatient = {
      id: newId,
      name: values.name,
      phone: values.phone,
      doctor: values.doctor || "Bác sĩ được chỉ định",
      room: "P.100",
      status: "waiting",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setQueueData([...queueData, newPatient]);
    message.success(`Đã cấp số thứ tự ${newId} cho bệnh nhân ${values.name}`);
    form.resetFields();
  };

  const handlePay = (id) => {
    setBillingData(billingData.map((b) => (b.id === id ? { ...b, status: "paid" } : b)));
    message.success(`Thanh toán thành công hóa đơn ${id}`);
  };

  const handleConfirmAppointment = (id) => {
    setAppointmentsData(appointmentsData.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a)));
    message.success(`Đã xác nhận lịch hẹn ${id}`);
  };

  const handleCancelAppointment = (id) => {
    setAppointmentsData(appointmentsData.filter((a) => a.id !== id));
    message.info(`Đã hủy lịch hẹn ${id}`);
  };

  // --- CẤU HÌNH CỘT CHO CÁC BẢNG ---
  const queueColumns = [
    { title: "STT", dataIndex: "id", key: "id", render: (text) => <strong>{text}</strong> },
    { title: "Thời gian", dataIndex: "time", key: "time", render: (text) => <Tag icon={<ClockCircleOutlined />}>{text}</Tag> },
    { title: "Bệnh nhân", key: "patient", render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>{record.phone}</Text>
        </Space>
      )},
    { title: "Phòng khám", dataIndex: "room", key: "room", render: (text) => <Tag color="default">{text}</Tag> },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Trạng thái", key: "status", dataIndex: "status", render: (status) => {
        const color = status === "waiting" ? "warning" : status === "in-progress" ? "processing" : "success";
        const text = status === "waiting" ? "Đang đợi" : status === "in-progress" ? "Đang khám" : "Đã xong";
        const icon = status === "in-progress" ? <SyncOutlined spin /> : null;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      }},
    { title: "Thao tác", key: "action", render: (_, record) => (
        <Space size="small">
          {record.status === "waiting" && <Button size="small" icon={<SwapOutlined />}>Chuyển phòng</Button>}
          {record.status === "done" && <Button size="small" type="link" icon={<FileTextOutlined />}>Đơn thuốc</Button>}
        </Space>
      )},
  ];

  const billingColumns = [
    { title: "Mã Hóa đơn", dataIndex: "id", key: "id", render: (text) => <strong>{text}</strong> },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    { title: "Bệnh nhân", dataIndex: "patient", key: "patient", render: (text) => <Text strong>{text}</Text> },
    { title: "Loại dịch vụ", dataIndex: "type", key: "type" },
    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (text) => <Text type="danger" strong>{text}</Text> },
    { title: "Trạng thái", key: "status", dataIndex: "status", render: (status) => (
        <Badge status={status === "paid" ? "success" : "warning"} text={status === "paid" ? "Đã thu tiền" : "Chờ thanh toán"} />
      )},
    { title: "Thao tác", key: "action", render: (_, record) => (
        record.status === "pending" ? (
          <Popconfirm title="Xác nhận thu tiền?" onConfirm={() => handlePay(record.id)} okText="Đồng ý" cancelText="Hủy">
            <Button type="primary" size="small" icon={<DollarOutlined />}>Thu tiền</Button>
          </Popconfirm>
        ) : (
          <Button size="small" icon={<PrinterOutlined />}>In biên lai</Button>
        )
      )},
  ];

  // --- CẤU TRÚC CÁC TAB (ANTD) ---
  const tabItems = [
    {
      key: "reception",
      label: (
        <span className="flex items-center gap-2">
          <SolutionOutlined /> Tiếp đón & Đăng ký
        </span>
      ),
      children: (
        <Row gutter={24} className="fade-in">
          <Col xs={24} md={10}>
            <Card title="🔍 Tìm kiếm Bệnh nhân" bordered={false} className="shadow-card">
              <Space.Compact style={{ width: "100%" }}>
                <Input size="large" placeholder="Nhập SĐT, Mã BN hoặc Tên..." prefix={<SearchOutlined className="text-gray-400" />} />
                <Button size="large" type="primary">Tìm</Button>
              </Space.Compact>
              <div className="mt-4">
                <Text type="secondary" className="mb-2 block">Gợi ý gần đây:</Text>
                <List
                  dataSource={[{ name: "Nguyễn Văn A", phone: "0901234567" }, { name: "Trần Thị C", phone: "0987654321" }]}
                  renderItem={(item) => (
                    <List.Item className="quick-list-item" actions={[<Button type="primary" ghost size="small" shape="round">Chọn</Button>]}>
                      <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={item.name} description={item.phone} />
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card title="📝 Đăng ký Khám mới" bordered={false} className="shadow-card">
              <Form form={form} layout="vertical" onFinish={handleRegister} initialValues={{ service: "Khám Tổng Quát", doctor: "" }}>
                <Row gutter={20}>
                  <Col span={12}>
                    <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                      <Input size="large" placeholder="VD: Nguyễn Văn A" prefix={<UserOutlined className="text-gray-400" />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                      <Input size="large" placeholder="09xxxx..." />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="service" label="Dịch vụ / Chuyên khoa">
                  <Select size="large" options={[{ value: "Khám Tổng Quát", label: "Khám Tổng Quát" }, { value: "Khám Nhi", label: "Khám Nhi" }, { value: "Khám Tai Mũi Họng", label: "Khám Tai Mũi Họng" }]} />
                </Form.Item>
                <Form.Item name="doctor" label="Chỉ định Bác sĩ (Tùy chọn)">
                  <Select size="large" placeholder="-- Chọn Bác sĩ đang rảnh --" options={[{ value: "BS. Lê Trọng B", label: "BS. Lê Trọng B (Phòng 101)" }, { value: "BS. Phạm D", label: "BS. Phạm D (Phòng 102)" }]} allowClear />
                </Form.Item>
                <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} block size="large">Đăng ký & Cấp số thứ tự</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "queue",
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined /> Quản lý Hàng chờ
        </span>
      ),
      children: (
        <div className="fade-in">
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Card bordered={false} className="stat-card stat-waiting">
                <Statistic title="⏳ Khách đang đợi" value={queueData.filter((q) => q.status === "waiting").length} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} className="stat-card stat-progress">
                <Statistic title="🩺 Đang khám" value={queueData.filter((q) => q.status === "in-progress").length} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} className="stat-card stat-done">
                <Statistic title="✅ Đã khám xong" value={queueData.filter((q) => q.status === "done").length} />
              </Card>
            </Col>
          </Row>
          <Card bordered={false} className="shadow-card" title="Danh sách Hàng chờ hôm nay">
            <Table columns={queueColumns} dataSource={queueData} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </div>
      ),
    },
    {
      key: "billing",
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined /> Thu ngân
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-card fade-in" title="💳 Quản lý Thu ngân" extra={<Button type="dashed">+ Tạo hóa đơn lẻ</Button>}>
          <Table columns={billingColumns} dataSource={billingData} rowKey="id" pagination={false} />
        </Card>
      ),
    },
    {
      key: "schedule",
      label: (
        <span className="flex items-center gap-2">
          <CalendarOutlined /> Lịch hẹn
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-card fade-in" title="📅 Lịch hẹn (Đặt Online)">
          <List
            itemLayout="horizontal"
            dataSource={appointmentsData}
            renderItem={(apt) => (
              <List.Item
                className="schedule-item-card"
                actions={[
                  apt.status === "pending" ? (
                    <Space key="actions">
                      <Button type="primary" style={{ background: "#10b981" }} icon={<CheckCircleOutlined />} onClick={() => handleConfirmAppointment(apt.id)}>Xác nhận</Button>
                      <Popconfirm title="Chắc chắn hủy lịch này?" onConfirm={() => handleCancelAppointment(apt.id)} okText="Có" cancelText="Không">
                        <Button danger icon={<CloseCircleOutlined />}>Hủy</Button>
                      </Popconfirm>
                    </Space>
                  ) : (
                    <Tag color="success" key="status">Đã xác nhận</Tag>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={48} style={{ backgroundColor: '#2563eb' }}>{apt.time.split(" ")[0]}</Avatar>}
                  title={<Text strong style={{ fontSize: "16px" }}>{apt.patient} - {apt.phone}</Text>}
                  description={`Khám với: ${apt.doctor} | Lịch hẹn: ${apt.time}`}
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar size={56} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }} icon={<MedicineBoxOutlined />} />
          <div>
            <Title level={3} style={{ margin: 0, color: '#111827' }}>Quầy Lễ Tân & Thu Ngân</Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>Hệ thống quản lý phòng khám Đa khoa</Text>
          </div>
        </div>
        <Button type="primary" size="large" icon={<FileTextOutlined />} style={{ background: '#111827' }}>Báo cáo cuối ngày</Button>
      </div>

      {/* ANT DESIGN TABS */}
      <Tabs defaultActiveKey="reception" items={tabItems} size="large" className="custom-tabs" />
    </div>
  );
};

export default StaffDashboard;