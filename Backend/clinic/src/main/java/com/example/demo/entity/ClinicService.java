package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "services") // Tên bảng trong DB là services
@Data
public class ClinicService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "specialty_id")
    private Long specialtyId; // Liên kết Dịch vụ với Chuyên khoa (Có thể null nếu là dịch vụ dùng chung)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;
}