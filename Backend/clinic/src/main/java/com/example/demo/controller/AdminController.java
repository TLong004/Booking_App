package com.example.demo.controller;

import com.example.demo.dto.UserCreateRequest;
import com.example.demo.entity.Clinic;
import com.example.demo.entity.Specialty;
import com.example.demo.entity.ClinicService;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ClinicRepository;
import com.example.demo.repository.SpecialtyRepository;
import com.example.demo.repository.ClinicServiceRepository;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final UserRepository userRepository;
    private final ClinicRepository clinicRepository;
    private final SpecialtyRepository specialtyRepository;
    private final ClinicServiceRepository clinicServiceRepository;
    private final UserService userService;

    public AdminController(UserRepository userRepository, ClinicRepository clinicRepository, SpecialtyRepository specialtyRepository, ClinicServiceRepository clinicServiceRepository, UserService userService) {
        this.userRepository = userRepository;
        this.clinicRepository = clinicRepository;
        this.specialtyRepository = specialtyRepository;
        this.clinicServiceRepository = clinicServiceRepository;
        this.userService = userService;
    }

    // 1. Lấy danh sách toàn bộ người dùng trong hệ thống
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 2. Admin tạo tài khoản (Bác sĩ, Lễ tân...)
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        try {
            userService.createUser(request);
            return ResponseEntity.ok(Map.of("message", "Tạo tài khoản thành công với quyền: " + request.getRoleName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================================
    // QUẢN LÝ CƠ SỞ VẬT CHẤT & CHUYÊN KHOA
    // ==========================================

    // 1. Phòng khám (Clinics)
    @GetMapping("/clinics")
    public ResponseEntity<?> getAllClinics() {
        return ResponseEntity.ok(clinicRepository.findAll());
    }
    @PostMapping("/clinics")
    public ResponseEntity<?> createClinic(@RequestBody Clinic clinic) {
        return ResponseEntity.ok(clinicRepository.save(clinic));
    }

    // 2. Chuyên khoa (Specialties)
    @GetMapping("/specialties")
    public ResponseEntity<?> getAllSpecialties() {
        return ResponseEntity.ok(specialtyRepository.findAll());
    }
    @PostMapping("/specialties")
    public ResponseEntity<?> createSpecialty(@RequestBody Specialty specialty) {
        return ResponseEntity.ok(specialtyRepository.save(specialty));
    }

    // 3. Dịch vụ (Services)
    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        return ResponseEntity.ok(clinicServiceRepository.findAll());
    }

    @GetMapping("/specialties/{specialtyId}/services")
    public ResponseEntity<?> getServicesBySpecialty(@PathVariable Long specialtyId) {
        return ResponseEntity.ok(clinicServiceRepository.findBySpecialtyId(specialtyId));
    }

    @PostMapping("/services")
    public ResponseEntity<?> createService(@RequestBody ClinicService service) {
        return ResponseEntity.ok(clinicServiceRepository.save(service));
    }
}