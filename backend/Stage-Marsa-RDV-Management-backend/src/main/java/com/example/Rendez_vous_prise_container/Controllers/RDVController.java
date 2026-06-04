package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.RDVRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.RDVResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.RDVMapper;
import com.example.Rendez_vous_prise_container.Services.RDVService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rdvs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RDVController {
    private final RDVService rdvService;
    private final RDVMapper rdvMapper;

    @PostMapping
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS')")
    public RDVResponseDTO create(@Valid @RequestBody RDVRequestDTO dto) {
        return rdvMapper.toDTO(rdvService.createRDV(dto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS')")
    public RDVResponseDTO update(@PathVariable Long id,
                                 @Valid @RequestBody RDVRequestDTO dto) {
        return rdvMapper.toDTO(rdvService.updateRDV(id, dto));
    }

    @PutMapping("/{id}/confirm")
   // @PreAuthorize("hasRole('ADMIN_PORT')")
    public RDVResponseDTO confirm(@PathVariable Long id) {
        return rdvMapper.toDTO(rdvService.confirmRDV(id));
    }

    @PutMapping("/{id}/cancel")
    //@PreAuthorize("hasRole('ADMIN_PORT')")
    public RDVResponseDTO cancel(@PathVariable Long id) {
        return rdvMapper.toDTO(rdvService.cancelRDV(id));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS')")
    public void delete(@PathVariable Long id) {
        rdvService.deleteRDV(id);
    }

    @GetMapping
   // @PreAuthorize("hasRole('RESPONSABLE_TRANSPORTEURS','ADMIN_PORT')")
    public List<RDVResponseDTO> getAll() {
        return rdvService.getAllRDVs()
                .stream()
                .map(rdvMapper::toDTO)
                .toList();
    }
}
