package com.gimeal.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.model.entity.Produto;

public interface ProdutoRepository extends MongoRepository<Produto, String>{
    
}
