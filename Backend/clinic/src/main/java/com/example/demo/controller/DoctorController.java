package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.ScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;

    public DoctorController(DoctorRepository doctorRepository, ScheduleRepository scheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // API Lấy danh sách Bác sĩ theo Chuyên khoa
    @GetMapping("/specialty/{specialtyId}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialty(@PathVariable Long specialtyId) {
        return ResponseEntity.ok(doctorRepository.findBySpecialtyId(specialtyId));
    }

    // API Tìm kiếm Bác sĩ theo tên (Gần đúng, không phân biệt hoa thường)
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(@RequestParam("query") String query) {
        return ResponseEntity.ok(doctorRepository.findByFullNameContainingIgnoreCase(query));
    }

    // API Xem chi tiết 1 Bác sĩ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            return ResponseEntity.ok(doctor.get());
        }
        return ResponseEntity.notFound().build();
    }

    // API Cập nhật thông tin Bác sĩ (Học vị, Phòng, Giá tiền, Bio...)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setFullName(doctorDetails.getFullName());
            doctor.setDegree(doctorDetails.getDegree());
            doctor.setRoomNumber(doctorDetails.getRoomNumber());
            doctor.setConsultationFee(doctorDetails.getConsultationFee());
            doctor.setBio(doctorDetails.getBio());
            doctor.setAvatarUrl(doctorDetails.getAvatarUrl());
            return ResponseEntity.ok(doctorRepository.save(doctor));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API Lấy danh sách lịch khám (Time Slots) của 1 Bác sĩ trong 1 ngày cụ thể
    @GetMapping("/{id}/schedules")
    public ResponseEntity<?> getDoctorSchedules(@PathVariable Long id, @RequestParam String date) {
        return ResponseEntity.ok(scheduleRepository.findByDoctorIdAndWorkDateOrderByStartTimeAsc(id, LocalDate.parse(date)));
    }
}