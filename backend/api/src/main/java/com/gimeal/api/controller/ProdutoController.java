package com.gimeal.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimeal.api.model.dto.ProdutoRequest;
import com.gimeal.api.model.dto.ProdutoResponse;
import com.gimeal.api.model.entity.Produto;
import com.gimeal.api.service.ProdutoService;

@RestController 
@RequestMapping("/api/produto")
public class ProdutoController {
    
    @Autowired
    private ProdutoService produtoService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Produto> criarProduto(@ModelAttribute ProdutoRequest produtoRequest) {

        Produto produtoSalvo = produtoService.criarProduto(produtoRequest);
        return ResponseEntity.ok(produtoSalvo);
    }

    @GetMapping
    public List<ProdutoResponse> buscarTodos() {
        return produtoService.buscarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable String id) {
        
        ProdutoResponse produtoResponse = produtoService.buscarPorId(id);

        return ResponseEntity.ok(produtoResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(
            @PathVariable String id,
            @ModelAttribute ProdutoRequest produtoRequest) {

        if (produtoService.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();

        }

        Produto produtoAtualizado = produtoService.atualizarProduto(id, produtoRequest);
        
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}") 
    public ResponseEntity<Void> excluirProduto(@PathVariable String id) {

        if (produtoService.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }

        produtoService.excluirProduto(id);

        return ResponseEntity.noContent().build();
    }

}
