package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.Patient;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, PatientRepository patientRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public User registerPatient(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Lỗi: Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Lỗi: Email đã được sử dụng!");
        }
        if (registerRequest.getPhone() != null && !registerRequest.getPhone().isEmpty() && userRepository.existsByPhone(registerRequest.getPhone())) {
            throw new IllegalArgumentException("Lỗi: Số điện thoại đã được sử dụng!");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPhone((registerRequest.getPhone() != null && !registerRequest.getPhone().trim().isEmpty()) ? registerRequest.getPhone() : null);
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        Role patientRole = roleRepository.findByRoleName("ROLE_PATIENT").orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy quyền ROLE_PATIENT!"));
        user.getRoles().add(patientRole);
        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUserId(savedUser.getId());
        patient.setFullName(registerRequest.getFullName());
        patientRepository.save(patient);

        return savedUser;
    }
}