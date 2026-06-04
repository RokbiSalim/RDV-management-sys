package com.example.Rendez_vous_prise_container.Repositories;

import com.example.Rendez_vous_prise_container.Entities.BlockageTranche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BlockageTrancheRepository extends JpaRepository<BlockageTranche, Long> {

    Optional<BlockageTranche> findByDateAndTrancheIdAndActiveTrue(LocalDate date, Long trancheId);

}