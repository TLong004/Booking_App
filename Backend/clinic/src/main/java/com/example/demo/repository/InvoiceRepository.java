package com.example.demo.repository;

import com.example.demo.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'PAID' AND i.createdAt >= :startOfDay")
    BigDecimal sumTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT i FROM Invoice i JOIN Appointment a ON i.appointmentId = a.id WHERE (:status IS NULL OR i.status = :status) AND (:paymentMethod IS NULL OR i.paymentMethod = :paymentMethod) AND (:doctorId IS NULL OR a.doctorId = :doctorId) AND (CAST(:date AS date) IS NULL OR a.appointmentDate = :date)")
    Page<Invoice> searchInvoices(@Param("status") String status, @Param("paymentMethod") String paymentMethod, @Param("doctorId") Long doctorId, @Param("date") LocalDate date, Pageable pageable);

    List<Invoice> findByStatusAndCreatedAtBetween(String status, LocalDateTime start, LocalDateTime end);
}