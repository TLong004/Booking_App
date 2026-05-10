package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.ClinicServiceRepository;
import com.example.demo.repository.SpecialtyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;
    private final ClinicServiceRepository clinicServiceRepository;
    private final SpecialtyRepository specialtyRepository;

    public DoctorController(DoctorRepository doctorRepository, ScheduleRepository scheduleRepository, ClinicServiceRepository clinicServiceRepository, SpecialtyRepository specialtyRepository) {
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
        this.clinicServiceRepository = clinicServiceRepository;
        this.specialtyRepository = specialtyRepository;
    }

    private void fillSpecialtyName(Doctor doctor) {
        if (doctor.getSpecialtyId() != null) {
            specialtyRepository.findById(doctor.getSpecialtyId())
                    .ifPresent(s -> doctor.setSpecialtyName(s.getName()));
        }
    }

    private List<Doctor> fillSpecialtyNames(List<Doctor> doctors) {
        doctors.forEach(this::fillSpecialtyName);
        return doctors;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return fillSpecialtyNames(doctorRepository.findAll());
    }

    // API Lấy danh sách Bác sĩ theo Chuyên khoa
    @GetMapping("/specialty/{specialtyId}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialty(@PathVariable Long specialtyId) {
        return ResponseEntity.ok(fillSpecialtyNames(doctorRepository.findBySpecialtyId(specialtyId)));
    }

    // API Lấy danh sách Bác sĩ theo Dịch vụ cụ thể (gián tiếp qua Chuyên khoa)
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Doctor>> getDoctorsByService(@PathVariable Long serviceId) {
        return clinicServiceRepository.findById(serviceId).map(service -> {
            if (service.getSpecialtyId() != null) {
                return ResponseEntity.ok(fillSpecialtyNames(doctorRepository.findBySpecialtyId(service.getSpecialtyId())));
            }
            return ResponseEntity.ok(Collections.<Doctor>emptyList());
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API Tìm kiếm Bác sĩ theo tên (Gần đúng, không phân biệt hoa thường)
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(@RequestParam("query") String query) {
        return ResponseEntity.ok(fillSpecialtyNames(doctorRepository.findByFullNameContainingIgnoreCase(query)));
    }

    // API Xem chi tiết 1 Bác sĩ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            fillSpecialtyName(doctor.get());
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

    // API Lấy danh sách dịch vụ của bác sĩ (qua chuyên khoa)
    @GetMapping("/{id}/services")
    public ResponseEntity<?> getServicesByDoctor(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isEmpty()) return ResponseEntity.notFound().build();
        if (doctor.get().getSpecialtyId() == null) return ResponseEntity.ok(Collections.emptyList());
        return ResponseEntity.ok(clinicServiceRepository.findBySpecialtyId(doctor.get().getSpecialtyId()));
    }

    // API Lấy top 5 bác sĩ nổi bật theo rating
    @GetMapping("/top-rated")
    public ResponseEntity<List<Doctor>> getTopRatedDoctors() {
        return ResponseEntity.ok(fillSpecialtyNames(doctorRepository.findTop5ByRatingNotNullOrderByRatingDesc()));
    }

    // API Lọc bác sĩ theo rating tối thiểu, sắp xếp giảm dần
    @GetMapping("/filter")
    public ResponseEntity<List<Doctor>> filterDoctorsByRating(
            @RequestParam(defaultValue = "0") Double minRating) {
        return ResponseEntity.ok(fillSpecialtyNames(doctorRepository.findByRatingGreaterThanEqualOrderByRatingDesc(minRating)));
    }

    // API Lấy tất cả time slot của bác sĩ trong 1 ngày
    @GetMapping("/{id}/schedules")
    public ResponseEntity<?> getDoctorSchedules(@PathVariable Long id, @RequestParam String date) {
        return ResponseEntity.ok(scheduleRepository.findByDoctorIdAndWorkDateOrderByStartTimeAsc(id, LocalDate.parse(date)));
    }

    // API Lấy các time slot còn trống của bác sĩ trong 1 ngày (dành cho bệnh nhân đặt lịch)
    @GetMapping("/{id}/available-slots")
    public ResponseEntity<?> getAvailableSlots(@PathVariable Long id, @RequestParam String date) {
        return ResponseEntity.ok(scheduleRepository.findByDoctorIdAndWorkDateAndIsAvailableTrueOrderByStartTimeAsc(id, LocalDate.parse(date)));
    }

    // API Lấy các ngày có slot còn trống của bác sĩ trong khoảng thời gian
    @GetMapping("/{id}/available-dates")
    public ResponseEntity<?> getAvailableDates(@PathVariable Long id,
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(scheduleRepository.findAvailableDatesByDoctorId(id, LocalDate.parse(from), LocalDate.parse(to)));
    }
}