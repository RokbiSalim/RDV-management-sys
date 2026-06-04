package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.TrancheAvailabilityDTO;
import com.example.Rendez_vous_prise_container.DTOs.TrancheRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Tranche;
import com.example.Rendez_vous_prise_container.Mappers.TrancheMapper;
import com.example.Rendez_vous_prise_container.Repositories.BlockageTrancheRepository;
import com.example.Rendez_vous_prise_container.Repositories.RDVRepository;
import com.example.Rendez_vous_prise_container.Repositories.TrancheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrancheServiceImpl implements TrancheService{
    private final TrancheRepository repository;
    private final TrancheMapper mapper;
    private final RDVRepository rdvRepository;
    private final BlockageTrancheRepository blockageRepository;

    @Override
    public Tranche create(TrancheRequestDTO dto) {
        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        return repository.save(mapper.toEntity(dto));
    }

    @Override
    public Tranche update(Long id, TrancheRequestDTO dto) {
        Tranche existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tranche not found"));

        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
        existing.setQuota(dto.getQuota());

        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Tranche> getAll() {
        return repository.findAll();
    }

    @Override
    public Tranche getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tranche not found"));
    }

    @Override
    public List<TrancheAvailabilityDTO> getAvailability(LocalDate date) {
        return repository.findAll().stream()
                .map(tranche -> {
                    long booked = rdvRepository.countByDateAndTrancheId(date, tranche.getId());
                    boolean blocked = blockageRepository.findByDateAndTrancheIdAndActiveTrue(date, tranche.getId()).isPresent();
                    long remaining = Math.max((long) tranche.getQuota() - booked, 0);
                    return TrancheAvailabilityDTO.builder()
                            .id(tranche.getId())
                            .startTime(tranche.getStartTime())
                            .endTime(tranche.getEndTime())
                            .quota(tranche.getQuota())
                            .booked(booked)
                            .remaining(remaining)
                            .blocked(blocked)
                            .build();
                })
                .toList();
    }
}
