package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.WhatsAppNotificationResponse;
import com.example.Rendez_vous_prise_container.Entities.RDV;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import java.util.regex.Pattern;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
@Slf4j
public class WhatsAppNotificationService {

    private static final String GRAPH_API_VERSION = "v19.0";
    private static final Pattern INTERNATIONAL_PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{8,14}$");

    @Value("${whatsapp.token:}")
    private String token;

    @Value("${whatsapp.phone-number-id:}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    void logWhatsAppConfigurationStatus() {
        log.info("WhatsApp configuration: token {}", isConfigured(token) ? "present" : "absent");
        log.info("WhatsApp configuration: phone-number-id {}", isConfigured(phoneNumberId) ? "present" : "absent");
    }

    public WhatsAppNotificationResponse sendAppointmentQrCode(RDV appointment) {
        if (appointment == null) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Appointment is required");
        }

        log.info("WhatsApp notification requested for approved RDV {}", appointment.getId());

        String phoneNumber = resolveAppointmentPhoneNumber(appointment);
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Appointment client phone number is missing");
        }

        log.info("WhatsApp phone resolved for RDV {}: {}", appointment.getId(), phoneNumber);

        return sendWhatsAppMessage(phoneNumber, "Votre RDV est approuvé.");
    }

    public WhatsAppNotificationResponse sendWhatsAppMessage(String phoneNumber, String message) {
        if (token == null || token.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            throw new ResponseStatusException(
                    INTERNAL_SERVER_ERROR,
                    "WhatsApp configuration is missing: whatsapp.token or whatsapp.phone-number-id"
            );
        }

        String normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        validateInternationalPhoneNumber(phoneNumber);

        String url = "https://graph.facebook.com/" + GRAPH_API_VERSION + "/" + phoneNumberId + "/messages";
        log.info("Calling WhatsApp Cloud API URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", normalizedPhoneNumber,
                "type", "text",
                "text", Map.of(
                        "preview_url", false,
                        "body", message
                )
        );

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, headers),
                    Map.class
            );

            Map<String, Object> body = response.getBody();
            String messageId = extractMessageId(body);
            log.info("WhatsApp API response status: {}", response.getStatusCode());
            log.info("WhatsApp API response body: {}", body);

            return new WhatsAppNotificationResponse(
                    true,
                    response.getStatusCode().toString(),
                    messageId,
                    body
            );
        } catch (HttpStatusCodeException ex) {
            log.warn("WhatsApp API error status: {}", ex.getStatusCode());
            log.warn("WhatsApp API error body: {}", ex.getResponseBodyAsString());
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "WhatsApp API error " + ex.getStatusCode() + ": " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (RestClientException ex) {
            log.warn("WhatsApp API call failed: {}", ex.getMessage());
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "Unable to call WhatsApp API: " + ex.getMessage(),
                    ex
            );
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {
        return phoneNumber.replace("+", "").replace(" ", "").trim();
    }

    private boolean isConfigured(String value) {
        return value != null && !value.isBlank();
    }

    private void validateInternationalPhoneNumber(String phoneNumber) {
        String compactPhoneNumber = phoneNumber.replace(" ", "").trim();
        if (!INTERNATIONAL_PHONE_PATTERN.matcher(compactPhoneNumber).matches()) {
            throw new ResponseStatusException(
                    INTERNAL_SERVER_ERROR,
                    "WhatsApp phone number must use international format, for example +2126XXXXXXXX"
            );
        }
    }

    private String buildAppointmentQrMessage(RDV appointment) {
        String containerReference = appointment.getContainer() == null
                ? "N/A"
                : appointment.getContainer().getReference();
        String trancheTime = appointment.getTranche() == null
                ? "N/A"
                : appointment.getTranche().getStartTime() + " - " + appointment.getTranche().getEndTime();
        String qrCode = appointment.getQrCode() == null ? "N/A" : appointment.getQrCode();

        return new StringJoiner(System.lineSeparator())
                .add("Votre rendez-vous Marsa Maroc est approuve.")
                .add("Reference conteneur: " + containerReference)
                .add("Date RDV: " + appointment.getDate())
                .add("Creneau horaire: " + trancheTime)
                .add("QR code RDV: " + qrCode)
                .toString();
    }

    private String resolveAppointmentPhoneNumber(RDV appointment) {
        if (appointment.getClient() == null) {
            return null;
        }

        return appointment.getClient().getPhone();
    }

    private String extractMessageId(Map<String, Object> body) {
        if (body == null) {
            return null;
        }

        Object messagesObject = body.get("messages");
        if (!(messagesObject instanceof List<?> messages) || messages.isEmpty()) {
            return null;
        }

        Object firstMessage = messages.get(0);
        if (!(firstMessage instanceof Map<?, ?> messageMap)) {
            return null;
        }

        Object id = messageMap.get("id");
        return id == null ? null : id.toString();
    }
}
