package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheRequestDTO;
import com.example.Rendez_vous_prise_container.DTOs.BlockageTrancheResponseDTO;
import com.example.Rendez_vous_prise_container.Mappers.BlockageTrancheMapper;
import com.example.Rendez_vous_prise_container.Services.BlockageTrancheService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blockages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlockageTrancheController {

    private final BlockageTrancheService service;
    private final BlockageTrancheMapper mapper;

    @PostMapping
    public BlockageTrancheResponseDTO block(@Valid @RequestBody BlockageTrancheRequestDTO dto) {
        return mapper.toDTO(service.block(dto));
    }

    @PutMapping("/{id}/unblock")
    public BlockageTrancheResponseDTO unblock(@PathVariable Long id) {
        return mapper.toDTO(service.unblock(id));
    }

    @GetMapping
    public List<BlockageTrancheResponseDTO> getAll() {
        return service.getAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @GetMapping("/check")
    public Map<String, Boolean> check(
            @RequestParam LocalDate date,
            @RequestParam Long trancheId) {
        return Map.of("blocked", service.isBlocked(date, trancheId));
    }
}
