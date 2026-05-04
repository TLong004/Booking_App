package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorIdAndWorkDateOrderByStartTimeAsc(Long doctorId, LocalDate workDate);
    List<Schedule> findByWorkDateBetweenOrderByWorkDateAscStartTimeAsc(LocalDate startDate, LocalDate endDate);
    List<Schedule> findByDoctorIdAndWorkDateBetweenOrderByWorkDateAscStartTimeAsc(Long doctorId, LocalDate startDate, LocalDate endDate);
}