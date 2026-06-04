package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.ClientRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Client;

import java.util.List;

public interface ClientService {
    Client create(ClientRequestDTO dto);

    List<Client> getAll();

    void delete(Long id);
}
