package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.WhatsAppNotificationResponse;
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

import static org.springframework.http.HttpStatus.BAD_GATEWAY;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
public class WhatsAppNotificationService {

    private static final String GRAPH_API_VERSION = "v22.0";

    @Value("${whatsapp.token:}")
    private String token;

    @Value("${whatsapp.phone-number-id:}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public WhatsAppNotificationResponse sendWhatsAppMessage(String phoneNumber, String message) {
        if (token == null || token.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            throw new ResponseStatusException(
                    INTERNAL_SERVER_ERROR,
                    "WhatsApp configuration is missing: whatsapp.token or whatsapp.phone-number-id"
            );
        }

        String url = "https://graph.facebook.com/" + GRAPH_API_VERSION + "/" + phoneNumberId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", normalizePhoneNumber(phoneNumber),
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

            return new WhatsAppNotificationResponse(
                    true,
                    response.getStatusCode().toString(),
                    messageId,
                    body
            );
        } catch (HttpStatusCodeException ex) {
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "WhatsApp API error " + ex.getStatusCode() + ": " + ex.getResponseBodyAsString(),
                    ex
            );
        } catch (RestClientException ex) {
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
