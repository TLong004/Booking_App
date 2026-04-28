package com.example.demo.repository;

import com.example.demo.entity.ClinicService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClinicServiceRepository extends JpaRepository<ClinicService, Long> {
    List<ClinicService> findBySpecialtyId(Long specialtyId);
}