package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.ContainerRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.ContainerResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.ContainerMapper;
import com.example.Rendez_vous_prise_container.Services.ContainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/containers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContainerController {
    private final ContainerService service;
    private final ContainerMapper mapper;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public ContainerResponseDTO create(@Valid @RequestBody ContainerRequestDTO dto) {
        return mapper.toDTO(service.create(dto));
    }
    @GetMapping
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS','ADMIN_PORT')")
    public List<ContainerResponseDTO> getAll() {
        return service.getAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}
