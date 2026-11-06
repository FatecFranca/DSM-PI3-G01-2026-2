package com.gimeal.api.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TempoPreparoRequest(
        @NotNull(message = "O tempo de preparo é obrigatório.") @Min(value = 5, message = "O tempo mínimo é 5 minutos.") @Max(value = 180, message = "O tempo máximo é 180 minutos.") Integer tempoPreparoMin) {
}
