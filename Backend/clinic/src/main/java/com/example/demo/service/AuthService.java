package com.example.demo.service;

import com.example.demo.dto.FirebaseAuthRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.Patient;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;

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
        patient.setIsOwner(true);
        patientRepository.save(patient);

        return savedUser;
    }

    @Transactional
    public User authenticateWithFirebase(FirebaseAuthRequest request) throws Exception {
        // 1. Xác thực token với Firebase Admin SDK
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getToken());
        String email = decodedToken.getEmail();
        
        if (email == null) {
            throw new IllegalArgumentException("Token Firebase không chứa email hợp lệ!");
        }

        // 2. Kiểm tra user trong Database, nếu chưa có thì tự động tạo mới
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(email); // Dùng email làm username
            newUser.setEmail(email);
            newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString())); // Password không còn dùng nữa do Firebase quản lý
            
            Role patientRole = roleRepository.findByRoleName("ROLE_PATIENT")
                    .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Không tìm thấy quyền ROLE_PATIENT!"));
            newUser.getRoles().add(patientRole);
            User savedUser = userRepository.save(newUser);

            Patient patient = new Patient();
            patient.setUserId(savedUser.getId());
            patient.setFullName(request.getFullName() != null ? request.getFullName() : "Bệnh nhân mới");
            patient.setIsOwner(true);
            patientRepository.save(patient);

            return savedUser;
        });
    }
}