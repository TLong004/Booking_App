package com.example.demo.repository;

import com.example.demo.entity.ServiceOrder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findByMedicalRecordId(Long medicalRecordId);

    @Query("SELECT s.serviceId, COUNT(s.id) as totalUsage FROM ServiceOrder s GROUP BY s.serviceId ORDER BY totalUsage DESC")
    List<Object[]> getTopServices(Pageable pageable);
}