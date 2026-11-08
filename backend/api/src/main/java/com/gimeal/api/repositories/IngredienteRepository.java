package com.gimeal.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Ingrediente;

public interface IngredienteRepository 
    extends MongoRepository <Ingrediente, String>{
}
