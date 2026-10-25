package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

public class ComboPedido {

    private String nome;
    private Double preco;
    private List<String> itens = new ArrayList<>();

    public ComboPedido(){

    }

    public ComboPedido(
        String nome,
        Double preco,
        List<String> itens) {
            this.nome = nome;
            this.preco = preco;
            this.itens = itens;
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

    public List<String> getItens() {
        return itens;
    }

    public void setItens(List<String> itens) {
        this.itens = itens;
    }

}
