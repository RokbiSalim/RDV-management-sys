package com.example.Rendez_vous_prise_container.Mappers;

import com.example.Rendez_vous_prise_container.DTOs.ClientRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.ClientResponseDTO;
import com.example.Rendez_vous_prise_container.Entities.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public Client toEntity(ClientRequestDTO dto) {
        Client client = new Client();
        client.setName(dto.getName());
        client.setAddress(dto.getAddress());
        client.setPhone(dto.getPhone());
        return client;
    }

    public ClientResponseDTO toDTO(Client client) {
        return ClientResponseDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .address(client.getAddress())
                .phone(client.getPhone())
                .build();
    }
}
