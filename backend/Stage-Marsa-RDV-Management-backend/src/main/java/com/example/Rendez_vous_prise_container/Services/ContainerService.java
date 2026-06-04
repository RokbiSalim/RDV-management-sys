package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.ContainerRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Container;

import java.util.List;

public interface ContainerService {
    Container create(ContainerRequestDTO dto);

    List<Container> getAll();
}
