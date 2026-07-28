package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.ContainerDto;
import com.example.Rendez_vous_prise_container.DTOs.GateCheckRequest;
import com.example.Rendez_vous_prise_container.DTOs.GateCheckResponse;
import com.example.Rendez_vous_prise_container.Entities.RDV;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.OffsetDateTime;

@Service
@Slf4j
public class EGateTosClientService {

    private final RestTemplate restTemplate;
    private final String tosBaseUrl;

    public EGateTosClientService(RestTemplate restTemplate, @Value("${egate.tos.url:http://localhost:8082}") String tosBaseUrl) {
        this.restTemplate = restTemplate;
        this.tosBaseUrl = removeTrailingSlash(tosBaseUrl);
    }

    public ContainerDto createContainer(ContainerDto containerDto) {
        return restTemplate.postForObject(tosBaseUrl + "/api/tos/containers", containerDto, ContainerDto.class);
    }

    public ContainerDto getContainerByNumber(String containerNumber) {
        return restTemplate.getForObject(
                tosBaseUrl + "/api/tos/containers/number/{containerNumber}",
                ContainerDto.class,
                containerNumber
        );
    }

    public ContainerDto ensureContainerExistsForRdv(RDV rdv) {
        if (rdv == null || rdv.getContainer() == null || rdv.getContainer().getReference() == null) {
            throw new IllegalArgumentException("RDV container reference is required");
        }

        String containerNumber = rdv.getContainer().getReference();

        try {
            return getContainerByNumber(containerNumber);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw ex;
            }

            ContainerDto containerDto = new ContainerDto();
            containerDto.setContainerNumber(containerNumber);
            containerDto.setReadyForPickup(false);
            containerDto.setStatus("EN_ATTENTE");
            containerDto.setAppointmentNumber(rdv.getId() == null ? null : rdv.getId().toString());
            return createContainer(containerDto);
        }
    }

    public GateCheckResponse checkGate(GateCheckRequest request) {
        return restTemplate.postForObject(tosBaseUrl + "/api/tos/gate/check", request, GateCheckResponse.class);
    }

    public GateCheckResponse checkGateSafely(GateCheckRequest request) {
        try {
            return checkGate(request);
        } catch (RestClientException ex) {
            log.warn("e-gate-tos gate check unavailable: {}", ex.getMessage());
            return unavailableGateResponse(request, "e-gate-tos indisponible: " + ex.getMessage());
        } catch (Exception ex) {
            log.warn("e-gate-tos gate check failed: {}", ex.getMessage());
            return unavailableGateResponse(request, "Erreur e-gate-tos: " + ex.getMessage());
        }
    }

    public GateCheckResponse checkGateByQrCode(String qrCode) {
        GateCheckRequest request = new GateCheckRequest();
        request.setQrCode(qrCode);
        return checkGate(request);
    }

    public GateCheckResponse checkGateForRdv(RDV rdv) {
        if (rdv == null || rdv.getContainer() == null || rdv.getContainer().getReference() == null) {
            throw new IllegalArgumentException("RDV container reference is required");
        }

        GateCheckRequest request = new GateCheckRequest();
        request.setContainerNumber(rdv.getContainer().getReference());
        request.setAppointmentNumber(rdv.getId() == null ? null : rdv.getId().toString());
        request.setQrCode(rdv.getQrCode());
        return checkGate(request);
    }

    public GateCheckResponse checkGateForRdvSafely(RDV rdv) {
        try {
            return checkGateForRdv(rdv);
        } catch (RestClientException ex) {
            log.warn("e-gate-tos gate check unavailable for RDV {}: {}", rdv == null ? null : rdv.getId(), ex.getMessage());
            return unavailableGateResponse(buildRequestFromRdv(rdv), "e-gate-tos indisponible: " + ex.getMessage());
        } catch (Exception ex) {
            log.warn("e-gate-tos gate check failed for RDV {}: {}", rdv == null ? null : rdv.getId(), ex.getMessage());
            return unavailableGateResponse(buildRequestFromRdv(rdv), "Erreur e-gate-tos: " + ex.getMessage());
        }
    }

    public void verifyContainerAfterValidation(RDV rdv) {
        try {
            ContainerDto container = ensureContainerExistsForRdv(rdv);
            log.info("e-gate-tos container verified for RDV {}: {}", rdv.getId(), container.getContainerNumber());
        } catch (Exception ex) {
            log.warn("e-gate-tos container verification failed for RDV {}: {}", rdv.getId(), ex.getMessage());
        }
    }

    private String removeTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "http://localhost:8082";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private GateCheckRequest buildRequestFromRdv(RDV rdv) {
        GateCheckRequest request = new GateCheckRequest();
        if (rdv != null) {
            request.setContainerNumber(rdv.getContainer() == null ? null : rdv.getContainer().getReference());
            request.setAppointmentNumber(rdv.getId() == null ? null : rdv.getId().toString());
            request.setQrCode(rdv.getQrCode());
        }
        return request;
    }

    private GateCheckResponse unavailableGateResponse(GateCheckRequest request, String reason) {
        return new GateCheckResponse(
                false,
                reason,
                request == null ? null : request.getContainerNumber(),
                request == null ? null : request.getAppointmentNumber(),
                OffsetDateTime.now()
        );
    }
}
