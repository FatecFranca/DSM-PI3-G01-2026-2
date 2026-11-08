package com.gimeal.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Categoria;

public interface CategoriaRepository 
    extends MongoRepository <Categoria, String> {
}
