package com.gimeal.api.dtos;

import com.gimeal.api.models.StatusPedidos;

import jakarta.validation.constraints.NotNull;

public record StatusRequest(
        @NotNull(message = "O status é obrigatório.") StatusPedidos status) {
}
