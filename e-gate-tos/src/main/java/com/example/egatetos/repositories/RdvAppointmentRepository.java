package com.example.egatetos.repositories;

import com.example.egatetos.entities.RdvAppointmentRef;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RdvAppointmentRepository extends JpaRepository<RdvAppointmentRef, Long> {

    @EntityGraph(attributePaths = "container")
    Optional<RdvAppointmentRef> findByQrCode(String qrCode);

    @Override
    @EntityGraph(attributePaths = "container")
    Optional<RdvAppointmentRef> findById(Long id);
}
