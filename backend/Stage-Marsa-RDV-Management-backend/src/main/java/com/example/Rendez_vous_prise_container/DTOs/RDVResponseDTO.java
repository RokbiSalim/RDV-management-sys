package com.example.Rendez_vous_prise_container.DTOs;

import com.example.Rendez_vous_prise_container.Entities.StatutRDV;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RDVResponseDTO {
    private Long id;
    private String cin;
    private String transporterName;
    private String truckPlate;
    private LocalDate date;
    private StatutRDV statut;

    private String trancheTime;
    private String containerReference;
    private String clientName;
    private Long createdById;
    private String qrCode;
}
