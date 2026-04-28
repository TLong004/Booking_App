package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
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
}