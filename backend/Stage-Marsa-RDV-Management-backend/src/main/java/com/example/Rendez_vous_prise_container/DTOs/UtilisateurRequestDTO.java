package com.example.Rendez_vous_prise_container.DTOs;

import com.example.Rendez_vous_prise_container.Entities.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UtilisateurRequestDTO {
    @NotBlank
    private String username;

    @NotNull
    private Role role;

    private Long clientId;
}
