package com.example.Rendez_vous_prise_container.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContainerDto {

    private Long id;
    private String containerNumber;
    private String isoCode;
    private String description;
    private boolean readyForPickup;
    private String status;
    private Long transporterId;
    private String appointmentNumber;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
