package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BlockageTrancheRequestDTO {

    @NotNull
    private LocalDate date;

    @NotNull
    private Long trancheId;

    private String reason;
}
