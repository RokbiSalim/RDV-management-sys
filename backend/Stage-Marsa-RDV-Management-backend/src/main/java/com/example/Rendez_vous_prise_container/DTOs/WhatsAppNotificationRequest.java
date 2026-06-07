package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.NotBlank;

public record WhatsAppNotificationRequest(
        @NotBlank String phoneNumber,
        @NotBlank String message
) {
}
