package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.BlockageTranche;
import com.example.Rendez_vous_prise_container.Entities.Tranche;
import com.example.Rendez_vous_prise_container.Repositories.TrancheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BlockageTrancheMapper {

    private final TrancheRepository trancheRepository;

    public BlockageTranche toEntity(BlockageTrancheRequestDTO dto) {

        Tranche tranche = trancheRepository.findById(dto.getTrancheId())
                .orElseThrow(() -> new RuntimeException("Tranche not found"));

        BlockageTranche block = new BlockageTranche();
        block.setDate(dto.getDate());
        block.setReason(dto.getReason());
        block.setActive(true);
        block.setTranche(tranche);

        return block;
    }

    public BlockageTrancheResponseDTO toDTO(BlockageTranche block) {

        return BlockageTrancheResponseDTO.builder()
                .id(block.getId())
                .date(block.getDate())
                .active(block.isActive())
                .reason(block.getReason())
                .trancheTime(
                        block.getTranche().getStartTime() +
                                " - " +
                                block.getTranche().getEndTime()
                )
                .build();
    }
}
