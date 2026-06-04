package com.example.Rendez_vous_prise_container.Config;

import com.example.Rendez_vous_prise_container.Entities.*;
import com.example.Rendez_vous_prise_container.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DemoDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final TrancheRepository trancheRepository;
    private final ContainerRepository containerRepository;

    @Override
    public void run(String... args) {
        seedUsersIfEmpty();
        seedTranches();

        Client marsa = findOrCreateClient("Marsa Maroc", "Port de Casablanca", "+212 5 22 00 00 00");
        Client portServices = findOrCreateClient("Port Services Maroc", "Port de Tanger Med", "+212 5 39 00 11 22");
        Client atlantiqueLogistics = findOrCreateClient("Atlantique Logistics", "Port de Agadir", "+212 5 28 00 33 44");
        Client oceanFreight = findOrCreateClient("Ocean Freight Maroc", "Port de Casablanca", "+212 5 22 11 22 33");
        Client tangerMedTransport = findOrCreateClient("Tanger Med Transport", "Port de Tanger Med", "+212 5 39 11 22 33");

        createContainerIfMissing("MSKU1234567", marsa);
        createContainerIfMissing("TCLU7654321", marsa);
        createContainerIfMissing("COSU9955441", portServices);
        createContainerIfMissing("OOLU1122334", atlantiqueLogistics);
        createContainerIfMissing("MEDU5566778", oceanFreight);
        createContainerIfMissing("CMAU9988776", tangerMedTransport);
        createContainerIfMissing("ONEU2233445", marsa);
        createContainerIfMissing("HLCU6677889", portServices);

        assignTransporterClient(marsa);
        log.info("Demo data ready: tranches, containers, and clients seeded or verified.");
    }

    private void seedTranches() {
        createOrUpdateTranche(LocalTime.of(8, 0), LocalTime.of(10, 0), 15);
        createOrUpdateTranche(LocalTime.of(14, 0), LocalTime.of(16, 0), 15);
    }

    private void createOrUpdateTranche(LocalTime startTime, LocalTime endTime, int quota) {
        trancheRepository.findAll().stream()
                .filter(t -> t.getStartTime().equals(startTime) && t.getEndTime().equals(endTime))
                .findFirst()
                .ifPresentOrElse(
                        tranche -> {
                            if (tranche.getQuota() != quota) {
                                tranche.setQuota(quota);
                                trancheRepository.save(tranche);
                            }
                        },
                        () -> {
                            Tranche tranche = new Tranche();
                            tranche.setStartTime(startTime);
                            tranche.setEndTime(endTime);
                            tranche.setQuota(quota);
                            trancheRepository.save(tranche);
                        }
                );
    }

    private Client findOrCreateClient(String name, String address, String phone) {
        return clientRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Client client = new Client();
                    client.setName(name);
                    client.setAddress(address);
                    client.setPhone(phone);
                    return clientRepository.save(client);
                });
    }

    private void createContainerIfMissing(String reference, Client client) {
        boolean exists = containerRepository.findAll().stream()
                .anyMatch(c -> c.getReference().equalsIgnoreCase(reference));
        if (!exists) {
            Container container = new Container();
            container.setReference(reference);
            container.setClient(client);
            containerRepository.save(container);
        }
    }

    private void assignTransporterClient(Client client) {
        Utilisateur transporter = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.RESPONSABLE_TRANSPORTEURS)
                .findFirst()
                .orElse(null);
        if (transporter != null && transporter.getClient() == null) {
            transporter.setClient(client);
            utilisateurRepository.save(transporter);
        }
    }

    private void seedUsersIfEmpty() {
        if (utilisateurRepository.count() > 0) {
            return;
        }
        Utilisateur admin = new Utilisateur();
        admin.setUsername("admin");
        admin.setRole(Role.ADMIN_PORT);
        utilisateurRepository.save(admin);

        Utilisateur transporter = new Utilisateur();
        transporter.setUsername("transporteur");
        transporter.setRole(Role.RESPONSABLE_TRANSPORTEURS);
        utilisateurRepository.save(transporter);

        log.info("Demo users created: admin, transporteur");
    }
}
