package com.example.demo.repository;

import com.example.demo.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByStockQuantityLessThanEqual(Integer threshold);

    @Query("SELECT m FROM Medicine m WHERE (:keyword IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:unit IS NULL OR LOWER(m.unit) = LOWER(:unit))")
    Page<Medicine> searchMedicines(@Param("keyword") String keyword, @Param("unit") String unit, Pageable pageable);
}