package com.example.egatetos.controllers;

import com.example.egatetos.dtos.GateCheckRequest;
import com.example.egatetos.dtos.GateCheckResponse;
import com.example.egatetos.services.GateCheckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tos/gate")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class GateCheckController {

    private final GateCheckService gateCheckService;

    @PostMapping("/check")
    public GateCheckResponse check(@Valid @RequestBody GateCheckRequest request) {
        return gateCheckService.check(request);
    }
}
