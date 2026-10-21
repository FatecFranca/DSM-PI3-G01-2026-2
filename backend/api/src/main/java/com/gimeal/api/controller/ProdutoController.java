package com.gimeal.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimeal.api.model.dto.ProdutoRequest;
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
}
