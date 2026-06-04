package com.example.Rendez_vous_prise_container.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContainerResponseDTO {

    private Long id;
    private String reference;
    private String clientName;
}
