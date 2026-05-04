package com.example.demo.repository;

import com.example.demo.entity.Appointment;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    long countByAppointmentDate(LocalDate date);
    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE (:date IS NULL OR a.appointmentDate = :date) AND (:doctorId IS NULL OR a.doctorId = :doctorId) AND (:status IS NULL OR a.status = :status) AND (:specialtyId IS NULL OR a.doctorId IN (SELECT d.id FROM Doctor d WHERE d.specialtyId = :specialtyId))")
    Page<Appointment> searchAppointments(@Param("date") LocalDate date, @Param("doctorId") Long doctorId, @Param("specialtyId") Long specialtyId, @Param("status") String status, Pageable pageable);

    List<Appointment> findByParentAppointmentId(Long parentAppointmentId);
    
    Optional<Appointment> findByScheduleId(Long scheduleId);

    List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);
}