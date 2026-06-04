package com.example.Rendez_vous_prise_container.DTOs;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BlockageTrancheResponseDTO {

    private Long id;
    private LocalDate date;
    private boolean active;
    private String reason;
    private String trancheTime;
}
