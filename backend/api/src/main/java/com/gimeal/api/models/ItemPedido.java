package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ItemPedido {

    private String idItem;

    @NotBlank(message = "O produto do item é obrigatório.")
    private String produtoId;

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade mínima é 1.")
    private Integer quantidade;

    private Double precoUnitario;
    private String nomeProduto;
    private String tamanho;
    private List<String> ingredientesRemovidos = new ArrayList<>();
    private List<AdicionalPedido> adicionais = new ArrayList<>();
    private ComboPedido combo;

    public ItemPedido() {
    }

    public ItemPedido(
            String idItem,
            String produtoId,
            Integer quantidade,
            Double precoUnitario,
            String nomeProduto,
            String tamanho,
            List<String> ingredientesRemovidos,
            List<AdicionalPedido> adicionais,
            ComboPedido combo) {
        this.idItem = idItem;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.nomeProduto = nomeProduto;
        this.tamanho = tamanho;
        this.ingredientesRemovidos = ingredientesRemovidos;
        this.adicionais = adicionais;
        this.combo = combo;
    }

    public String getIdItem() {
        return idItem;
    }

    public void setIdItem(String idItem) {
        this.idItem = idItem;
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
