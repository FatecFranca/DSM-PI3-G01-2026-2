package com.gimeal.api.models;

public class Tamanhos {

    private String id;
    private String nome;
    private Double preco;
    private Boolean ativo;

    public Tamanhos(){

    }

    public Tamanhos(
        String id,
        String nome,
        Double preco,
        Boolean ativo) {
            this.id = id;
            this.nome = nome;
            this.preco = preco;
            this.ativo = ativo;
        }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

}
