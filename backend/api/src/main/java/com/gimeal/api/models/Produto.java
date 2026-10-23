package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document(collection = "produto")
public class Produto {

    @Id 
    private String id;
    
    private String nome;
    private Double precoBase;
    private String descricao;
    private List<Tamanhos> tamanhos = new ArrayList<>();
    private String codigoImagem;
    
    @Field(targetType = FieldType.OBJECT_ID)
    private String categoriaId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String ingredienteBaseId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String IngredientesAdicionaisId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String produtoCombo;

    public Produto(){

    }

    public Produto(
        String id,
        String nome,
        Double precoBase,
        String descricao,
        List<Tamanhos> tamanhos,
        String codigoImagem,
        String categoriaId,
        String ingredienteBaseId,
        String ingredientesAdicionaisId,
        String produtoCombo){
            this.id = id;
            this.nome = nome;
            this.precoBase = precoBase;
            this.descricao = descricao;
            this.tamanhos = tamanhos;
            this.codigoImagem = codigoImagem;
            this.categoriaId = categoriaId;
            this.ingredienteBaseId = ingredienteBaseId;
            this.IngredientesAdicionaisId = ingredientesAdicionaisId;
            this.produtoCombo = produtoCombo;
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

    public Double getPrecoBase() {
        return precoBase;
    }

    public void setPrecoBase(Double precoBase) {
        this.precoBase = precoBase;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<Tamanhos> getTamanhos() {
        return tamanhos;
    }

    public void setTamanhos(List<Tamanhos> tamanhos) {
        this.tamanhos = tamanhos;
    }

    public String getCodigoImagem() {
        return codigoImagem;
    }

    public void setCodigoImagem(String codigoImagem) {
        this.codigoImagem = codigoImagem;
    }

    public String getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(String categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getIngredienteBaseId() {
        return ingredienteBaseId;
    }

    public void setIngredienteBaseId(String ingredienteBaseId) {
        this.ingredienteBaseId = ingredienteBaseId;
    }

    public String getIngredientesAdicionaisId() {
        return IngredientesAdicionaisId;
    }

    public void setIngredientesAdicionaisId(String ingredientesAdicionaisId) {
        IngredientesAdicionaisId = ingredientesAdicionaisId;
    }

    public String getProdutoCombo() {
        return produtoCombo;
    }

    public void setProdutoCombo(String produtoCombo) {
        this.produtoCombo = produtoCombo;
    }

        
}
