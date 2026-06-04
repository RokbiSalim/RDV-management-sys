package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.RDVResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.RDV;
import org.springframework.stereotype.Component;

@Component
public class RDVMapper {
    public RDVResponseDTO toDTO(RDV rdv) {
        return RDVResponseDTO.builder()
                .id(rdv.getId())
                .cin(rdv.getCin())
                .transporterName(rdv.getTransporterName())
                .truckPlate(rdv.getTruckPlate())
                .date(rdv.getDate())
                .statut(rdv.getStatut())
                .trancheTime(
                        rdv.getTranche().getStartTime() +
                                " - " +
                                rdv.getTranche().getEndTime()
                )
                .containerReference(rdv.getContainer().getReference())
                .clientName(rdv.getClient().getName())
                .createdById(rdv.getCreatedBy() != null ? rdv.getCreatedBy().getId() : null)
                .qrCode(rdv.getQrCode())
                .build();
    }
}
