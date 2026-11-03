package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

public class ItemPedido {
    
    private String produtoId;

    private Integer quantidade;
    private Double precoUnitario;

    private String nomeProduto;
    private String tamanho;
    private List<String> ingredientesRemovidos = new ArrayList<>();
    private List<AdicionalPedido> adicionais = new ArrayList<>();
    private ComboPedido combo;

    public ItemPedido(){

    }

    public ItemPedido(
        String produtoId,
        Integer quantidade,
        Double precoUnitario,
        String nomeProduto,
        String tamanho,
        List<String> ingredientesRemovidos,
        List<AdicionalPedido> adicionais,
        ComboPedido combo){
            this.produtoId = produtoId;
            this.quantidade = quantidade;
            this.precoUnitario = precoUnitario;
            this.nomeProduto = nomeProduto;
            this.tamanho = tamanho;
            this.ingredientesRemovidos = ingredientesRemovidos;
            this.adicionais = adicionais;
            this.combo = combo;
        }

    public String getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(String produtoId) {
        this.produtoId = produtoId;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(Double precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getTamanho() {
        return tamanho;
    }

    public void setTamanho(String tamanho) {
        this.tamanho = tamanho;
    }

    public List<String> getIngredientesRemovidos() {
        return ingredientesRemovidos;
    }

    public void setIngredientesRemovidos(List<String> ingredientesRemovidos) {
        this.ingredientesRemovidos = ingredientesRemovidos;
    }

    public List<AdicionalPedido> getAdicionais() {
        return adicionais;
    }

    public void setAdicionais(List<AdicionalPedido> adicionais) {
        this.adicionais = adicionais;
    }

    public ComboPedido getCombo() {
        return combo;
    }

    public void setCombo(ComboPedido combo) {
        this.combo = combo;
    }

}