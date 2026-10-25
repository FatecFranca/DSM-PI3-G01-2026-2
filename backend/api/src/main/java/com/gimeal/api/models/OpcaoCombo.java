package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

public class OpcaoCombo {

    private String id;
    private String nome;
    private Double preco;
    private List<String> produtosIds = new ArrayList<>();

    public OpcaoCombo(){

    }

    public OpcaoCombo(
        String id,
        String nome,
        Double preco,
        List<String> produtosIds) {
            this.id = id;
            this.nome = nome;
            this.preco = preco;
            this.produtosIds = produtosIds;
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

    public List<String> getProdutosIds() {
        return produtosIds;
    }

    public void setProdutosIds(List<String> produtosIds) {
        this.produtosIds = produtosIds;
    }

}
