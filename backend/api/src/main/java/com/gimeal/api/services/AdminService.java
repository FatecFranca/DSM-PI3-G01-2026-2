package com.gimeal.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.models.Admin;
import com.gimeal.api.repositories.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public List<Admin> listarTodos() {
        return repository.findAll();
    }

    public Optional<Admin> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Admin salvar(Admin admin) {
        return repository.save(admin);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Admin não encontrado.");
        }
        repository.deleteById(id);
    }
}