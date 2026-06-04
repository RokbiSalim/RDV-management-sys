package com.example.Rendez_vous_prise_container.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockageTranche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Column(name = "is_active")
    private boolean active;

    private String reason;

    @ManyToOne
    private Tranche tranche;
}
