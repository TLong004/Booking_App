package com.example.demo.controller;

import com.example.demo.entity.Patient;
import com.example.demo.repository.PatientRepository;
import com.example.demo.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    private Long getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    // 1. Lấy danh sách hồ sơ khám bệnh của tài khoản đang đăng nhập
    @GetMapping
    public ResponseEntity<List<Patient>> getMyProfiles() {
        return ResponseEntity.ok(patientRepository.findAllByUserId(getCurrentUserId()));
    }

    // 2. Tạo mới hồ sơ khám bệnh (ví dụ: tạo cho người thân)
    @PostMapping
    public ResponseEntity<?> createProfile(@RequestBody Patient patient) {
        patient.setUserId(getCurrentUserId());
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    // 3. Sửa hồ sơ khám bệnh
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Patient patientDetails) {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent() && existingPatient.get().getUserId().equals(getCurrentUserId())) {
            Patient patient = existingPatient.get();
            patient.setFullName(patientDetails.getFullName());
            patient.setDob(patientDetails.getDob());
            patient.setGender(patientDetails.getGender());
            patient.setAddress(patientDetails.getAddress());
            return ResponseEntity.ok(patientRepository.save(patient));
        }
        return ResponseEntity.status(403).body(Map.of("message", "Không tìm thấy hồ sơ hoặc bạn không có quyền sửa!"));
    }

    // 4. Xóa hồ sơ khám bệnh
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent() && existingPatient.get().getUserId().equals(getCurrentUserId())) {
            patientRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Xóa hồ sơ thành công!"));
        }
        return ResponseEntity.status(403).body(Map.of("message", "Không tìm thấy hồ sơ hoặc bạn không có quyền xóa!"));
    }
}