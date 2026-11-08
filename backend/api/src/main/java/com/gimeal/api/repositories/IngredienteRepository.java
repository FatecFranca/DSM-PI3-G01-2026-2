package com.gimeal.api.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Ingrediente;

public interface IngredienteRepository
        extends MongoRepository<Ingrediente, String> {

    Optional<Ingrediente> findByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCase(String nome);
}
