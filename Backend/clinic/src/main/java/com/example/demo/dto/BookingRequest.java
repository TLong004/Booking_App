package com.example.demo.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long patientId;   // ID hồ sơ bệnh nhân
    private Long doctorId;    // ID bác sĩ
    private Long scheduleId;  // ID slot đã chọn
    private String symptoms;  // Triệu chứng
}
