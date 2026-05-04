package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_orders")
@Data
public class ServiceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medical_record_id")
    private Long medicalRecordId;

    @Column(name = "service_id")
    private Long serviceId;
    @Column(columnDefinition = "TEXT")
    private String result; // Kết quả xét nghiệm/siêu âm
    private String status; // PENDING, COMPLETED
}