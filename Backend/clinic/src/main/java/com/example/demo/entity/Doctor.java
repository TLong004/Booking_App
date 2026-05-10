package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    @Column(name = "specialty_id")
    private Long specialtyId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String degree; 

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    private Double rating;

    @Transient
    private String specialtyName;
}