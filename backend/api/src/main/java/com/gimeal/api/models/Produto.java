package com.gimeal.api.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Document(collection = "produtos")
public class Produto {

    @Id
    private String id;

    @NotBlank(message = "O nome do produto é obrigatório.")
    private String nome;

    @NotNull(message = "O preço base é obrigatório.")
    @PositiveOrZero(message = "O preço base não pode ser negativo.")
    private Double precoBase;

    @NotBlank(message = "A descrição do produto é obrigatória")
    private String descricao;

    private List<Tamanhos> tamanhos = new ArrayList<>();

    private String codigoImagem;

    @NotBlank(message = "A categoria é obrigatória.")
    private String categoriaId;

    private List<String> ingredientesBaseIds = new ArrayList<>();

    private List<String> ingredientesAdicionaisIds = new ArrayList<>();

    private List<OpcaoCombo> opcoesCombo = new ArrayList<>();

    public Produto() {
    }

    public Produto(
            String id,
            String nome,
            Double precoBase,
            String descricao,
            List<Tamanhos> tamanhos,
            String codigoImagem,
            String categoriaId,
            List<String> ingredientesBaseIds,
            List<String> ingredientesAdicionaisIds,
            List<OpcaoCombo> opcoesCombo) {
        this.id = id;
        this.nome = nome;
        this.precoBase = precoBase;
        this.descricao = descricao;
        this.tamanhos = tamanhos;
        this.codigoImagem = codigoImagem;
        this.categoriaId = categoriaId;
        this.ingredientesBaseIds = ingredientesBaseIds;
        this.ingredientesAdicionaisIds = ingredientesAdicionaisIds;
        this.opcoesCombo = opcoesCombo;
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

    public List<String> getIngredientesBaseIds() {
        return ingredientesBaseIds;
    }

    public void setIngredientesBaseIds(List<String> ingredientesBaseIds) {
        this.ingredientesBaseIds = ingredientesBaseIds;
    }

    public List<String> getIngredientesAdicionaisIds() {
        return ingredientesAdicionaisIds;
    }

    public void setIngredientesAdicionaisIds(List<String> ingredientesAdicionaisIds) {
        this.ingredientesAdicionaisIds = ingredientesAdicionaisIds;
    }

    public List<OpcaoCombo> getOpcoesCombo() {
        return opcoesCombo;
    }

    public void setOpcoesCombo(List<OpcaoCombo> opcoesCombo) {
        this.opcoesCombo = opcoesCombo;
    }
}
