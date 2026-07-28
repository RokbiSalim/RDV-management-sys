package com.example.Rendez_vous_prise_container.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateCheckResponse {

    private boolean accessGranted;
    private String reason;
    private String containerNumber;
    private String appointmentNumber;
    private OffsetDateTime checkedAt;
}
