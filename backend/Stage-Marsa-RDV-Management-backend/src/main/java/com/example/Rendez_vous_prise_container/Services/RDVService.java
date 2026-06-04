package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.RDVRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.RDV;

import java.util.List;

public interface RDVService {
    RDV createRDV(RDVRequestDTO dto);

    RDV updateRDV(Long id, RDVRequestDTO dto);

    void deleteRDV(Long id);

    RDV confirmRDV(Long id);

    RDV cancelRDV(Long id);

    List<RDV> getAllRDVs();
}
