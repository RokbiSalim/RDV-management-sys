package com.example.Rendez_vous_prise_container.DTOs;

import java.util.Map;

public record WhatsAppNotificationResponse(
        boolean success,
        String providerStatus,
        String messageId,
        Map<String, Object> rawResponse
) {
}
