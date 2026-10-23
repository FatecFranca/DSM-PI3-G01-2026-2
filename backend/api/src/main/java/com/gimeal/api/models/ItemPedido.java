package com.gimeal.api.models;

import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

public class ItemPedido {
    
    @Field(targetType = FieldType.OBJECT_ID)
    private String produtoId;

    private Integer quantidade;
    private Double precoUnitario;

    public ItemPedido(){

    }

    public ItemPedido(
        String produtoId,
        Integer quantidade,
        Double precoUnitario){
            this.produtoId = produtoId;
            this.quantidade = quantidade;
            this.precoUnitario = precoUnitario;
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

    

}
