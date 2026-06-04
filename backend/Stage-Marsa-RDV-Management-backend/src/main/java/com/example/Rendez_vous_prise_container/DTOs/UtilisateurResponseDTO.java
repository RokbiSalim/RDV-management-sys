package com.example.Rendez_vous_prise_container.DTOs;

import com.example.Rendez_vous_prise_container.Entities.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UtilisateurResponseDTO {

    private Long id;
    private String username;
    private Role role;
    private String clientName;
}