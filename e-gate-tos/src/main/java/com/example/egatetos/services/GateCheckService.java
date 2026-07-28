package com.example.egatetos.services;

import com.example.egatetos.dtos.GateCheckRequest;
import com.example.egatetos.dtos.GateCheckResponse;
import com.example.egatetos.entities.RdvAppointmentRef;
import com.example.egatetos.entities.RdvStatus;
import com.example.egatetos.entities.TosContainer;
import com.example.egatetos.repositories.RdvAppointmentRepository;
import com.example.egatetos.repositories.TosContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GateCheckService {

    private final RdvAppointmentRepository rdvAppointmentRepository;
    private final TosContainerRepository tosContainerRepository;

    public GateCheckResponse check(GateCheckRequest request) {
        OffsetDateTime checkedAt = OffsetDateTime.now();

        Optional<RdvAppointmentRef> optionalRdv = findRdv(request);
        if (optionalRdv.isEmpty()) {
            return denied("RDV introuvable", request, checkedAt);
        }

        RdvAppointmentRef rdv = optionalRdv.get();
        String containerNumber = rdv.getContainer() == null ? request.getContainerNumber() : rdv.getContainer().getReference();
        String appointmentNumber = rdv.getId() == null ? request.getAppointmentNumber() : rdv.getId().toString();

        if (rdv.getStatut() != RdvStatus.CONFIRMED) {
            return denied("RDV non valide", containerNumber, appointmentNumber, checkedAt);
        }

        if (!LocalDate.now().equals(rdv.getDate())) {
            return denied("RDV non prévu aujourd'hui", containerNumber, appointmentNumber, checkedAt);
        }

        if (containerNumber == null || containerNumber.isBlank()) {
            return denied("Conteneur manquant sur le RDV", containerNumber, appointmentNumber, checkedAt);
        }

        Optional<TosContainer> tosContainer = tosContainerRepository.findByContainerNumber(containerNumber);
        if (tosContainer.isEmpty()) {
            return denied("Conteneur non configuré dans e-gate-tos", containerNumber, appointmentNumber, checkedAt);
        }

        if (!tosContainer.get().isReadyForPickup()) {
            return denied("Conteneur non prêt pour enlèvement", containerNumber, appointmentNumber, checkedAt);
        }

        return new GateCheckResponse(true, "Accès autorisé", containerNumber, appointmentNumber, checkedAt);
    }

    private Optional<RdvAppointmentRef> findRdv(GateCheckRequest request) {
        if (request == null) {
            return Optional.empty();
        }
        if (request.getQrCode() != null && !request.getQrCode().isBlank()) {
            return rdvAppointmentRepository.findByQrCode(request.getQrCode());
        }
        if (request.getAppointmentNumber() != null && !request.getAppointmentNumber().isBlank()) {
            try {
                return rdvAppointmentRepository.findById(Long.valueOf(request.getAppointmentNumber()));
            } catch (NumberFormatException ex) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    private GateCheckResponse denied(String reason, GateCheckRequest request, OffsetDateTime checkedAt) {
        String containerNumber = request == null ? null : request.getContainerNumber();
        String appointmentNumber = request == null ? null : request.getAppointmentNumber();
        return denied(reason, containerNumber, appointmentNumber, checkedAt);
    }

    private GateCheckResponse denied(String reason, String containerNumber, String appointmentNumber, OffsetDateTime checkedAt) {
        return new GateCheckResponse(false, reason, containerNumber, appointmentNumber, checkedAt);
    }
}
