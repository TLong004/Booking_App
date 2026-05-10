package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorIdAndWorkDateOrderByStartTimeAsc(Long doctorId, LocalDate workDate);
    List<Schedule> findByDoctorIdAndWorkDateAndIsAvailableTrueOrderByStartTimeAsc(Long doctorId, LocalDate workDate);

    @Query("SELECT DISTINCT s.workDate FROM Schedule s WHERE s.doctorId = :doctorId AND s.workDate BETWEEN :from AND :to AND s.isAvailable = true ORDER BY s.workDate ASC")
    List<LocalDate> findAvailableDatesByDoctorId(@Param("doctorId") Long doctorId, @Param("from") LocalDate from, @Param("to") LocalDate to);
    List<Schedule> findByWorkDateBetweenOrderByWorkDateAscStartTimeAsc(LocalDate startDate, LocalDate endDate);
    List<Schedule> findByDoctorIdAndWorkDateBetweenOrderByWorkDateAscStartTimeAsc(Long doctorId, LocalDate startDate, LocalDate endDate);
}