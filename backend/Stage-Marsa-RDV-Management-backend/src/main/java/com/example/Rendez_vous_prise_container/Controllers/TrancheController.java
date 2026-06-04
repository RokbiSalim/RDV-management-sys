package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.TrancheAvailabilityDTO;
import com.example.Rendez_vous_prise_container.DTOs.TrancheRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.TrancheResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.TrancheMapper;
import com.example.Rendez_vous_prise_container.Services.TrancheService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tranches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrancheController {

    private final TrancheService service;
    private final TrancheMapper mapper;

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public TrancheResponseDTO create(@Valid @RequestBody TrancheRequestDTO dto) {
        return mapper.toDTO(service.create(dto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public TrancheResponseDTO update(@PathVariable Long id,
                                     @Valid @RequestBody TrancheRequestDTO dto) {
        return mapper.toDTO(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS','ADMIN_PORT')")
    public List<TrancheResponseDTO> getAll() {
        return service.getAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS','ADMIN_PORT')")
    public TrancheResponseDTO getById(@PathVariable Long id) {
        return mapper.toDTO(service.getById(id));
    }

    @GetMapping("/availability")
    public List<TrancheAvailabilityDTO> getAvailability(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getAvailability(date);
    }
}

