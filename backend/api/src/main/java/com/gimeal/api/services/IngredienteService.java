package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gimeal.api.models.Ingrediente;
import com.gimeal.api.repositories.IngredienteRepository;

@Service
public class IngredienteService {
    
    private final IngredienteRepository repository;

    public IngredienteService(IngredienteRepository repository) {
        this.repository = repository;
    }

    public List<Ingrediente> listarTodos() {
        return repository.findAll();
    }

    public Optional<Ingrediente> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Ingrediente salvar(Ingrediente ingrediente) {
        return repository.save(ingrediente);
    }

    public void excluir(String id) {
        repository.deleteById(id);
    }

} 
