package com.example.demo.repository;

import com.example.demo.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findFirstByUserIdOrderByIdAsc(Long userId); // Lấy hồ sơ mặc định (hồ sơ đầu tiên được tạo)
    List<Patient> findAllByUserId(Long userId); // Lấy danh sách tất cả hồ sơ của 1 tài khoản

    @Query("SELECT p FROM Patient p WHERE p.deletedAt IS NULL AND " +
           "(:keyword IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:dob IS NULL OR p.dob = :dob)")
    Page<Patient> searchPatients(@Param("keyword") String keyword, @Param("gender") String gender, @Param("dob") LocalDate dob, Pageable pageable);
}