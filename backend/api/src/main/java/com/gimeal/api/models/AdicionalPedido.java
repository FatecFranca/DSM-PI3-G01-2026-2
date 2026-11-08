package com.gimeal.api.models;

public class AdicionalPedido {

    private String ingredienteId;

    private String nome;
    private Double preco;

    public AdicionalPedido(){

    }

    public AdicionalPedido(
        String ingredienteId,
        String nome,
        Double preco) {
            this.ingredienteId = ingredienteId;
            this.nome = nome;
            this.preco = preco;
        }

    public String getIngredienteId() {
        return ingredienteId;
    }

    public void setIngredienteId(String ingredienteId) {
        this.ingredienteId = ingredienteId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

}
