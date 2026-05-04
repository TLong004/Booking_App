package com.example.demo.repository;

import com.example.demo.entity.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    @Query("SELECT m FROM MedicalRecord m JOIN Appointment a ON m.appointmentId = a.id WHERE (:doctorId IS NULL OR a.doctorId = :doctorId) AND (:patientId IS NULL OR a.patientId = :patientId) AND (:date IS NULL OR a.appointmentDate = :date)")
    Page<MedicalRecord> searchMedicalRecords(@Param("doctorId") Long doctorId, @Param("patientId") Long patientId, @Param("date") LocalDate date, Pageable pageable);
}