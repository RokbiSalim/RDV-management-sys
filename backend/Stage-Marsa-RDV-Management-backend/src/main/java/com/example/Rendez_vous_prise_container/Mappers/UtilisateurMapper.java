package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.UtilisateurRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.UtilisateurResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.Client;
import com.example.Rendez_vous_prise_container.Entities.Utilisateur;
import com.example.Rendez_vous_prise_container.Repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UtilisateurMapper {

    private final ClientRepository clientRepository;

    public Utilisateur toEntity(UtilisateurRequestDTO dto) {

        Utilisateur user = new Utilisateur();
        user.setUsername(dto.getUsername());
        user.setRole(dto.getRole());

        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            user.setClient(client);
        }

        return user;
    }

    public UtilisateurResponseDTO toDTO(Utilisateur user) {
        return UtilisateurResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .clientName(user.getClient() != null ? user.getClient().getName() : null)
                .build();
    }
}