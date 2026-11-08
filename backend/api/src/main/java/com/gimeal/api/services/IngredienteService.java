package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.dtos.IngredienteRequest;
import com.gimeal.api.models.Ingrediente;
import com.gimeal.api.repositories.IngredienteRepository;
import com.gimeal.api.repositories.ProdutoRepository;

@Service
public class IngredienteService {

    private final IngredienteRepository repository;
    private final ProdutoRepository produtoRepository;

    public IngredienteService(
            IngredienteRepository repository,
            ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    public List<Ingrediente> listarTodos() {
        return repository.findAll();
    }

    public Optional<Ingrediente> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Ingrediente salvar(IngredienteRequest request) {
        return repository.save(new Ingrediente(
                null,
                request.nome(),
                request.preco(),
                request.quantidade()));
    }

    public Ingrediente atualizar(String id, IngredienteRequest request) {
        Ingrediente ingrediente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ingrediente não encontrado."));

        ingrediente.setNome(request.nome());
        ingrediente.setPreco(request.preco());
        ingrediente.setQuantidade(request.quantidade());

        return repository.save(ingrediente);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ingrediente não encontrado.");
        }

        boolean usadoEmProduto = produtoRepository.existsByIngredientesBaseIds(id)
                || produtoRepository.existsByIngredientesAdicionaisIds(id);

        if (usadoEmProduto) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir um ingrediente usado por um produto.");
        }

        repository.deleteById(id);
    }
}
