package com.example.Rendez_vous_prise_container.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String phone;
}
