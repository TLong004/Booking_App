package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medical_records")
@Data
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(columnDefinition = "TEXT")
    private String diagnosis; // Chẩn đoán

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan; // Phác đồ điều trị

    @Column(name = "doctor_notes", columnDefinition = "TEXT")
    private String doctorNotes; // Ghi chú của bác sĩ
}