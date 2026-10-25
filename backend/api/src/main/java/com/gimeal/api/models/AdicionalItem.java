package com.gimeal.api.models;

public class AdicionalItem {

    private String id;
    private String nome;
    private Double preco;

    public AdicionalItem(){

    }

    public AdicionalItem(
        String id,
        String nome,
        Double preco) {
            this.id = id;
            this.nome = nome;
            this.preco = preco;
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

}
