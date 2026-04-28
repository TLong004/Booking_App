package com.example.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String phone;
    private String password;
    // Bổ sung Tên đầy đủ cho Bệnh nhân
    private String fullName; 
}