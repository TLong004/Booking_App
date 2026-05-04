package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    @Column(name = "services_fee")
    private BigDecimal servicesFee;

    @Column(name = "medicine_fee")
    private BigDecimal medicineFee;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    private String status; // UNPAID, PAID, CANCELLED
    
    @Column(name = "payment_method")
    private String paymentMethod; // CASH, TRANSFER, CARD

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}