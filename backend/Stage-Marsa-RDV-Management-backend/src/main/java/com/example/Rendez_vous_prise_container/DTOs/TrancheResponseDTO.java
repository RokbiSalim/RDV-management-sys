package com.example.Rendez_vous_prise_container.DTOs;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class TrancheResponseDTO {

    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private int quota;
}

