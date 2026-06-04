package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.BlockageTranche;
import com.example.Rendez_vous_prise_container.Entities.Tranche;
import com.example.Rendez_vous_prise_container.Mappers.BlockageTrancheMapper;
import com.example.Rendez_vous_prise_container.Repositories.BlockageTrancheRepository;
import com.example.Rendez_vous_prise_container.Repositories.TrancheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockageTrancheServiceImpl implements BlockageTrancheService {

    private final BlockageTrancheRepository repository;
    private final BlockageTrancheMapper mapper;

    @Override
    public BlockageTranche block(BlockageTrancheRequestDTO dto) {

        BlockageTranche block = mapper.toEntity(dto);

        return repository.save(block);
    }

    @Override
    public BlockageTranche unblock(Long id) {

        BlockageTranche block = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blockage not found"));

        block.setActive(false);

        return repository.save(block);
    }

    @Override
    public List<BlockageTranche> getAll() {
        return repository.findAll();
    }

    @Override
    public boolean isBlocked(LocalDate date, Long trancheId) {
        return repository.findByDateAndTrancheIdAndActiveTrue(date, trancheId).isPresent();
    }
}
