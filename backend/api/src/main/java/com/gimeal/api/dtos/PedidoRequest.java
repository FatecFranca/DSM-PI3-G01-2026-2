package com.gimeal.api.dtos;

import java.util.List;

import com.gimeal.api.models.FormaPagamento;
import com.gimeal.api.models.ItemPedido;
import com.gimeal.api.models.TipoConsumo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record PedidoRequest(
        @NotBlank(message = "O nome do cliente é obrigatório.") String nomeCliente,
        @NotNull(message = "O tipo de consumo é obrigatório.") TipoConsumo tipoConsumo,
        @NotNull(message = "A forma de pagamento é obrigatória.") FormaPagamento formaPagamento,
        @NotEmpty(message = "O pedido precisa ter ao menos um item.") @Valid List<ItemPedido> itens) {
}
