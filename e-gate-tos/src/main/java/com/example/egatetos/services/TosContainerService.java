package com.example.egatetos.services;

import com.example.egatetos.dtos.ContainerDto;
import com.example.egatetos.entities.TosContainer;
import com.example.egatetos.repositories.TosContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TosContainerService {

    private final TosContainerRepository tosContainerRepository;

    public ContainerDto createOrUpdate(ContainerDto dto) {
        TosContainer container = tosContainerRepository.findByContainerNumber(dto.getContainerNumber())
                .orElseGet(TosContainer::new);

        container.setContainerNumber(dto.getContainerNumber());
        container.setIsoCode(dto.getIsoCode());
        container.setDescription(dto.getDescription());
        container.setReadyForPickup(dto.isReadyForPickup());
        container.setStatus(dto.getStatus() == null || dto.getStatus().isBlank()
                ? (dto.isReadyForPickup() ? "READY" : "NOT_READY")
                : dto.getStatus());
        container.setTransporterId(dto.getTransporterId());
        container.setAppointmentNumber(dto.getAppointmentNumber());

        return toDto(tosContainerRepository.save(container));
    }

    public List<ContainerDto> getAll() {
        return tosContainerRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public ContainerDto getByContainerNumber(String containerNumber) {
        return tosContainerRepository.findByContainerNumber(containerNumber)
                .map(this::toDto)
                .orElseThrow(() -> new TosContainerNotFoundException("TOS container not found"));
    }

    public ContainerDto markReady(Long id) {
        TosContainer container = tosContainerRepository.findById(id)
                .orElseThrow(() -> new TosContainerNotFoundException("TOS container not found"));
        container.setReadyForPickup(true);
        container.setStatus("READY");
        return toDto(tosContainerRepository.save(container));
    }

    public ContainerDto markNotReady(Long id) {
        TosContainer container = tosContainerRepository.findById(id)
                .orElseThrow(() -> new TosContainerNotFoundException("TOS container not found"));
        container.setReadyForPickup(false);
        container.setStatus("NOT_READY");
        return toDto(tosContainerRepository.save(container));
    }

    ContainerDto toDto(TosContainer container) {
        return new ContainerDto(
                container.getId(),
                container.getContainerNumber(),
                container.getIsoCode(),
                container.getDescription(),
                container.isReadyForPickup(),
                container.getStatus(),
                container.getTransporterId(),
                container.getAppointmentNumber(),
                container.getCreatedAt(),
                container.getUpdatedAt()
        );
    }
}
