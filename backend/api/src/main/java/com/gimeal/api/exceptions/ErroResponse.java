package com.gimeal.api.exceptions;

import java.time.LocalDateTime;

public record ErroResponse(
        LocalDateTime timestamp,
        Integer status,
        String erro,
        String mensagem,
        String caminho) {
}
