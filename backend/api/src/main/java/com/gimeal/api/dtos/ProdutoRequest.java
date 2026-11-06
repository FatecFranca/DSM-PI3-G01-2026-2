package com.gimeal.api.dtos;

import java.util.List;

import com.gimeal.api.models.OpcaoCombo;
import com.gimeal.api.models.Tamanhos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProdutoRequest(
        @NotBlank(message = "O nome do produto é obrigatório.") String nome,
        @NotNull(message = "O preço base é obrigatório.") @PositiveOrZero(message = "O preço base não pode ser negativo.") Double precoBase,
        String descricao,
        @NotBlank(message = "A categoria é obrigatória.") String categoriaId,
        String codigoImagem,
        List<Tamanhos> tamanhos,
        List<String> ingredientes,
        List<IngredienteRequest> adicionais,
        List<OpcaoCombo> opcoesCombo) {
}