package com.gimeal.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record IngredienteRequest(
        @NotBlank(message = "O nome do ingrediente é obrigatório.") String nome,
        @PositiveOrZero(message = "O preço não pode ser negativo.") Double preco,
        Integer quantidade) {
}
