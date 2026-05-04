package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId; // ID của Bác sĩ

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate; // Ngày làm việc

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; // Thời gian bắt đầu (vd: 08:00)

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime; // Thời gian kết thúc (vd: 08:30)

    @Column(name = "is_available")
    private Boolean isAvailable = true; // Trạng thái: Còn trống (true) hay đã được đặt (false)
}