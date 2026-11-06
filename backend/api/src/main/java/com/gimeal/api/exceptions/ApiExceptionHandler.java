package com.gimeal.api.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponse> tratarRegraDeNegocio(
            ResponseStatusException exception,
            HttpServletRequest request) {

        ErroResponse erro = new ErroResponse(
                LocalDateTime.now(),
                exception.getStatusCode().value(),
                exception.getStatusCode().toString(),
                exception.getReason(),
                request.getRequestURI());

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(erro);
    }
}
