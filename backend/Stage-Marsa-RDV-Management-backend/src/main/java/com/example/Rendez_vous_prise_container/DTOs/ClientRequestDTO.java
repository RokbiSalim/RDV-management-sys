package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientRequestDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotBlank
    private String phone;
}
