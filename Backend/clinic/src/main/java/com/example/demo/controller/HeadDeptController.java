package com.example.demo.controller;

import com.example.demo.dto.ScheduleCreateRequest;
import com.example.demo.entity.Schedule;
import com.example.demo.repository.ScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head-dept")
public class HeadDeptController {

    private final ScheduleRepository scheduleRepository;

    public HeadDeptController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    // 1. Trưởng khoa tạo lịch làm việc cho bác sĩ
    @PostMapping("/schedules")
    public ResponseEntity<?> createSchedules(@RequestBody ScheduleCreateRequest request) {
        List<Schedule> schedulesToSave = new ArrayList<>();
        
        for (ScheduleCreateRequest.TimeSlot slot : request.getTimeSlots()) {
            Schedule schedule = new Schedule();
            schedule.setDoctorId(request.getDoctorId());
            schedule.setWorkDate(request.getWorkDate());
            schedule.setStartTime(slot.getStartTime());
            schedule.setEndTime(slot.getEndTime());
            schedule.setIsAvailable(true); // Mặc định là có sẵn để bệnh nhân đặt
            schedulesToSave.add(schedule);
        }
        
        scheduleRepository.saveAll(schedulesToSave);
        return ResponseEntity.ok(Map.of("message", "Tạo lịch khám thành công!", "slotsCreated", schedulesToSave.size()));
    }

    // 2. Lấy danh sách lịch làm việc của 1 bác sĩ trong 1 ngày (để xem trước khi tạo)
    @GetMapping("/schedules")
    public ResponseEntity<?> getSchedules(@RequestParam Long doctorId, @RequestParam String workDate) {
        return ResponseEntity.ok(scheduleRepository.findByDoctorIdAndWorkDateOrderByStartTimeAsc(doctorId, LocalDate.parse(workDate)));
    }
}