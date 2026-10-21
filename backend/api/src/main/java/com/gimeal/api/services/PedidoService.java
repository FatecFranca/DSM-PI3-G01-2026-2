package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gimeal.api.models.Pedido;
import com.gimeal.api.repositories.PedidoRepository;

@Service
public class PedidoService {
    
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public List<Pedido> listarTodos() {
        return repository.findAll();
    }

    public Optional<Pedido> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Pedido salvar(Pedido pedido) {
        return repository.save(pedido);
    }

    public void excluir(String id) {
        repository.deleteById(id);
    }

} 
