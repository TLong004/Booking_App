package com.example.demo.dto;

import lombok.Data;

@Data
public class FirebaseAuthRequest {
    private String token; // Firebase ID Token nhận từ App
    private String fullName; // (Tuỳ chọn) Tên hiển thị khi tạo mới user
    private String phone; // (Tuỳ chọn) Số điện thoại
}