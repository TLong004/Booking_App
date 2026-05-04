package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medical_record_id")
    private Long medicalRecordId;

    @Column(columnDefinition = "TEXT")
    private String notes; // Lời dặn dò thêm của bác sĩ
}