package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.ContainerRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.ContainerResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.Client;
import com.example.Rendez_vous_prise_container.Entities.Container;
import com.example.Rendez_vous_prise_container.Repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContainerMapper {

    private final ClientRepository clientRepository;

    public Container toEntity(ContainerRequestDTO dto) {

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Container container = new Container();
        container.setReference(dto.getReference());
        container.setClient(client);

        return container;
    }

    public ContainerResponseDTO toDTO(Container container) {
        return ContainerResponseDTO.builder()
                .id(container.getId())
                .reference(container.getReference())
                .clientName(container.getClient().getName())
                .build();
    }
}

