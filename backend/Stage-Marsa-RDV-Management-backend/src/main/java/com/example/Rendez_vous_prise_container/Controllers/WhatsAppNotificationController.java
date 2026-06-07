package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.WhatsAppNotificationRequest;
import com.example.Rendez_vous_prise_container.DTOs.WhatsAppNotificationResponse;
import com.example.Rendez_vous_prise_container.Services.WhatsAppNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class WhatsAppNotificationController {

    private final WhatsAppNotificationService whatsappNotificationService;

    public WhatsAppNotificationController(WhatsAppNotificationService whatsappNotificationService) {
        this.whatsappNotificationService = whatsappNotificationService;
    }

    @PostMapping("/whatsapp")
    public ResponseEntity<WhatsAppNotificationResponse> sendWhatsAppNotification(
            @Valid @RequestBody WhatsAppNotificationRequest request
    ) {
        return ResponseEntity.ok(
                whatsappNotificationService.sendWhatsAppMessage(
                        request.phoneNumber(),
                        request.message()
                )
        );
    }
}
