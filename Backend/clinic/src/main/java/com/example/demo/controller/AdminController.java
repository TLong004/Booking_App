package com.example.demo.controller;

import com.example.demo.dto.UserCreateRequest;
import com.example.demo.entity.Appointment;
import com.example.demo.entity.Clinic;
import com.example.demo.entity.Specialty;
import com.example.demo.entity.ClinicService;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Invoice;
import com.example.demo.entity.MedicalRecord;
import com.example.demo.entity.Medicine;
import com.example.demo.entity.Patient;
import com.example.demo.entity.User;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.Review;
import com.example.demo.entity.ServiceOrder;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ClinicRepository;
import com.example.demo.repository.SpecialtyRepository;
import com.example.demo.repository.ClinicServiceRepository;
import com.example.demo.repository.MedicineRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.repository.PrescriptionItemRepository;
import com.example.demo.repository.ServiceOrderRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserRepository userRepository;
    private final ClinicRepository clinicRepository;
    private final SpecialtyRepository specialtyRepository;
    private final ClinicServiceRepository clinicServiceRepository;
    private final UserService userService;
    private final MedicineRepository medicineRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReviewRepository reviewRepository;
    private final ScheduleRepository scheduleRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final RoleRepository roleRepository;

    // ==========================================
    // 1. DASHBOARD
    // ==========================================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();

        Map<String, Object> stats = new HashMap<>();

        // Doanh thu hôm nay (từ các hóa đơn đã thanh toán)
        BigDecimal todayRevenue = invoiceRepository.sumTodayRevenue(startOfToday);
        stats.put("todayRevenue", todayRevenue);
        // Note: todayRevenueChange cần dữ liệu ngày hôm qua, tạm thời để mock
        stats.put("todayRevenueChange", 12.5);

        // Bệnh nhân mới trong ngày
        long newPatients = userRepository.countNewPatientsToday(startOfToday);
        stats.put("newPatients", newPatients);
        // Note: newPatientsChange cần dữ liệu ngày hôm qua, tạm thời để mock
        stats.put("newPatientsChange", 4);

        // Lịch hẹn hôm nay
        long todayAppointments = appointmentRepository.countByAppointmentDate(today);
        stats.put("todayAppointments", todayAppointments);
        // Note: todayAppointmentsChange cần dữ liệu ngày hôm qua, tạm thời để mock
        stats.put("todayAppointmentsChange", -3);

        // Bác sĩ hoạt động (tạm tính là tổng số bác sĩ)
        stats.put("activeDoctors", doctorRepository.count()); // Simplified: all doctors are active
        stats.put("totalDoctors", doctorRepository.count()); // Simplified: all doctors are active

        return ResponseEntity.ok(Map.of("data", stats));
    }

    @GetMapping("/dashboard/recent-appointments")
    public ResponseEntity<?> getRecentAppointments() {
        // Trả về Mock Data chuẩn cấu trúc yêu cầu do Entity Appointment chưa hoàn thiện
        List<Map<String, Object>> mockAppointments = List.<Map<String, Object>>of(
            Map.<String, Object>of(
                "id", 101,
                "appointmentDate", "2025-05-03",
                "queueNumber", 1,
                "status", "COMPLETED",
                "patient", Map.of("id", 1, "fullName", "Nguyễn Văn A"),
                "doctor", Map.of("id", 1, "fullName", "TS.BS. Trần Minh Khoa"),
                "slot", Map.of("startTime", "08:00:00"),
                "serviceOrders", List.of(Map.of("service", Map.of("name", "Khám tổng quát")))
            )
        );
        return ResponseEntity.ok(Map.of("data", mockAppointments));
    }

    @GetMapping("/dashboard/low-stock-alerts")
    public ResponseEntity<?> getLowStockAlerts(@RequestParam(defaultValue = "20") int threshold) {
        List<Medicine> lowStockMedicines = medicineRepository.findByStockQuantityLessThanEqual(threshold);
        return ResponseEntity.ok(Map.of("data", lowStockMedicines));
    }

    // ==========================================
    // 2. QUẢN LÝ NGƯỜI DÙNG (USERS)
    // ==========================================
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String roleName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.searchUsers(search, isActive, roleName, pageable);

        List<Map<String, Object>> responseList = userPage.getContent().stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername());
            map.put("email", user.getEmail());
            map.put("phone", user.getPhone());
            map.put("isActive", user.getIsActive());
            map.put("createdAt", user.getCreatedAt());
            map.put("roles", user.getRoles());

            if (user.getRoles().stream().anyMatch(r -> r.getRoleName().equals("ROLE_DOCTOR") || r.getRoleName().equals("ROLE_HEAD_DEPT"))) {
                doctorRepository.findByUserId(user.getId()).ifPresent(doc -> {
                    Map<String, Object> docMap = new HashMap<>();
                    docMap.put("id", doc.getId());
                    docMap.put("fullName", doc.getFullName());
                    docMap.put("degree", doc.getDegree());
                    docMap.put("roomNumber", doc.getRoomNumber());
                    docMap.put("consultationFee", doc.getConsultationFee());
                    docMap.put("bio", doc.getBio());
                    if (doc.getSpecialtyId() != null) {
                        specialtyRepository.findById(doc.getSpecialtyId()).ifPresent(spec -> 
                            docMap.put("specialty", Map.of("id", spec.getId(), "name", spec.getName()))
                        );
                    }
                    map.put("doctor", docMap);
                });
            }
            return map;
        }).collect(Collectors.toList());
        
        return buildPaginatedResponse(userPage, responseList);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        try {
            User user = userService.createUser(request);
            return ResponseEntity.ok(Map.of("message", "Tạo tài khoản thành công!", "userId", user.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            userService.updateUser(id, updates);
            return ResponseEntity.ok(Map.of("message", "Cập nhật người dùng thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setDeletedAt(LocalDateTime.now());
            user.setIsActive(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Xóa (Soft Delete) người dùng thành công!"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setIsActive(!user.getIsActive());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công!", "isActive", user.getIsActive()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu mới không được để trống!"));
        }
        try {
            userService.updateUser(id, Map.of("password", newPassword));
            return ResponseEntity.ok(Map.of("message", "Reset mật khẩu thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================================
    // 3. QUẢN LÝ BÁC SĨ (DOCTORS)
    // ==========================================
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long specialtyId,
            @RequestParam(required = false) String degree,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Doctor> doctorPage = doctorRepository.searchDoctors(search, specialtyId, degree, pageable);

        List<Map<String, Object>> responseList = doctorPage.getContent().stream().map(doc -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", doc.getId());
            map.put("fullName", doc.getFullName());
            map.put("degree", doc.getDegree());
            map.put("roomNumber", doc.getRoomNumber());
            map.put("consultationFee", doc.getConsultationFee());
            map.put("bio", doc.getBio());
            map.put("avatarUrl", doc.getAvatarUrl());
            
            if (doc.getSpecialtyId() != null) {
                specialtyRepository.findById(doc.getSpecialtyId()).ifPresent(spec -> 
                    map.put("specialty", Map.of("id", spec.getId(), "name", spec.getName()))
                );
            }
            if (doc.getUserId() != null) {
                userRepository.findById(doc.getUserId()).ifPresent(user -> 
                    map.put("user", Map.of("id", user.getId(), "username", user.getUsername(), "isActive", user.getIsActive()))
                );
            }
            return map;
        }).collect(Collectors.toList());
        
        return buildPaginatedResponse(doctorPage, responseList);
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id).map(doc -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", doc.getId());
            map.put("fullName", doc.getFullName());
            map.put("degree", doc.getDegree());
            map.put("roomNumber", doc.getRoomNumber());
            map.put("consultationFee", doc.getConsultationFee());
            map.put("bio", doc.getBio());
            map.put("avatarUrl", doc.getAvatarUrl());
            if (doc.getSpecialtyId() != null) {
                specialtyRepository.findById(doc.getSpecialtyId()).ifPresent(spec -> 
                    map.put("specialty", Map.of("id", spec.getId(), "name", spec.getName()))
                );
            }
            return ResponseEntity.ok(Map.of("data", map));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(Map.of("message", "Thêm hồ sơ Bác sĩ thành công!", "data", doctorRepository.save(doctor)));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doc -> {
            if (doctorDetails.getFullName() != null) doc.setFullName(doctorDetails.getFullName());
            if (doctorDetails.getDegree() != null) doc.setDegree(doctorDetails.getDegree());
            if (doctorDetails.getSpecialtyId() != null) doc.setSpecialtyId(doctorDetails.getSpecialtyId());
            if (doctorDetails.getRoomNumber() != null) doc.setRoomNumber(doctorDetails.getRoomNumber());
            if (doctorDetails.getConsultationFee() != null) doc.setConsultationFee(doctorDetails.getConsultationFee());
            if (doctorDetails.getBio() != null) doc.setBio(doctorDetails.getBio());
            if (doctorDetails.getAvatarUrl() != null) doc.setAvatarUrl(doctorDetails.getAvatarUrl());
            
            return ResponseEntity.ok(Map.of("message", "Cập nhật hồ sơ Bác sĩ thành công!", "data", doctorRepository.save(doc)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa hồ sơ Bác sĩ thành công!"));
    }

    // ==========================================
    // 4. QUẢN LÝ BỆNH NHÂN (PATIENTS)
    // ==========================================
    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dob,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Patient> patientPage = patientRepository.searchPatients(search, gender, dob, pageable);

        return buildPaginatedResponse(patientPage, patientPage.getContent());
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<?> getPatientDetails(@PathVariable Long id) {
        return patientRepository.findById(id).map(patient -> {
            Map<String, Object> details = new HashMap<>();
            details.put("profile", patient);
            
            // Lấy lịch sử khám bệnh
            List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
            details.put("appointmentHistory", appointments);

            // Lấy thông tin tài khoản user
            if (patient.getUserId() != null) {
                userRepository.findById(patient.getUserId()).ifPresent(user -> details.put("accountInfo", user));
            }

            return ResponseEntity.ok(Map.of("data", details));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/patients")
    public ResponseEntity<?> createPatientByAdmin(@RequestBody Patient patient) {
        // Admin có thể tạo hồ sơ cho một user đã có hoặc tạo mới hoàn toàn (userId = null)
        return ResponseEntity.ok(Map.of("message", "Tạo hồ sơ bệnh nhân thành công!", "data", patientRepository.save(patient)));
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<?> updatePatientByAdmin(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id).map(patient -> {
            if (patientDetails.getFullName() != null) patient.setFullName(patientDetails.getFullName());
            if (patientDetails.getDob() != null) patient.setDob(patientDetails.getDob());
            if (patientDetails.getGender() != null) patient.setGender(patientDetails.getGender());
            if (patientDetails.getAddress() != null) patient.setAddress(patientDetails.getAddress());
            if (patientDetails.getUserId() != null) patient.setUserId(patientDetails.getUserId());
            
            return ResponseEntity.ok(Map.of("message", "Cập nhật hồ sơ bệnh nhân thành công!", "data", patientRepository.save(patient)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        return patientRepository.findById(id).map(patient -> {
            patient.setDeletedAt(LocalDateTime.now());
            patientRepository.save(patient);
            return ResponseEntity.ok(Map.of("message", "Xóa (Soft Delete) bệnh nhân thành công!"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================================
    // 5. QUẢN LÝ CHUYÊN KHOA (SPECIALTIES)
    // ==========================================
    // 6. QUẢN LÝ PHÒNG KHÁM (CLINICS)
    // ==========================================
    // 10. QUẢN LÝ DỊCH VỤ (SERVICES)
    // ==========================================
    // 11. QUẢN LÝ THUỐC (MEDICINES)
    // ==========================================

    @GetMapping("/clinics")
    public ResponseEntity<?> getAllClinics() {
        return ResponseEntity.ok(Map.of("data", clinicRepository.findAll()));
    }
    @PostMapping("/clinics")
    public ResponseEntity<?> createClinic(@RequestBody Clinic clinic) {
        return ResponseEntity.ok(clinicRepository.save(clinic));
    }

    @PutMapping("/clinics/{id}")
    public ResponseEntity<?> updateClinic(@PathVariable Long id, @RequestBody Clinic clinic) {
        clinic.setId(id);
        return ResponseEntity.ok(clinicRepository.save(clinic));
    }

    @DeleteMapping("/clinics/{id}")
    public ResponseEntity<?> deleteClinic(@PathVariable Long id) {
        clinicRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa phòng khám thành công!"));
    }

    @GetMapping("/specialties")
    public ResponseEntity<?> getAllSpecialties(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Specialty> specialtyPage = specialtyRepository.searchSpecialties(search, pageable);

        List<Map<String, Object>> responseList = specialtyPage.getContent().stream().map(spec -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", spec.getId());
            map.put("name", spec.getName());
            map.put("description", spec.getDescription());
            map.put("iconUrl", spec.getIconUrl());
            
            long count = doctorRepository.findBySpecialtyId(spec.getId()).size();
            map.put("doctorCount", count);

            if (spec.getHeadDoctorId() != null) {
                doctorRepository.findById(spec.getHeadDoctorId()).ifPresent(doc -> 
                    map.put("headDoctor", Map.of("id", doc.getId(), "fullName", doc.getFullName()))
                );
            }
            return map;
        }).collect(Collectors.toList());

        return buildPaginatedResponse(specialtyPage, responseList);
    }
    @PostMapping("/specialties")
    public ResponseEntity<?> createSpecialty(@RequestBody Specialty specialty) {
        return ResponseEntity.ok(specialtyRepository.save(specialty));
    }
    
    @PutMapping("/specialties/{id}")
    public ResponseEntity<?> updateSpecialty(@PathVariable Long id, @RequestBody Specialty specialty) {
        specialty.setId(id);
        return ResponseEntity.ok(specialtyRepository.save(specialty));
    }

    @DeleteMapping("/specialties/{id}")
    public ResponseEntity<?> deleteSpecialty(@PathVariable Long id) {
        specialtyRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa chuyên khoa thành công!"));
    }

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ClinicService> servicePage = clinicServiceRepository.searchServices(search, pageable);

        return buildPaginatedResponse(servicePage, servicePage.getContent());
    }
    
    @GetMapping("/specialties/{specialtyId}/services")
    public ResponseEntity<?> getServicesBySpecialty(@PathVariable Long specialtyId) {
        return ResponseEntity.ok(clinicServiceRepository.findBySpecialtyId(specialtyId));
    }

    @PostMapping("/services")
    public ResponseEntity<?> createService(@RequestBody ClinicService service) {
        return ResponseEntity.ok(clinicServiceRepository.save(service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ClinicService service) {
        service.setId(id);
        return ResponseEntity.ok(clinicServiceRepository.save(service));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        clinicServiceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa dịch vụ thành công!"));
    }

    @GetMapping("/medicines")
    public ResponseEntity<?> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String unit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> medicinePage = medicineRepository.searchMedicines(search, unit, pageable);

        return buildPaginatedResponse(medicinePage, medicinePage.getContent());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        medicine.setId(id);
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thuốc thành công!"));
    }

    @PatchMapping("/medicines/{id}/import")
    public ResponseEntity<?> importMedicineStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return medicineRepository.findById(id).map(medicine -> {
            Integer quantityToAdd = body.get("quantity");
            if (quantityToAdd == null || quantityToAdd <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Số lượng nhập kho phải lớn hơn 0"));
            }
            int currentStock = medicine.getStockQuantity() == null ? 0 : medicine.getStockQuantity();
            medicine.setStockQuantity(currentStock + quantityToAdd);
            medicineRepository.save(medicine);
            return ResponseEntity.ok(Map.of("message", "Nhập kho thành công!", "data", medicine));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/medicines/export")
    public ResponseEntity<byte[]> exportMedicines() {
        List<Medicine> medicines = medicineRepository.findAll();
        StringBuilder csvBuilder = new StringBuilder();
        // Thêm Byte Order Mark (BOM) để Excel hiển thị đúng tiếng Việt UTF-8
        csvBuilder.append('\ufeff');
        csvBuilder.append("ID,Tên thuốc,Đơn vị tính,Giá (VND),Số lượng tồn kho,Cách dùng\n");
        for (Medicine m : medicines) {
            csvBuilder.append(m.getId()).append(",")
                      .append(m.getName() != null ? m.getName().replace(",", " ") : "").append(",")
                      .append(m.getUnit() != null ? m.getUnit() : "").append(",")
                      .append(m.getPrice() != null ? m.getPrice() : 0).append(",")
                      .append(m.getStockQuantity() != null ? m.getStockQuantity() : 0).append(",")
                      .append(m.getUsage() != null ? m.getUsage().replace(",", " ") : "").append("\n");
        }
        byte[] csvBytes = csvBuilder.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medicines_export.csv")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(csvBytes);
    }

    // ==========================================
    // 7. QUẢN LÝ LỊCH HẸN (APPOINTMENTS) & 8. KHUNG GIỜ
    // ==========================================
    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long specialtyId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Appointment> appointmentPage = appointmentRepository.searchAppointments(date, doctorId, specialtyId, status, pageable);

        List<Map<String, Object>> responseList = appointmentPage.getContent().stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("appointmentDate", app.getAppointmentDate());
            map.put("status", app.getStatus());
            map.put("queueNumber", app.getQueueNumber());
            
            patientRepository.findById(app.getPatientId()).ifPresent(p -> map.put("patient", Map.of("id", p.getId(), "fullName", p.getFullName())));
            doctorRepository.findById(app.getDoctorId()).ifPresent(d -> map.put("doctor", Map.of("id", d.getId(), "fullName", d.getFullName())));

            return map;
        }).collect(Collectors.toList());

        return buildPaginatedResponse(appointmentPage, responseList);
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<?> getAppointmentDetails(@PathVariable Long id) {
        return appointmentRepository.findById(id).map(app -> {
            Map<String, Object> details = new HashMap<>();
            details.put("id", app.getId());
            details.put("appointmentDate", app.getAppointmentDate());
            details.put("status", app.getStatus());
            details.put("queueNumber", app.getQueueNumber());
            details.put("symptoms", app.getSymptoms());
            details.put("cancelReason", app.getCancelReason());
            details.put("parentAppointmentId", app.getParentAppointmentId());

            patientRepository.findById(app.getPatientId()).ifPresent(p -> details.put("patient", p));
            doctorRepository.findById(app.getDoctorId()).ifPresent(d -> details.put("doctor", d));
            if (app.getScheduleId() != null) scheduleRepository.findById(app.getScheduleId()).ifPresent(s -> details.put("schedule", s));

            // Lấy danh sách lịch tái khám (nếu có)
            List<Appointment> followUps = appointmentRepository.findByParentAppointmentId(app.getId());
            details.put("followUpAppointments", followUps);

            return ResponseEntity.ok(Map.of("data", details));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return appointmentRepository.findById(id).map(app -> {
            app.setStatus(body.get("status"));
            if (body.containsKey("cancelReason")) app.setCancelReason(body.get("cancelReason"));
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công!", "data", appointmentRepository.save(app)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================================
    // 8. QUẢN LÝ KHUNG GIỜ (SCHEDULES / TIME SLOTS)
    // ==========================================
    @GetMapping("/schedules")
    public ResponseEntity<?> getAllSchedules(
            @RequestParam(required = false) Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Schedule> schedules;
        if (doctorId != null) {
            schedules = scheduleRepository.findByDoctorIdAndWorkDateBetweenOrderByWorkDateAscStartTimeAsc(doctorId, startDate, endDate);
        } else {
            schedules = scheduleRepository.findByWorkDateBetweenOrderByWorkDateAscStartTimeAsc(startDate, endDate);
        }

        List<Map<String, Object>> response = schedules.stream().map(schedule -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", schedule.getId());
            map.put("doctorId", schedule.getDoctorId());
            map.put("workDate", schedule.getWorkDate());
            map.put("startTime", schedule.getStartTime());
            map.put("endTime", schedule.getEndTime());
            map.put("isAvailable", schedule.getIsAvailable());
            
            doctorRepository.findById(schedule.getDoctorId()).ifPresent(d -> map.put("doctorName", d.getFullName()));
            
            Optional<Appointment> appointment = appointmentRepository.findByScheduleId(schedule.getId());
            if (appointment.isPresent()) {
                map.put("status", "BOOKED");
                map.put("appointmentId", appointment.get().getId());
                patientRepository.findById(appointment.get().getPatientId()).ifPresent(p -> map.put("patientName", p.getFullName()));
            } else {
                map.put("status", schedule.getIsAvailable() ? "AVAILABLE" : "BLOCKED");
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("data", response));
    }

    @PatchMapping("/schedules/{id}/toggle-block")
    public ResponseEntity<?> toggleScheduleBlockStatus(@PathVariable Long id) {
        return scheduleRepository.findById(id).map(schedule -> {
            schedule.setIsAvailable(!schedule.getIsAvailable());
            scheduleRepository.save(schedule);
            String status = schedule.getIsAvailable() ? "AVAILABLE" : "BLOCKED";
            return ResponseEntity.ok(Map.of("message", "Trạng thái khung giờ chuyển thành: " + status, "isAvailable", schedule.getIsAvailable()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================================
    // 9. QUẢN LÝ HỒ SƠ BỆNH ÁN (MEDICAL RECORDS) - Read only
    // ==========================================
    @GetMapping("/medical-records")
    public ResponseEntity<?> getAllMedicalRecords(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicalRecord> recordPage = medicalRecordRepository.searchMedicalRecords(doctorId, patientId, date, pageable);

        List<Map<String, Object>> responseList = recordPage.getContent().stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", record.getId());
            map.put("diagnosis", record.getDiagnosis());
            appointmentRepository.findById(record.getAppointmentId()).ifPresent(app -> {
                map.put("appointmentDate", app.getAppointmentDate());
                patientRepository.findById(app.getPatientId()).ifPresent(p -> map.put("patientName", p.getFullName()));
                doctorRepository.findById(app.getDoctorId()).ifPresent(d -> map.put("doctorName", d.getFullName()));
            });
            return map;
        }).collect(Collectors.toList());

        return buildPaginatedResponse(recordPage, responseList);
    }

    @GetMapping("/medical-records/{id}")
    public ResponseEntity<?> getMedicalRecordDetails(@PathVariable Long id) {
        return medicalRecordRepository.findById(id).map(record -> {
            Map<String, Object> details = new HashMap<>();
            details.put("record", record);

            // Kéo thông tin bệnh nhân và bác sĩ từ Appointment
            appointmentRepository.findById(record.getAppointmentId()).ifPresent(app -> {
                details.put("appointment", app);
                patientRepository.findById(app.getPatientId()).ifPresent(p -> details.put("patient", p));
                doctorRepository.findById(app.getDoctorId()).ifPresent(d -> details.put("doctor", d));
            });

            // Kéo đơn thuốc và chi tiết thuốc
            List<Map<String, Object>> prescriptionsList = prescriptionRepository.findByMedicalRecordId(record.getId()).stream().map(pres -> {
                Map<String, Object> presMap = new HashMap<>();
                presMap.put("prescription", pres);
                presMap.put("items", prescriptionItemRepository.findByPrescriptionId(pres.getId()));
                return presMap;
            }).collect(Collectors.toList());
            details.put("prescriptions", prescriptionsList);

            // Kéo kết quả xét nghiệm / dịch vụ
            List<ServiceOrder> serviceOrders = serviceOrderRepository.findByMedicalRecordId(record.getId());
            details.put("serviceOrders", serviceOrders);

            return ResponseEntity.ok(Map.of("data", details));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================================
    // 12. QUẢN LÝ HÓA ĐƠN (INVOICES)
    // ==========================================
    @GetMapping("/invoices")
    public ResponseEntity<?> getAllInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Invoice> invoicePage = invoiceRepository.searchInvoices(status, paymentMethod, doctorId, date, pageable);

        List<Map<String, Object>> responseList = invoicePage.getContent().stream().map(invoice -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", invoice.getId());
            map.put("totalAmount", invoice.getTotalAmount());
            map.put("status", invoice.getStatus());
            map.put("paymentMethod", invoice.getPaymentMethod());
            map.put("createdAt", invoice.getCreatedAt());
            
            appointmentRepository.findById(invoice.getAppointmentId()).ifPresent(app -> {
                map.put("appointmentDate", app.getAppointmentDate());
                doctorRepository.findById(app.getDoctorId()).ifPresent(d -> map.put("doctorName", d.getFullName()));
                patientRepository.findById(app.getPatientId()).ifPresent(p -> map.put("patientName", p.getFullName()));
            });
            return map;
        }).collect(Collectors.toList());

        return buildPaginatedResponse(invoicePage, responseList);
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<?> getInvoiceDetails(@PathVariable Long id) {
        return invoiceRepository.findById(id).map(invoice -> {
            Map<String, Object> details = new HashMap<>();
            details.put("invoice", invoice); // Bao gồm phí khám, dịch vụ, thuốc
            appointmentRepository.findById(invoice.getAppointmentId()).ifPresent(app -> {
                details.put("appointment", app);
                doctorRepository.findById(app.getDoctorId()).ifPresent(d -> details.put("doctor", d));
                patientRepository.findById(app.getPatientId()).ifPresent(p -> details.put("patient", p));
            });
            return ResponseEntity.ok(Map.of("data", details));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/invoices/{id}/status")
    public ResponseEntity<?> updateInvoiceStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setStatus(body.get("status")); // PAID, UNPAID
            return ResponseEntity.ok(Map.of("message", "Cập nhật thanh toán thành công!", "data", invoiceRepository.save(invoice)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/invoices/{id}/export-pdf")
    public ResponseEntity<byte[]> exportInvoicePdf(@PathVariable Long id) {
        // Tạm thời trả về dạng Text đóng giả PDF vì Java cần thư viện ngoài (như iTextPDF / JasperReports) để render PDF thực thụ
        String mockPdfContent = "--- HOA DON THANH TOAN ---\nMa hoa don: " + id + "\nTrang thai: Da xuat ban PDF mock.";
        byte[] bytes = mockPdfContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + id + ".txt")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/plain; charset=UTF-8")
                .body(bytes);
    }

    // ==========================================
    // 13. QUẢN LÝ ĐÁNH GIÁ (REVIEWS)
    // ==========================================
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.searchReviews(doctorId, rating, pageable);

        List<Map<String, Object>> responseList = reviewPage.getContent().stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("rating", review.getRating());
            map.put("comment", review.getComment());
            map.put("createdAt", review.getCreatedAt());
            
            doctorRepository.findById(review.getDoctorId()).ifPresent(d -> map.put("doctorName", d.getFullName()));
            patientRepository.findById(review.getPatientId()).ifPresent(p -> map.put("patientName", p.getFullName()));
            return map;
        }).collect(Collectors.toList());

        return buildPaginatedResponse(reviewPage, responseList);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa đánh giá vi phạm!"));
    }

    @GetMapping("/doctors/{doctorId}/average-rating")
    public ResponseEntity<?> getDoctorAverageRating(@PathVariable Long doctorId) {
        Double avgRating = reviewRepository.getAverageRatingByDoctorId(doctorId);
        return ResponseEntity.ok(Map.of("data", Map.of("doctorId", doctorId, "averageRating", avgRating != null ? avgRating : 0.0)));
    }

    // ==========================================
    // 14. PHÂN QUYỀN (ROLES)
    // ==========================================
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(Map.of("data", roleRepository.findAll()));
    }

    // ==========================================
    // 14. PHÂN QUYỀN & 15. BÁO CÁO
    // ==========================================
    @GetMapping("/reports/revenue")
    public ResponseEntity<?> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Invoice> invoices = invoiceRepository.findByStatusAndCreatedAtBetween("PAID", startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        
        // Nhóm doanh thu theo từng ngày
        Map<LocalDate, BigDecimal> dailyRevenue = invoices.stream()
            .collect(Collectors.groupingBy(
                i -> i.getCreatedAt().toLocalDate(),
                Collectors.reducing(BigDecimal.ZERO, Invoice::getTotalAmount, BigDecimal::add)
            ));
        
        List<Map<String, Object>> response = dailyRevenue.entrySet().stream()
            .map(e -> Map.<String, Object>of("date", e.getKey().toString(), "revenue", e.getValue()))
            .sorted(Comparator.comparing(m -> (String) m.get("date")))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", response));
    }

    @GetMapping("/reports/appointments")
    public ResponseEntity<?> getAppointmentsReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateBetween(startDate, endDate);
        
        long total = appointments.size();
        long cancelled = appointments.stream().filter(a -> "CANCELLED".equals(a.getStatus())).count();
        double cancelRate = total == 0 ? 0 : (double) cancelled / total * 100;
        
        // Nhóm số lượng lịch hẹn theo Bác sĩ
        Map<Long, Long> byDoctor = appointments.stream()
            .collect(Collectors.groupingBy(Appointment::getDoctorId, Collectors.counting()));
            
        List<Map<String, Object>> doctorStats = byDoctor.entrySet().stream().map(e -> {
            String docName = doctorRepository.findById(e.getKey()).map(Doctor::getFullName).orElse("Unknown");
            return Map.<String, Object>of("doctorId", e.getKey(), "doctorName", docName, "count", e.getValue());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "totalAppointments", total,
                "cancelledAppointments", cancelled,
                "cancelRate", cancelRate,
                "byDoctor", doctorStats
            )
        ));
    }

    @GetMapping("/reports/top-services")
    public ResponseEntity<?> getTopServices() {
        // Lấy top 5 dịch vụ được chỉ định nhiều nhất
        List<Object[]> top = serviceOrderRepository.getTopServices(PageRequest.of(0, 5));
        List<Map<String, Object>> response = top.stream().map(obj -> {
            Long serviceId = (Long) obj[0];
            Long count = (Long) obj[1];
            String serviceName = clinicServiceRepository.findById(serviceId).map(ClinicService::getName).orElse("Unknown");
        return Map.<String, Object>of("serviceId", serviceId, "serviceName", serviceName, "usageCount", count);
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", response));
    }

    @GetMapping("/reports/top-medicines")
    public ResponseEntity<?> getTopMedicines() {
        // Lấy top 5 loại thuốc xuất kho nhiều nhất
        List<Object[]> top = prescriptionItemRepository.getTopMedicines(PageRequest.of(0, 5));
        List<Map<String, Object>> response = top.stream().map(obj -> {
            Long medicineId = (Long) obj[0];
            Long totalQty = (Long) obj[1];
            String medName = medicineRepository.findById(medicineId).map(Medicine::getName).orElse("Unknown");
        return Map.<String, Object>of("medicineId", medicineId, "medicineName", medName, "totalDispensed", totalQty);
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", response));
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================
    private ResponseEntity<?> buildPaginatedResponse(Page<?> page, Object data) {
        return ResponseEntity.ok(Map.of(
            "data", data,
            "currentPage", page.getNumber(),
            "totalItems", page.getTotalElements(),
            "totalPages", page.getTotalPages()
        ));
    }
}