package com.example.Rendez_vous_prise_container.Controllers;

import com.example.Rendez_vous_prise_container.DTOs.GateCheckRequest;
import com.example.Rendez_vous_prise_container.DTOs.GateCheckResponse;
import com.example.Rendez_vous_prise_container.Services.EGateTosClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/egate")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class EGateTosController {

    private final EGateTosClientService eGateTosClientService;

    @PostMapping("/gate/check")
    public GateCheckResponse checkGate(@Valid @RequestBody GateCheckRequest request) {
        return eGateTosClientService.checkGateSafely(request);
    }
}
