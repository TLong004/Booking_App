package com.example.demo.service;

import com.example.demo.dto.UserCreateRequest;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;

    @Transactional
    public User createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Lỗi: Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Lỗi: Email đã tồn tại!");
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty() && userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Lỗi: Số điện thoại đã tồn tại!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone((request.getPhone() != null && !request.getPhone().trim().isEmpty()) ? request.getPhone() : null);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        Role userRole = roleRepository.findByRoleName(request.getRoleName()).orElseThrow(() -> new IllegalArgumentException("Lỗi: Quyền '" + request.getRoleName() + "' không hợp lệ."));
        user.getRoles().add(userRole);
        User savedUser = userRepository.save(user);

        if ("ROLE_DOCTOR".equals(request.getRoleName()) || "ROLE_HEAD_DEPT".equals(request.getRoleName())) {
            Doctor doctor = new Doctor();
            doctor.setUserId(savedUser.getId());
            doctor.setFullName(request.getFullName());
            doctor.setSpecialtyId(request.getSpecialtyId());
            doctor.setDegree(request.getDegree());
            doctor.setRoomNumber(request.getRoomNumber());
            if (request.getConsultationFee() != null) doctor.setConsultationFee(BigDecimal.valueOf(request.getConsultationFee()));
            doctor.setBio(request.getBio());
            doctorRepository.save(doctor);
        }
        // Thêm các case khác cho ROLE_PATIENT, ROLE_STAFF nếu cần
        return savedUser;
    }

    @Transactional
    public User updateUser(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy User"));
        
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("isActive")) user.setIsActive((Boolean) updates.get("isActive"));
        if (updates.containsKey("password") && updates.get("password") != null && !((String) updates.get("password")).isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode((String) updates.get("password")));
        }
        if (updates.containsKey("roleName")) {
            user.getRoles().clear();
            Role role = roleRepository.findByRoleName((String) updates.get("roleName")).orElseThrow();
            user.getRoles().add(role);
        }
        userRepository.save(user);

        String roleName = updates.containsKey("roleName") ? (String) updates.get("roleName") : user.getRoles().iterator().next().getRoleName();
        if ("ROLE_DOCTOR".equals(roleName) || "ROLE_HEAD_DEPT".equals(roleName)) {
            Doctor doctor = doctorRepository.findByUserId(id).orElse(new Doctor());
            doctor.setUserId(id);
            if (updates.containsKey("fullName")) doctor.setFullName((String) updates.get("fullName"));
            if (updates.containsKey("degree")) doctor.setDegree((String) updates.get("degree"));
            if (updates.containsKey("roomNumber")) doctor.setRoomNumber((String) updates.get("roomNumber"));
            if (updates.containsKey("specialtyId")) doctor.setSpecialtyId(((Number) updates.get("specialtyId")).longValue());
            if (updates.containsKey("consultationFee")) doctor.setConsultationFee(BigDecimal.valueOf(((Number) updates.get("consultationFee")).doubleValue()));
            if (updates.containsKey("bio")) doctor.setBio((String) updates.get("bio"));
            doctorRepository.save(doctor);
        }
        
        return user;
    }
}