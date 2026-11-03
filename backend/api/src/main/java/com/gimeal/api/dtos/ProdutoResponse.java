package com.gimeal.api.dtos;

import java.util.List;

import com.gimeal.api.models.OpcaoCombo;
import com.gimeal.api.models.Tamanhos;

// Formato que o front recebe: já com os NOMES no lugar dos ids.
// Não inclui o estoque (quantidade) dos ingredientes, o cliente não precisa ver isso.
public record ProdutoResponse(
        String id,
        String nome,
        Double precoBase,
        String descricao,
        String codigoImagem,
        CategoriaResumo categoria,
        List<Tamanhos> tamanhos,
        List<IngredienteResumo> ingredientesBase,
        List<AdicionalResumo> adicionais,
        List<OpcaoCombo> opcoesCombo) {

    public record CategoriaResumo(String id, String nome, String icone) {}

    public record IngredienteResumo(String id, String nome) {}

    public record AdicionalResumo(String id, String nome, Double preco) {}
}
