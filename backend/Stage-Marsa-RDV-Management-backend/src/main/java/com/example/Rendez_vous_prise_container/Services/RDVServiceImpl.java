package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.RDVRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.*;
import com.example.Rendez_vous_prise_container.Repositories.*;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RDVServiceImpl implements RDVService {

    private final RDVRepository rdvRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ContainerRepository containerRepository;
    private final TrancheRepository trancheRepository;
    private final BlockageTrancheRepository blockageRepository;

    @Override
    public RDV createRDV(RDVRequestDTO dto) {

        Utilisateur user = utilisateurRepository.findById(dto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.RESPONSABLE_TRANSPORTEURS) {
            throw new RuntimeException("Only RESPONSABLE_TRANSPORTEURS can create RDV");
        }

        Tranche tranche = trancheRepository.findById(dto.getTrancheId())
                .orElseThrow(() -> new RuntimeException("Tranche not found"));

        Optional<BlockageTranche> blockage =
                blockageRepository.findByDateAndTrancheIdAndActiveTrue(
                        dto.getDate(),
                        dto.getTrancheId()
                );

        if (blockage.isPresent()) {
            throw new RuntimeException("This tranche is blocked for the selected date");
        }

        long count = rdvRepository.countByDateAndTrancheId(dto.getDate(), dto.getTrancheId());

        if (count >= tranche.getQuota()) {
            throw new RuntimeException("Quota exceeded for this tranche");
        }

        Container container = containerRepository.findById(dto.getContainerId())
                .orElseThrow(() -> new RuntimeException("Container not found"));

        RDV rdv = new RDV();
        rdv.setCin(dto.getCin());
        rdv.setTransporterName(dto.getTransporterName());
        rdv.setTruckPlate(dto.getTruckPlate());
        rdv.setDate(dto.getDate());
        rdv.setStatut(StatutRDV.CONFIRMED);
        rdv.setTranche(tranche);
        rdv.setContainer(container);
        rdv.setClient(container.getClient());
        rdv.setCreatedBy(user);
        RdvQrSupport.ensureQrCodeForApproved(rdv);

        return rdvRepository.save(rdv);
    }

    @Override
    public RDV confirmRDV(Long id) {

        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        if (rdv.getStatut() == StatutRDV.CONFIRMED) {
            throw new RuntimeException("RDV already confirmed");
        }

        rdv.setStatut(StatutRDV.CONFIRMED);
        RdvQrSupport.ensureQrCodeForApproved(rdv);

        return rdvRepository.save(rdv);
    }

    @Override
    public RDV cancelRDV(Long id) {

        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        rdv.setStatut(StatutRDV.CANCELLED);

        return rdvRepository.save(rdv);
    }

    @Override
    public List<RDV> getAllRDVs() {
        return rdvRepository.findAll();
    }

    @Override
    public void deleteRDV(Long id) {
        rdvRepository.deleteById(id);
    }

    @Override
    public RDV updateRDV(Long id, RDVRequestDTO dto) {
        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        rdv.setCin(dto.getCin());
        rdv.setTransporterName(dto.getTransporterName());
        rdv.setTruckPlate(dto.getTruckPlate());
        rdv.setDate(dto.getDate());

        return rdvRepository.save(rdv);
    }
}
