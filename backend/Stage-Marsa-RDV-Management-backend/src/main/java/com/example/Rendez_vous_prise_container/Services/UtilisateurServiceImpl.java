package com.example.Rendez_vous_prise_container.Services;

import com.example.Rendez_vous_prise_container.DTOs.UtilisateurRequestDTO;
import com.example.Rendez_vous_prise_container.Entities.Utilisateur;
import com.example.Rendez_vous_prise_container.Mappers.UtilisateurMapper;
import com.example.Rendez_vous_prise_container.Repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository repository;
    private final UtilisateurMapper mapper;

    @Override
    public Utilisateur create(UtilisateurRequestDTO dto) {
        return repository.save(mapper.toEntity(dto));
    }

    @Override
    public List<Utilisateur> getAll() {
        return repository.findAll();
    }
}
