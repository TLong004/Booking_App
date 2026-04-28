package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByRoleName("ROLE_PATIENT").isEmpty()) {
            Role patientRole = new Role();
            patientRole.setRoleName("ROLE_PATIENT");
            patientRole.setDescription("Bệnh nhân");
            roleRepository.save(patientRole);
        }
        
        if (roleRepository.findByRoleName("ROLE_DOCTOR").isEmpty()) {
            Role doctorRole = new Role();
            doctorRole.setRoleName("ROLE_DOCTOR");
            doctorRole.setDescription("Bác sĩ");
            roleRepository.save(doctorRole);
        }

        if (roleRepository.findByRoleName("ROLE_STAFF").isEmpty()) {
            Role staffRole = new Role();
            staffRole.setRoleName("ROLE_STAFF");
            staffRole.setDescription("Lễ tân - Điều phối & Thu ngân");
            roleRepository.save(staffRole);
        }

        if (roleRepository.findByRoleName("ROLE_HEAD_DEPT").isEmpty()) {
            Role headDeptRole = new Role();
            headDeptRole.setRoleName("ROLE_HEAD_DEPT");
            headDeptRole.setDescription("Trưởng khoa - Quản lý lịch trực");
            roleRepository.save(headDeptRole);
        }

        if (roleRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            adminRole.setDescription("Quản trị hệ thống");
            roleRepository.save(adminRole);
        }

        // Tạo tài khoản Admin mặc định nếu chưa tồn tại
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setPhone("0000000000");
            Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN").get();
            admin.getRoles().add(adminRole);
            userRepository.save(admin);
        }
    }
}