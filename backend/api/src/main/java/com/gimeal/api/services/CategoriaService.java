package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.models.Categoria;
import com.gimeal.api.repositories.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public List<Categoria> listarTodos() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Categoria não encontrada.");
        }
        repository.deleteById(id);
    }
}