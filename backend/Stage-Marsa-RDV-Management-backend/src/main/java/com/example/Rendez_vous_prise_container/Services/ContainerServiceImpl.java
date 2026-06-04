package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.ContainerRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Container;
import com.example.Rendez_vous_prise_container.Mappers.ContainerMapper;
import com.example.Rendez_vous_prise_container.Repositories.ContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContainerServiceImpl implements ContainerService {
    private final ContainerRepository containerRepository;
    private final ContainerMapper containerMapper;
    @Override
    public Container create(ContainerRequestDTO dto) {
        return containerRepository.save(containerMapper.toEntity(dto));
    }

    @Override
    public List<Container> getAll() {
        return containerRepository.findAll();
    }
}
