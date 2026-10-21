package com.gimeal.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gimeal.api.model.dto.ProdutoRequest;
import com.gimeal.api.model.entity.Produto;
import com.gimeal.api.repository.ProdutoRepository;

@Service 
public class ProdutoService {
    
    @Autowired 
    private ProdutoRepository produtoRepository;

    @Autowired 
    private S3Service s3Service;

    public Produto criarProduto(ProdutoRequest produtoRequest) {
        
        String codigoImagem = s3Service.uploadFile(produtoRequest.imagem());

        Produto produto = new Produto(codigoImagem);

        return produtoRepository.save(produto);
    }
    
}
