package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medicines")
@Data
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên thuốc

    private String unit; // Đơn vị tính (VD: Viên, Vỉ, Hộp...)
    private Double price; // Giá thuốc
    
    private String description; // Mô tả/Hướng dẫn sử dụng

    @Column(name = "stock_quantity")
    private Integer stockQuantity; // Số lượng tồn kho

    @Column(name = "usage_instruction", columnDefinition = "TEXT")
    private String usage; // Cách dùng
}