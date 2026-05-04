package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prescription_items")
@Data
public class PrescriptionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prescription_id")
    private Long prescriptionId;

    @Column(name = "medicine_id")
    private Long medicineId;
    private Integer quantity;
    private String dosage; // Liều lượng (VD: Sáng 1 viên, Tối 1 viên)
}