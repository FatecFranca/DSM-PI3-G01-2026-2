package com.gimeal.api.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.gimeal.api.models.Avaliacao;
import com.gimeal.api.models.FormaPagamento;
import com.gimeal.api.models.ItemPedido;
import com.gimeal.api.models.StatusPedidos;
import com.gimeal.api.models.TipoConsumo;

public record PedidoResponse(
        String id,
        Integer senha,
        StatusPedidos status,
        LocalDateTime criadoEm,
        LocalDateTime iniciadoEm,
        LocalDateTime prontoEm,
        LocalDateTime entregueEm,
        Integer tempoPreparoMin,
        Double valorTotal,
        String nomeCliente,
        TipoConsumo tipoConsumo,
        FormaPagamento formaPagamento,
        List<ItemPedido> itens,
        Avaliacao avaliacao,
        Boolean avaliacaoPulada) {
}
