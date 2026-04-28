package com.example.demo.service;

import com.example.demo.dto.UserCreateRequest;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.doctorRepository = doctorRepository;
    }

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
        Role userRole = roleRepository.findByRoleName(request.getRoleName()).orElseThrow(() -> new IllegalArgumentException("Lỗi: Quyền '" + request.getRoleName() + "' không hợp lệ."));
        user.getRoles().add(userRole);
        User savedUser = userRepository.save(user);

        if ("ROLE_DOCTOR".equals(request.getRoleName())) {
            Doctor doctor = new Doctor();
            doctor.setUserId(savedUser.getId());
            doctor.setFullName(request.getFullName());
            doctor.setSpecialtyId(request.getSpecialtyId());
            doctor.setDegree(request.getDegree());
            doctorRepository.save(doctor);
        }
        // Thêm các case khác cho ROLE_PATIENT, ROLE_STAFF nếu cần
        return savedUser;
    }
}