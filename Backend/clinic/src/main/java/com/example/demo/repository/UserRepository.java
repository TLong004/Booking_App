package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.roles r WHERE u.deletedAt IS NULL AND (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:isActive IS NULL OR u.isActive = :isActive) AND (:roleName IS NULL OR r.roleName = :roleName)")
    Page<User> searchUsers(@Param("keyword") String keyword, @Param("isActive") Boolean isActive, @Param("roleName") String roleName, Pageable pageable);

    @Query("SELECT count(u) FROM User u JOIN u.roles r WHERE r.roleName = 'ROLE_PATIENT' AND u.createdAt >= :startOfDay")
    long countNewPatientsToday(@Param("startOfDay") LocalDateTime startOfDay);

    Page<User> findByDeletedAtIsNull(Pageable pageable);
}