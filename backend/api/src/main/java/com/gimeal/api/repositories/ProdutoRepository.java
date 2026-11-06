package com.gimeal.api.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Produto;

public interface ProdutoRepository
        extends MongoRepository<Produto, String> {

    List<Produto> findByCategoriaId(String categoriaId);

    boolean existsByCategoriaId(String categoriaId);

    boolean existsByIngredientesBaseIds(String ingredienteId);

    boolean existsByIngredientesAdicionaisIds(String ingredienteId);
}
