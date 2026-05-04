package com.example.demo.repository;

import com.example.demo.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findBySpecialtyId(Long specialtyId);
    List<Doctor> findByFullNameContainingIgnoreCase(String keyword);

    @Query("SELECT d FROM Doctor d WHERE (:keyword IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:specialtyId IS NULL OR d.specialtyId = :specialtyId) AND (:degree IS NULL OR LOWER(d.degree) = LOWER(:degree))")
    Page<Doctor> searchDoctors(@Param("keyword") String keyword, @Param("specialtyId") Long specialtyId, @Param("degree") String degree, Pageable pageable);
}