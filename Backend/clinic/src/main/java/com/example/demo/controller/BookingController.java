package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.Appointment;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public BookingController(AppointmentRepository appointmentRepository, ScheduleRepository scheduleRepository, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    private Long getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    // Đặt lịch khám
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody BookingRequest request) {
        // Kiểm tra slot còn trống không
        return scheduleRepository.findById(request.getScheduleId()).map(schedule -> {
            if (!Boolean.TRUE.equals(schedule.getIsAvailable())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Slot này đã được đặt, vui lòng chọn slot khác!"));
            }

            // Kiểm tra hồ sơ bệnh nhân thuộc tài khoản đang đăng nhập
            return patientRepository.findById(request.getPatientId()).map(patient -> {
                if (!patient.getUserId().equals(getCurrentUserId())) {
                    return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền dùng hồ sơ này!"));
                }

                // Tạo lịch hẹn
                Appointment appointment = new Appointment();
                appointment.setPatientId(request.getPatientId());
                appointment.setDoctorId(request.getDoctorId());
                appointment.setScheduleId(request.getScheduleId());
                appointment.setAppointmentDate(schedule.getWorkDate());
                appointment.setSymptoms(request.getSymptoms());
                appointment.setStatus("PENDING");

                appointmentRepository.save(appointment);

                // Đánh dấu slot đã được đặt
                schedule.setIsAvailable(false);
                scheduleRepository.save(schedule);

                return ResponseEntity.ok(Map.of("message", "Đặt lịch thành công!", "appointmentId", appointment.getId()));
            }).orElseGet(() -> ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy hồ sơ bệnh nhân!")));
        }).orElseGet(() -> ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy slot khám!")));
    }

    // Lấy danh sách lịch hẹn của bệnh nhân đang đăng nhập
    @GetMapping
    public ResponseEntity<?> getMyAppointments() {
        List<Long> patientIds = patientRepository.findAllByUserId(getCurrentUserId())
                .stream().map(p -> p.getId()).toList();

        List<Map<String, Object>> result = new ArrayList<>();

        patientIds.forEach(pid -> appointmentRepository.findByPatientId(pid).forEach(appointment -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", appointment.getId());
            map.put("appointmentDate", appointment.getAppointmentDate());
            map.put("status", appointment.getStatus());
            map.put("symptoms", appointment.getSymptoms());
            map.put("cancelReason", appointment.getCancelReason());

            // Thông tin hồ sơ bệnh nhân
            patientRepository.findById(appointment.getPatientId()).ifPresent(p ->
                map.put("patient", Map.of("id", p.getId(), "fullName", p.getFullName(), "isOwner", p.getIsOwner() != null && p.getIsOwner()))
            );

            // Thông tin bác sĩ
            doctorRepository.findById(appointment.getDoctorId()).ifPresent(d ->
                map.put("doctor", Map.of("id", d.getId(), "fullName", d.getFullName(), "avatarUrl", d.getAvatarUrl() != null ? d.getAvatarUrl() : "", "specialtyId", d.getSpecialtyId() != null ? d.getSpecialtyId() : 0))
            );

            // Thông tin slot giờ khám
            if (appointment.getScheduleId() != null) {
                scheduleRepository.findById(appointment.getScheduleId()).ifPresent(s ->
                    map.put("schedule", Map.of("startTime", s.getStartTime(), "endTime", s.getEndTime()))
                );
            }

            result.add(map);
        }));

        return ResponseEntity.ok(result);
    }

    // Hủy lịch hẹn
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return appointmentRepository.findById(id).map(appointment -> {
            if (!"PENDING".equals(appointment.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Chỉ có thể hủy lịch đang ở trạng thái chờ khám!"));
            }

            appointment.setStatus("CANCELLED");
            if (body != null && body.containsKey("cancelReason")) {
                appointment.setCancelReason(body.get("cancelReason"));
            }
            appointmentRepository.save(appointment);

            // Trả lại slot
            if (appointment.getScheduleId() != null) {
                scheduleRepository.findById(appointment.getScheduleId()).ifPresent(schedule -> {
                    schedule.setIsAvailable(true);
                    scheduleRepository.save(schedule);
                });
            }

            return ResponseEntity.ok(Map.of("message", "Hủy lịch thành công!"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
