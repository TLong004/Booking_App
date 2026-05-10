package com.example.demo.controller;

import com.example.demo.entity.Specialty;
import com.example.demo.repository.SpecialtyRepository;
import com.example.demo.repository.ClinicServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialties") 
public class SpecialtyController {

    private final SpecialtyRepository specialtyRepository;
    private final ClinicServiceRepository clinicServiceRepository;

    // Chỉ giữ lại một constructor đúng
    public SpecialtyController(SpecialtyRepository specialtyRepository, ClinicServiceRepository clinicServiceRepository) {
        this.specialtyRepository = specialtyRepository;
        this.clinicServiceRepository = clinicServiceRepository;
    }

    // Lấy tất cả chuyên khoa (Thường là Public)
    @GetMapping
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyRepository.findAll());
    }

    // Lấy dịch vụ theo chuyên khoa
    @GetMapping("/{specialtyId}/services")
    public ResponseEntity<?> getServicesBySpecialty(@PathVariable Long specialtyId) {
        return ResponseEntity.ok(clinicServiceRepository.findBySpecialtyId(specialtyId));
    }
}