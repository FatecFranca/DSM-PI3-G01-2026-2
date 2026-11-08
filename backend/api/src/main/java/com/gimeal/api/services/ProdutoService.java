package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gimeal.api.models.Produto;
import com.gimeal.api.repositories.ProdutoRepository;

@Service
public class ProdutoService {
    
    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Optional<Produto> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Produto salvar(Produto produto) {
        return repository.save(produto);
    }

    public void excluir(String id) {
        repository.deleteById(id);
    }

} 
