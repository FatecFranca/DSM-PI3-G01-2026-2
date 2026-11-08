package com.gimeal.api.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gimeal.api.models.Pedido;
import com.gimeal.api.models.StatusPedidos;

public interface PedidoRepository
        extends MongoRepository<Pedido, String> {

    List<Pedido> findByStatusInOrderByCriadoEmAsc(List<StatusPedidos> status);

    List<Pedido> findByStatusOrderByCriadoEmAsc(StatusPedidos status);

    List<Pedido> findAllByOrderByCriadoEmDesc();

    List<Pedido> findByCriadoEmAfterOrderByCriadoEmDesc(LocalDateTime inicio);

    Optional<Pedido> findFirstByCriadoEmAfterOrderBySenhaDesc(LocalDateTime inicio);
}
