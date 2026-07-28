package com.example.Rendez_vous_prise_container.DTOs;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateCheckRequest {

    @Size(max = 30)
    private String containerNumber;

    @Size(max = 80)
    private String appointmentNumber;

    @Size(max = 500)
    private String qrCode;
}
