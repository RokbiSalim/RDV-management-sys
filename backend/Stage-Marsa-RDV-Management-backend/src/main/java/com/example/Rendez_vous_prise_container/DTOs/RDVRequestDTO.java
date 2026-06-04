package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RDVRequestDTO {
    @NotBlank
    private String cin;
    @NotBlank
    private String transporterName;
    @NotBlank
    private String truckPlate;
    @NotNull
    private LocalDate date;
    @NotNull
    private Long trancheId;
    @NotNull
    private Long containerId;

    @NotNull
    private Long createdById;

}
