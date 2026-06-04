package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.Entities.RDV;
import com.example.Rendez_vous_prise_container.Entities.StatutRDV;

import java.util.UUID;

final class RdvQrSupport {

    private RdvQrSupport() {
    }

    static void ensureQrCodeForApproved(RDV rdv) {
        if (rdv.getStatut() != StatutRDV.CONFIRMED) {
            return;
        }
        if (rdv.getQrCode() == null || rdv.getQrCode().isBlank()) {
            rdv.setQrCode("RDV-" + rdv.getId() + "-" + UUID.randomUUID().toString().substring(0, 8));
        }
    }
}
