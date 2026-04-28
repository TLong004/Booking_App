package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Patient;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuthService authService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, AuthService authService, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.authService = authService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerPatient(registerRequest);
            return ResponseEntity.ok(Map.of("message", "Đăng ký tài khoản thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            Long userId = userDetails.getId();
            String fullName = "";

            if (roles.contains("ROLE_PATIENT")) {
                fullName = patientRepository.findByUserId(userId)
                        .map(Patient::getFullName)
                        .orElse("");
            } else if (roles.contains("ROLE_DOCTOR")) {
                fullName = doctorRepository.findByUserId(userId)
                        .map(Doctor::getFullName)
                        .orElse("");
            }

            return ResponseEntity.ok(new JwtResponse(jwt, userId, userDetails.getUsername(), fullName, roles));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Lỗi: Sai tên đăng nhập hoặc mật khẩu!"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("message", "Chưa đăng nhập!"));
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Object profile = null;
        if (roles.contains("ROLE_PATIENT")) {
            profile = patientRepository.findByUserId(userId).orElse(null);
        } else if (roles.contains("ROLE_DOCTOR")) {
            profile = doctorRepository.findByUserId(userId).orElse(null);
        }

        return ResponseEntity.ok(Map.of("id", userId, "username", userDetails.getUsername(), "roles", roles, "profile", profile != null ? profile : Map.of()));
    }
}