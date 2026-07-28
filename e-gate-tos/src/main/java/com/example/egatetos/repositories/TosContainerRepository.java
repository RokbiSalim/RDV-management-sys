package com.example.egatetos.repositories;

import com.example.egatetos.entities.TosContainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TosContainerRepository extends JpaRepository<TosContainer, Long> {
    Optional<TosContainer> findByContainerNumber(String containerNumber);
}
