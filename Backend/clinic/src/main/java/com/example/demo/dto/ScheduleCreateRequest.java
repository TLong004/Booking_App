package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ScheduleCreateRequest {
    private Long doctorId;
    private LocalDate workDate;
    private List<TimeSlot> timeSlots; // Danh sách các khung giờ

    @Data
    public static class TimeSlot {
        private LocalTime startTime;
        private LocalTime endTime;
    }
}