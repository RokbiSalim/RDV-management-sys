package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContainerRequestDTO {

    @NotBlank
    private String reference;

    @NotNull
    private Long clientId;
}
