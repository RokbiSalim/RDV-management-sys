package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.ClientRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Client;
import com.example.Rendez_vous_prise_container.Mappers.ClientMapper;
import com.example.Rendez_vous_prise_container.Repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService{
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    @Override
    public Client create(ClientRequestDTO dto) {

        return clientRepository.save(clientMapper.toEntity(dto));
    }

    @Override
    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}
