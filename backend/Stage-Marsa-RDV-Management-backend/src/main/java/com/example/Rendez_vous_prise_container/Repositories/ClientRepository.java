package com.example.Rendez_vous_prise_container.Repositories;

import com.example.Rendez_vous_prise_container.Entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {
}
