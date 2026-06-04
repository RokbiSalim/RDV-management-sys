package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.UtilisateurRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.UtilisateurResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.UtilisateurMapper;
import com.example.Rendez_vous_prise_container.Services.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService service;
    private final UtilisateurMapper mapper;

    @PostMapping
    public UtilisateurResponseDTO create(@Valid @RequestBody UtilisateurRequestDTO dto) {
        return mapper.toDTO(service.create(dto));
    }

    @GetMapping
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public List<UtilisateurResponseDTO> getAll() {
        return service.getAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}
