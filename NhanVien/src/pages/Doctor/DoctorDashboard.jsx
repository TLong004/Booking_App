import React, { useState } from 'react';
import { Row, Col, Card, List, Tag, Typography, Tabs, Form, Input, Button, Select, Space, InputNumber, Divider, message, Empty } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, PlusOutlined, MinusCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import './DoctorDashboard.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- MOCK DATA ---
const mockQueue = [
  { id: 'Q1', name: 'Nguyễn Văn A', age: 35, gender: 'Nam', status: 'in-progress', time: '08:30', reason: 'Đau đầu, sốt cao' },
  { id: 'Q2', name: 'Trần Thị B', age: 28, gender: 'Nữ', status: 'waiting', time: '08:45', reason: 'Đau dạ dày' },
  { id: 'Q3', name: 'Lê C', age: 45, gender: 'Nam', status: 'waiting', time: '09:00', reason: 'Khám định kỳ' },
  { id: 'Q4', name: 'Phạm D', age: 60, gender: 'Nữ', status: 'completed', time: '08:00', reason: 'Tái khám huyết áp' },
];

const mockMedicines = [
  { value: 'M01', label: 'Paracetamol 500mg (Viên)' },
  { value: 'M02', label: 'Amoxicillin 250mg (Viên)' },
  { value: 'M03', label: 'Omeprazole 20mg (Viên nang)' },
  { value: 'M04', label: 'Vitamin C 1000mg (Viên sủi)' },
  { value: 'M05', label: 'Oresol (Gói)' },
];

const mockServices = [
  { value: 'S01', label: 'Xét nghiệm máu cơ bản' },
  { value: 'S02', label: 'Siêu âm ổ bụng' },
  { value: 'S03', label: 'X-Quang ngực thẳng' },
];

