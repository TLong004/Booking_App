package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "queue_number")
    private Integer queueNumber;

    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;

    @Column(name = "no_show_reason", columnDefinition = "TEXT")
    private String noShowReason;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt; // Thời điểm bệnh nhân thực tế đến (dùng cho trường hợp đến muộn)

    @Column(name = "parent_appointment_id")
    private Long parentAppointmentId; // Dành cho tái khám
}