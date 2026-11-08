package com.gimeal.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimeal.api.models.Ingrediente;
import com.gimeal.api.services.IngredienteService;

@RestController
@RequestMapping("/ingrediente")
public class IngredienteController {
    
    private final IngredienteService service;

    public IngredienteController(IngredienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Ingrediente> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ingrediente> criar(@RequestBody Ingrediente ingrediente) {
        Ingrediente ingredienteSalvo = service.salvar(ingrediente);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ingredienteSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingrediente> atualizar(
            @PathVariable String id,
            @RequestBody Ingrediente ingrediente) {

        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ingrediente.setId(id);

        Ingrediente ingredienteAtualizado = service.salvar(ingrediente);

        return ResponseEntity.ok(ingredienteAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        
        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.excluir(id);

        return ResponseEntity.noContent().build();
    }

}