const DoctorDashboard = () => {
  const [form] = Form.useForm();
  const [activePatient, setActivePatient] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Lọc hàng chờ
  const filteredQueue = mockQueue.filter(p => filterStatus === 'all' || p.status === filterStatus);

  // Chọn bệnh nhân để khám
  const handleSelectPatient = (patient) => {
    setActivePatient(patient);
    form.resetFields(); // Reset form khi đổi bệnh nhân
    form.setFieldsValue({
      reason: patient.reason, // Lấy lý do từ lúc đăng ký ở Lễ tân
    });
  };

  // Hoàn thành ca khám
  const onFinish = (values) => {
    console.log('Dữ liệu ca khám:', { patientId: activePatient.id, ...values });
    message.success(`Đã hoàn tất khám cho bệnh nhân ${activePatient.name}`);
    // Gọi API lưu MedicalRecord và Prescriptions ở đây...
    setActivePatient(null); // Đóng bàn khám
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header mb-4">
        <Title level={3} style={{ margin: 0 }}>Phòng Khám - BS. Lê Trọng B</Title>
        <Text type="secondary">Phòng: 101 | Chuyên khoa: Đa khoa</Text>
      </div>

      <Row gutter={24}>
        {/* CỘT TRÁI: DANH SÁCH HÀNG CHỜ (30%) */}
        <Col xs={24} lg={7} xl={6}>
          <Card className="queue-card" title="Hàng chờ khám bệnh" bodyStyle={{ padding: 0 }}>
            <div className="queue-filters p-3 border-b">
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  { value: 'waiting', label: '⏳ Đang đợi' },
                  { value: 'in-progress', label: '🩺 Đang khám' },
                  { value: 'completed', label: '✅ Đã khám xong' },
                ]}
              />
            </div>
            <List
              className="queue-list"
              itemLayout="horizontal"
              dataSource={filteredQueue}
              renderItem={(item) => (
                <List.Item
                  className={`queue-item ${activePatient?.id === item.id ? 'active' : ''}`}
                  onClick={() => handleSelectPatient(item)}
                >
                  <List.Item.Meta
                    avatar={<div className="queue-avatar"><UserOutlined /></div>}
                    title={<span className="font-bold">{item.name}</span>}
                    description={<span>{item.age} tuổi - {item.gender}</span>}
                  />
                  <div className="queue-status text-right">
                    <div className="text-xs text-gray-500 mb-1"><ClockCircleOutlined /> {item.time}</div>
                    {item.status === 'waiting' && <Tag color="warning">Đang đợi</Tag>}
                    {item.status === 'in-progress' && <Tag color="processing">Đang khám</Tag>}
                    {item.status === 'completed' && <Tag color="success">Đã xong</Tag>}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* CỘT PHẢI: BÀN KHÁM BỆNH (70%) */}
        <Col xs={24} lg={17} xl={18}>
          <Card className="consultation-card" bodyStyle={{ padding: '20px 24px', height: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            {!activePatient ? (
              <div className="empty-state">
                <Empty
                  image={<FileTextOutlined style={{ fontSize: 64, color: '#e5e7eb' }} />}
                  description={<span className="text-gray-500">Vui lòng chọn một bệnh nhân từ danh sách hàng chờ để bắt đầu khám.</span>}
                />
              </div>
            ) : (
              <div className="consultation-content fade-in">
                <div className="patient-header flex-between mb-4 pb-4 border-b">
                  <div>
                    <Title level={4} style={{ margin: 0, color: '#1d4ed8' }}>{activePatient.name}</Title>
                    <Text type="secondary">Mã BN: {activePatient.id} | {activePatient.age} tuổi | Giới tính: {activePatient.gender}</Text>
                  </div>
                  <Button type="primary" ghost>Lịch sử khám (3)</Button>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <Tabs defaultActiveKey="2" type="card">
                    {/* TAB 1: THÔNG TIN */}
                    <Tabs.TabPane tab="Thông tin Hành chính" key="1">
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item label="Lý do đến khám" name="reason">
                            <TextArea rows={2} readOnly className="bg-gray-50" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Tabs.TabPane>

                    {/* TAB 2: KHÁM BỆNH */}
                    <Tabs.TabPane tab="Khám bệnh & Chẩn đoán" key="2">
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item label="Dấu hiệu sinh tồn (Mạch, Nhiệt độ, Huyết áp...)">
                            <Input placeholder="Nhập các chỉ số sinh tồn (nếu điều dưỡng chưa nhập)..." />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="Mô tả triệu chứng / Bệnh sử" name="symptoms" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Mô tả chi tiết tình trạng bệnh nhân..." />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="Chẩn đoán sơ bộ" name="diagnosis" rules={[{ required: true }]}>
                            <Input placeholder="Ví dụ: Viêm họng cấp, Trào ngược dạ dày..." />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="Lời khuyên của Bác sĩ" name="advice">
                            <TextArea rows={2} placeholder="Kiêng ăn đồ cay nóng, uống nhiều nước..." />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Tabs.TabPane>

                    {/* TAB 3: CHỈ ĐỊNH & ĐƠN THUỐC */}
                    <Tabs.TabPane tab="Chỉ định & Đơn thuốc" key="3">
                      <Form.Item label="Chỉ định Cận lâm sàng / Dịch vụ" name="services">
                        <Select mode="multiple" allowClear placeholder="Tìm và chọn các xét nghiệm, siêu âm..." options={mockServices} />
                      </Form.Item>

                      <Divider orientation="left">Kê đơn thuốc (E-Prescription)</Divider>
                      <Form.List name="prescriptions">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }} align="baseline">
                                <Form.Item {...restField} name={[name, 'medicine_id']} rules={[{ required: true, message: 'Chọn thuốc' }]}>
                                  <Select showSearch placeholder="Tìm thuốc..." options={mockMedicines} style={{ width: 250 }} filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Số lượng' }]}>
                                  <InputNumber placeholder="SL" min={1} style={{ width: 80 }} />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, 'dosage']} rules={[{ required: true, message: 'Liều dùng' }]}>
                                  <Input placeholder="Liều (VD: Sáng 1, Tối 1)" style={{ width: 180 }} />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, 'usage']}>
                                  <Input placeholder="Cách dùng (VD: Sau ăn)" style={{ width: 150 }} />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#dc2626', fontSize: '18px', marginTop: '8px' }} />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm thuốc vào đơn</Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Tabs.TabPane>
                  </Tabs>

                  {/* HÀNH ĐỘNG CHÍNH */}
                  <div className="form-actions mt-6 flex justify-end gap-3 pt-4 border-t">
                    <Button onClick={() => setActivePatient(null)}>Hủy bỏ</Button>
                    <Button type="primary" htmlType="submit" size="large" icon={<CheckCircleOutlined />}>Hoàn thành Ca khám & In đơn</Button>
                  </div>
                </Form>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;