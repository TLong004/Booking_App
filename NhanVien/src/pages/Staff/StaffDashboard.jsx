import React, { useState } from "react";
import {
  Typography, Card, Row, Col, Input, Button, Table, Tag, Tabs,
  Form, Select, Space, message, Popconfirm, Statistic, List,
  Avatar, Badge, Divider
} from "antd";
import {
  SearchOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined,
  PrinterOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined,
  SwapOutlined, SyncOutlined, FileTextOutlined, CalendarOutlined,
  SolutionOutlined, MedicineBoxOutlined, BellOutlined, SettingOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import './StaffDashboard.css';

const { Title, Text } = Typography;

const StaffDashboard = () => {
  const [form] = Form.useForm();
  const [queueFilter, setQueueFilter] = useState("all");

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

  const handleSelectRecentPatient = (patient) => {
    form.setFieldsValue({
      name: patient.name,
      phone: patient.phone,
    });
    message.info(`Đã điền thông tin bệnh nhân ${patient.name}`);
  };

  const queueColumns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 90,
      render: (text) => (
        <Text style={{ fontWeight: 600, fontSize: 13, color: '#1e40af', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {text}
        </Text>
      )
    },
    {
      title: "Giờ vào",
      dataIndex: "time",
      key: "time",
      width: 100,
      render: (text) => (
        <Tag icon={<ClockCircleOutlined />} style={{ borderRadius: 6, fontWeight: 500, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569' }}>
          {text}
        </Tag>
      )
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      render: (_, record) => (
        <Space>
          <Avatar size={34} style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 600, fontSize: 13 }}>
            {record.name.split(' ').slice(-1)[0][0]}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{record.name}</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>{record.phone}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 90,
      render: (text) => (
        <Tag style={{ borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 500 }}>
          {text}
        </Tag>
      )
    },
    { title: "Bác sĩ phụ trách", dataIndex: "doctor", key: "doctor", render: (text) => <Text style={{ color: '#475569', fontSize: 13.5 }}>{text}</Text> },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: 130,
      render: (status) => {
        const map = {
          waiting: { color: 'warning', text: 'Đang đợi', bg: '#fffbeb', border: '#fde68a', textColor: '#b45309' },
          'in-progress': { color: 'processing', text: 'Đang khám', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1d4ed8', icon: <SyncOutlined spin style={{ fontSize: 11 }} /> },
          done: { color: 'success', text: 'Đã xong', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#15803d' },
        };
        const m = map[status];
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: m.bg, border: `1px solid ${m.border}`, color: m.textColor,
            padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600
          }}>
            {m.icon} {m.text}
          </span>
        );
      }
    },
    {
      title: "",
      key: "action",
      width: 110,
      render: (_, record) => (
        <Space size="small">
          {record.status === "waiting" && (
            <Button size="small" icon={<SwapOutlined />} style={{ borderRadius: 7, fontSize: 12 }}>Chuyển phòng</Button>
          )}
          {record.status === "done" && (
            <Button size="small" type="link" icon={<FileTextOutlined />} style={{ fontSize: 12, padding: '0 4px' }}>Đơn thuốc</Button>
          )}
        </Space>
      )
    },
  ];

  const billingColumns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text style={{ fontWeight: 700, fontSize: 13, color: '#1e40af', fontFamily: 'monospace' }}>{text}</Text>
    },
    { title: "Thời gian", dataIndex: "time", key: "time", render: (t) => <Text style={{ color: '#94a3b8', fontSize: 13 }}>{t}</Text> },
    { title: "Bệnh nhân", dataIndex: "patient", key: "patient", render: (text) => <Text style={{ fontWeight: 600, color: '#0f172a' }}>{text}</Text> },
    { title: "Dịch vụ", dataIndex: "type", key: "type", render: (t) => <Text style={{ color: '#64748b', fontSize: 13.5 }}>{t}</Text> },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (text) => (
        <Text style={{ color: '#dc2626', fontWeight: 700, fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {text}
        </Text>
      )
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        status === "paid"
          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600 }}>
              <CheckCircleOutlined style={{ fontSize: 11 }} /> Đã thu tiền
            </span>
          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '3px 10px', borderRadius: 6, fontSize: 12.5, fontWeight: 600 }}>
              <ClockCircleOutlined style={{ fontSize: 11 }} /> Chờ thanh toán
            </span>
      )
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        record.status === "pending" ? (
          <Popconfirm title="Xác nhận thu tiền?" onConfirm={() => handlePay(record.id)} okText="Đồng ý" cancelText="Hủy">
            <Button type="primary" size="small" icon={<DollarOutlined />} style={{ borderRadius: 7, fontSize: 12 }}>Thu tiền</Button>
          </Popconfirm>
        ) : (
          <Button size="small" icon={<PrinterOutlined />} style={{ borderRadius: 7, fontSize: 12 }}>In biên lai</Button>
        )
      )
    },
  ];

  const tabItems = [
    {
      key: "reception",
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SolutionOutlined /> Tiếp đón & Đăng ký</span>,
      children: (
        <Row gutter={[24, 24]} className="fade-in">
          <Col xs={24} md={10}>
            <Card
              title={
                <Space>
                  <span style={{ fontSize: 16 }}>🔍</span>
                  <span>Tìm kiếm bệnh nhân</span>
                </Space>
              }
              bordered={false}
              className="shadow-card"
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  size="large"
                  placeholder="Nhập SĐT, Mã BN hoặc Tên..."
                  prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
                />
                <Button size="large" type="primary">Tìm kiếm</Button>
              </Space.Compact>

              <Divider style={{ margin: '28px 0 24px', borderColor: '#e2e8f0' }} />

              <Text style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bệnh nhân gần đây
              </Text>
              <List
                style={{ marginTop: 10 }}
                dataSource={[
                  { name: "Nguyễn Văn A", phone: "0901234567", tag: "Q001" },
                  { name: "Trần Thị C", phone: "0987654321", tag: "Q002" }
                ]}
                renderItem={(item) => (
                  <List.Item
                    className="quick-list-item"
                    actions={[
                  <Button 
                    type="primary" 
                    ghost 
                    size="small" 
                    shape="round" 
                    icon={<ArrowRightOutlined />}
                    onClick={() => handleSelectRecentPatient(item)}
                  >
                    Chọn
                  </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: 13 }}>
                          {item.name.split(' ').slice(-1)[0][0]}
                        </Avatar>
                      }
                      title={<Text style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</Text>}
                      description={<Text style={{ color: '#94a3b8', fontSize: 12.5 }}>{item.phone}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card
              title={
                <Space>
                  <span style={{ fontSize: 16 }}>📝</span>
                  <span>Đăng ký khám mới</span>
                </Space>
              }
              bordered={false}
              className="shadow-card"
            >
              <Form form={form} layout="vertical" onFinish={handleRegister} initialValues={{ service: "Khám Tổng Quát", doctor: "" }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                      <Input size="large" placeholder="VD: Nguyễn Văn A" prefix={<UserOutlined style={{ color: '#cbd5e1' }} />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}>
                      <Input size="large" placeholder="09xxxx..." />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="service" label="Dịch vụ / Chuyên khoa">
                  <Select
                    size="large"
                    options={[
                      { value: "Khám Tổng Quát", label: "Khám Tổng Quát" },
                      { value: "Khám Nhi", label: "Khám Nhi" },
                      { value: "Khám Tai Mũi Họng", label: "Khám Tai Mũi Họng" }
                    ]}
                  />
                </Form.Item>
                <Form.Item name="doctor" label="Chỉ định bác sĩ (tùy chọn)">
                  <Select
                    size="large"
                    placeholder="— Chọn bác sĩ đang rảnh —"
                    options={[
                      { value: "BS. Lê Trọng B", label: "BS. Lê Trọng B · Phòng 101" },
                      { value: "BS. Phạm D", label: "BS. Phạm D · Phòng 102" }
                    ]}
                    allowClear
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<UserAddOutlined />}
                  block
                  size="large"
                  style={{ marginTop: 4, height: 46, fontSize: 15 }}
                >
                  Đăng ký & Cấp số thứ tự
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "queue",
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClockCircleOutlined /> Hàng chờ</span>,
      children: (
        <div className="fade-in">
          <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
            {[
              { cls: "stat-all", title: "📋 Tất cả", filter: "all", count: queueData.length },
              { cls: "stat-waiting", title: "⏳ Đang đợi", filter: "waiting", count: queueData.filter(q => q.status === "waiting").length },
              { cls: "stat-progress", title: "🩺 Đang khám", filter: "in-progress", count: queueData.filter(q => q.status === "in-progress").length },
              { cls: "stat-done", title: "✅ Đã xong", filter: "done", count: queueData.filter(q => q.status === "done").length },
            ].map(({ cls, title, filter, count }) => (
              <Col xs={12} sm={12} md={6} key={filter}>
                <Card 
                  bordered={false} 
                  className={`stat-card ${cls}`}
                  style={{ 
                    cursor: 'pointer', 
                    border: queueFilter === filter ? '2px solid #1677ff' : '2px solid transparent',
                    boxShadow: queueFilter === filter ? '0 4px 12px rgba(22, 119, 255, 0.15)' : undefined,
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setQueueFilter(filter)}
                >
                  <Statistic title={title} value={count} />
                </Card>
              </Col>
            ))}
          </Row>
          <Card
            bordered={false}
            className="shadow-card"
            title="Danh sách hàng chờ hôm nay"
            extra={
              <Text style={{ fontSize: 12, color: '#94a3b8' }}>
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            }
          >
            <Table
              columns={queueColumns}
              dataSource={queueFilter === "all" ? queueData : queueData.filter(q => q.status === queueFilter)}
              rowKey="id"
              pagination={{ pageSize: 5, size: 'small' }}
              size="middle"
            />
          </Card>
        </div>
      ),
    },
    {
      key: "billing",
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarOutlined /> Thu ngân</span>,
      children: (
        <Card
          bordered={false}
          className="shadow-card fade-in"
          title={
            <Space>
              <span style={{ fontSize: 16 }}>💳</span>
              <span>Quản lý thu ngân</span>
            </Space>
          }
          extra={
            <Space>
              <Tag color="green" style={{ padding: '6px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
                Tổng thu hôm nay: <strong style={{color: '#16a34a'}}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    billingData.filter(b => b.status === "paid").reduce((sum, b) => sum + parseInt(b.total.replace(/\D/g, '')), 0)
                  )}
                </strong>
              </Tag>
              <Button type="dashed" size="small" style={{ borderRadius: 7, fontSize: 13, height: 32 }}>
                + Tạo hóa đơn lẻ
              </Button>
            </Space>
          }
        >
          <Table columns={billingColumns} dataSource={billingData} rowKey="id" pagination={false} size="middle" />
        </Card>
      ),
    },
    {
      key: "schedule",
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarOutlined /> Lịch hẹn</span>,
      children: (
        <Card
          bordered={false}
          className="shadow-card fade-in"
          title={
            <Space>
              <span style={{ fontSize: 16 }}>📅</span>
              <span>Lịch hẹn đặt online</span>
            </Space>
          }
          extra={
            <Tag style={{ borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontWeight: 600 }}>
              {appointmentsData.length} lịch hôm nay
            </Tag>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={appointmentsData}
            renderItem={(apt) => (
              <List.Item
                className="schedule-item-card"
                actions={[
                  apt.status === "pending" ? (
                    <Space key="actions">
                      <Button
                        type="primary"
                        style={{ background: "#16a34a", borderColor: "#16a34a", borderRadius: 8 }}
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleConfirmAppointment(apt.id)}
                        size="small"
                      >
                        Xác nhận
                      </Button>
                      <Popconfirm
                        title="Chắc chắn hủy lịch này?"
                        onConfirm={() => handleCancelAppointment(apt.id)}
                        okText="Có" cancelText="Không"
                      >
                        <Button danger size="small" icon={<CloseCircleOutlined />} style={{ borderRadius: 8 }}>Hủy</Button>
                      </Popconfirm>
                    </Space>
                  ) : (
                    <span key="confirmed" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
                      padding: '4px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 600
                    }}>
                      <CheckCircleOutlined style={{ fontSize: 11 }} /> Đã xác nhận
                    </span>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={46}
                      style={{ background: '#1e40af', color: '#ffffff', fontWeight: 700, fontSize: 13, borderRadius: 12 }}
                    >
                      {apt.time.split(" ")[0]}
                    </Avatar>
                  }
                  title={
                    <Text style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                      {apt.patient}
                      <Text style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8, fontSize: 13 }}>· {apt.phone}</Text>
                    </Text>
                  }
                  description={
                    <Text style={{ color: '#64748b', fontSize: 13.5 }}>
                      Khám với <strong style={{ color: '#334155' }}>{apt.doctor}</strong> · {apt.time}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="staff-dashboard" style={{ padding: '24px 32px' }}>
      {/* HEADER */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
        <Space align="center" size={14}>
          <Avatar
            size={44}
            style={{ background: '#dbeafe', color: '#1e40af', flexShrink: 0 }}
            icon={<MedicineBoxOutlined style={{ fontSize: 20 }} />}
          />
          <div>
            <Title level={4} style={{ margin: 0, color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 17, letterSpacing: '-0.2px' }}>
              Quầy lễ tân & Thu ngân
            </Title>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              Phòng khám Đa khoa — Hệ thống quản lý
            </Text>
          </div>
        </Space>

        <Space size={10}>
          <Button
            icon={<BellOutlined />}
            style={{ borderRadius: 9, border: '1px solid #e2e8f0', color: '#64748b' }}
          />
          <Button
            icon={<SettingOutlined />}
            style={{ borderRadius: 9, border: '1px solid #e2e8f0', color: '#64748b' }}
          />
          <Button
            type="primary"
            size="middle"
            icon={<FileTextOutlined />}
            style={{ borderRadius: 9, background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
          >
            Báo cáo cuối ngày
          </Button>
        </Space>
      </div>

      {/* TABS */}
      <div>
        <Tabs defaultActiveKey="reception" items={tabItems} size="large" className="custom-tabs" />
      </div>
    </div>
  );
};

export default StaffDashboard;