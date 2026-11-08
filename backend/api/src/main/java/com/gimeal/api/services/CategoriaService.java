package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.dtos.CategoriaRequest;
import com.gimeal.api.models.Categoria;
import com.gimeal.api.repositories.CategoriaRepository;
import com.gimeal.api.repositories.ProdutoRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(
            CategoriaRepository repository,
            ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    public List<Categoria> listarTodos() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Categoria salvar(CategoriaRequest request) {
        if (repository.existsByNomeIgnoreCase(request.nome())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma categoria com este nome.");
        }

        return repository.save(new Categoria(null, request.nome(), request.icone()));
    }

    public Categoria atualizar(String id, CategoriaRequest request) {
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria não encontrada."));

        categoria.setNome(request.nome());
        categoria.setIcone(request.icone());

        return repository.save(categoria);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Categoria não encontrada.");
        }

        if (produtoRepository.existsByCategoriaId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir uma categoria com produtos vinculados.");
        }

        repository.deleteById(id);
    }
}
