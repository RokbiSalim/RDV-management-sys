package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.TrancheAvailabilityDTO;
import com.example.Rendez_vous_prise_container.DTOs.TrancheRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Tranche;

import java.time.LocalDate;
import java.util.List;

public interface TrancheService {

    Tranche create(TrancheRequestDTO dto);

    Tranche update(Long id, TrancheRequestDTO dto);

    void delete(Long id);

    List<Tranche> getAll();

    Tranche getById(Long id);

    List<TrancheAvailabilityDTO> getAvailability(LocalDate date);
}

