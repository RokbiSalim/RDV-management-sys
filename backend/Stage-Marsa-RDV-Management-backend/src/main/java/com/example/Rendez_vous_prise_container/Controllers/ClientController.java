package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.ClientRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.ClientResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.ClientMapper;
import com.example.Rendez_vous_prise_container.Services.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientService service;
    private final ClientMapper mapper;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public ClientResponseDTO create(@Valid @RequestBody ClientRequestDTO dto) {
        return mapper.toDTO(service.create(dto));
    }

    @GetMapping
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public List<ClientResponseDTO> getAll() {
        return service.getAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
