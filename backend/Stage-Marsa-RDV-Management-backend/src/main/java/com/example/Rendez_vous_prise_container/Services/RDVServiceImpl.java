package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.GateCheckRequest;
import com.example.Rendez_vous_prise_container.DTOs.GateCheckResponse;
import com.example.Rendez_vous_prise_container.DTOs.RDVRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.*;
import com.example.Rendez_vous_prise_container.Repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RDVServiceImpl implements RDVService {

    private final RDVRepository rdvRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ContainerRepository containerRepository;
    private final TrancheRepository trancheRepository;
    private final BlockageTrancheRepository blockageRepository;
    private final WhatsAppNotificationService whatsAppNotificationService;
    private final EGateTosClientService eGateTosClientService;

    @Override
    public RDV createRDV(RDVRequestDTO dto) {
        validateAppointmentDate(dto.getDate());

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

        RDV savedRdv = rdvRepository.save(rdv);
        eGateTosClientService.verifyContainerAfterValidation(savedRdv);
        sendQrCodeIfNeeded(savedRdv);

        return savedRdv;
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

        RDV savedRdv = rdvRepository.save(rdv);
        eGateTosClientService.verifyContainerAfterValidation(savedRdv);
        sendQrCodeIfNeeded(savedRdv);

        return savedRdv;
    }

    @Override
    public RDV cancelRDV(Long id) {

        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        rdv.setStatut(StatutRDV.CANCELLED);

        return rdvRepository.save(rdv);
    }

    @Override
    public GateCheckResponse verifyQrCode(GateCheckRequest request) {
        if (request == null || request.getQrCode() == null || request.getQrCode().isBlank()) {
            throw new RuntimeException("QR code is required");
        }

        RDV rdv = rdvRepository.findByQrCode(request.getQrCode())
                .orElseThrow(() -> new RuntimeException("RDV not found for this QR code"));

        if (rdv.getStatut() != StatutRDV.CONFIRMED) {
            throw new RuntimeException("Only confirmed RDV QR codes can be checked at the gate");
        }

        return eGateTosClientService.checkGateForRdvSafely(rdv);
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
        validateAppointmentDate(dto.getDate());

        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV not found"));

        rdv.setCin(dto.getCin());
        rdv.setTransporterName(dto.getTransporterName());
        rdv.setTruckPlate(dto.getTruckPlate());
        rdv.setDate(dto.getDate());

        return rdvRepository.save(rdv);
    }

    private void validateAppointmentDate(LocalDate date) {
        LocalDate minDate = LocalDate.now().plusDays(1);
        LocalDate maxDate = LocalDate.now().plusDays(30);

        if (date == null || date.isBefore(minDate) || date.isAfter(maxDate)) {
            throw new RuntimeException("Appointment date must be between tomorrow and 30 days from today.");
        }
    }

    private void sendQrCodeIfNeeded(RDV rdv) {
        if (rdv.getStatut() != StatutRDV.CONFIRMED) {
            log.info("WhatsApp QR not sent for RDV {} because status is {}", rdv.getId(), rdv.getStatut());
            return;
        }

        if (Boolean.TRUE.equals(rdv.getQrSent())) {
            log.info("WhatsApp QR already sent for RDV {}", rdv.getId());
            return;
        }

        try {
            whatsAppNotificationService.sendAppointmentQrCode(rdv);
            rdv.setQrSent(true);
            rdvRepository.save(rdv);
            log.info("WhatsApp QR sent successfully for RDV {}", rdv.getId());
        } catch (Exception ex) {
            log.warn("WhatsApp QR could not be sent for RDV {}: {}", rdv.getId(), ex.getMessage());
        }
    }
}

