package com.example.demo.repository;

import com.example.demo.entity.PrescriptionItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);

    @Query("SELECT p.medicineId, SUM(p.quantity) as totalQty FROM PrescriptionItem p GROUP BY p.medicineId ORDER BY totalQty DESC")
    List<Object[]> getTopMedicines(Pageable pageable);
}