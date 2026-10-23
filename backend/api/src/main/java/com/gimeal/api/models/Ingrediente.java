package com.gimeal.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "ingrediente")
public class Ingrediente {
    
    @Id 
    private String id;

    private String nome;
    private Double preco;
    private Integer quantidade;

    public Ingrediente(){

    }

    public Ingrediente(
        String id,
        String nome,
        Double preco,
        Integer quantidade){
            this.id = id;
            this.nome = nome;
            this.preco = preco;
            this.quantidade = quantidade;
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

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    
}
