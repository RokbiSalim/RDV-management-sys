package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.UtilisateurRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Utilisateur;

import java.util.List;

public interface UtilisateurService {

    Utilisateur create(UtilisateurRequestDTO dto);

    List<Utilisateur> getAll();
}

