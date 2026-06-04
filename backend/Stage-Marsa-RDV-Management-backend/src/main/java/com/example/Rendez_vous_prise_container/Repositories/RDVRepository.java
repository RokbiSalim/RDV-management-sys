package com.example.Rendez_vous_prise_container.Repositories;

import com.example.Rendez_vous_prise_container.Entities.RDV;
import com.example.Rendez_vous_prise_container.Entities.StatutRDV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface RDVRepository extends JpaRepository<RDV,Long> {
    long countByDateAndTrancheId(LocalDate date, Long trancheId);
    List<RDV> findByCreatedById(Long userId);
}
