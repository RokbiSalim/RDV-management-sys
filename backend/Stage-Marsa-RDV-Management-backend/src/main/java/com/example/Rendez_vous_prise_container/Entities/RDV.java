package com.example.Rendez_vous_prise_container.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class RDV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cin;
    private String transporterName;
    private String truckPlate;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private StatutRDV statut;

    @ManyToOne
    private Tranche tranche;

    @ManyToOne
    private Container container;

    @ManyToOne
    private Client client;

    @ManyToOne
    private Utilisateur createdBy;

    /** Token unique affiché dans le QR code après approbation. */
    @Column(unique = true)
    private String qrCode;
}

