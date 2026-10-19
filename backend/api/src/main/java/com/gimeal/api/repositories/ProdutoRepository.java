package com.gimeal.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Produto;

public interface ProdutoRepository 
    extends MongoRepository <Produto, String> {
}
