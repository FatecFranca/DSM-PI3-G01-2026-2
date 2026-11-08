package com.gimeal.api.models;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class Avaliacao {

    @NotNull(message = "A nota da avaliação é obrigatória.")
    @Min(value = 1, message = "A nota mínima é 1.")
    @Max(value = 5, message = "A nota máxima é 5.")
    private Integer nota;

    private String comentario;

    private LocalDateTime dataHora;

    public Avaliacao() {
    }

    public Avaliacao(Integer nota, String comentario, LocalDateTime dataHora) {
        this.nota = nota;
        this.comentario = comentario;
        this.dataHora = dataHora;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}
