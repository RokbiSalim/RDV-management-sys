package com.example.Rendez_vous_prise_container.DTOs;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class TrancheAvailabilityDTO {

    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private int quota;
    private long booked;
    private long remaining;
    private boolean blocked;
}
