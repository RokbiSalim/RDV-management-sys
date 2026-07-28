package com.example.egatetos.controllers;

import com.example.egatetos.dtos.ContainerDto;
import com.example.egatetos.services.TosContainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tos/containers")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class TosContainerController {

    private final TosContainerService tosContainerService;

    @PostMapping
    public ContainerDto create(@Valid @RequestBody ContainerDto dto) {
        return tosContainerService.createOrUpdate(dto);
    }

    @GetMapping
    public List<ContainerDto> getAll() {
        return tosContainerService.getAll();
    }

    @GetMapping("/number/{containerNumber}")
    public ContainerDto getByContainerNumber(@PathVariable String containerNumber) {
        return tosContainerService.getByContainerNumber(containerNumber);
    }

    @PutMapping("/{id}/ready")
    public ContainerDto markReady(@PathVariable Long id) {
        return tosContainerService.markReady(id);
    }

    @PutMapping("/{id}/not-ready")
    public ContainerDto markNotReady(@PathVariable Long id) {
        return tosContainerService.markNotReady(id);
    }
}
