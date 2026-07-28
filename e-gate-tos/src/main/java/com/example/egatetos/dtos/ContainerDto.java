package com.example.egatetos.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContainerDto {

    private Long id;

    @NotBlank
    @Size(max = 30)
    private String containerNumber;

    @Size(max = 20)
    private String isoCode;

    @Size(max = 255)
    private String description;

    private boolean readyForPickup;

    @Size(max = 50)
    private String status;

    private Long transporterId;

    @Size(max = 80)
    private String appointmentNumber;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
