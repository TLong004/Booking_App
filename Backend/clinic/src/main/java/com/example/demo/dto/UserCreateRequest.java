package com.example.demo.dto;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String username;
    private String email;
    private String phone;
    private String password;
    private String roleName;
    private Boolean isActive;

    // Bổ sung các thông tin cần thiết khi Admin tạo Bác sĩ
    private String fullName;
    private Long specialtyId;
    private String degree;
    private String roomNumber;
    private Double consultationFee;
    private String bio;
}