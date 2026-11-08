package com.gimeal.api.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank(message = "O nome da categoria é obrigatório.") String nome,
        @NotBlank(message = "O ícone da categoria é obrigatório.") String icone) {
}
