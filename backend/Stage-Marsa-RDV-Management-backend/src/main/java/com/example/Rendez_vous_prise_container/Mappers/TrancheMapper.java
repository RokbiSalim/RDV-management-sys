package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.TrancheRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.TrancheResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.Tranche;
import org.springframework.stereotype.Component;

@Component
public class TrancheMapper {

    public Tranche toEntity(TrancheRequestDTO dto) {
        return new Tranche(null, dto.getStartTime(), dto.getEndTime(), dto.getQuota());
    }

    public TrancheResponseDTO toDTO(Tranche tranche) {
        return TrancheResponseDTO.builder()
                .id(tranche.getId())
                .startTime(tranche.getStartTime())
                .endTime(tranche.getEndTime())
                .quota(tranche.getQuota())
                .build();
    }
}
