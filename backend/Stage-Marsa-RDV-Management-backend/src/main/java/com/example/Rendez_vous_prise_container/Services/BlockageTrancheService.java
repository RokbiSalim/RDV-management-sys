package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.BlockageTranche;

import java.time.LocalDate;
import java.util.List;

public interface BlockageTrancheService {

    BlockageTranche block(BlockageTrancheRequestDTO dto);

    BlockageTranche unblock(Long id);

    List<BlockageTranche> getAll();

    boolean isBlocked(LocalDate date, Long trancheId);
}