package com.gimeal.api.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Pedido;

public interface PedidoRepository 
    extends MongoRepository <Pedido, String>{
}
