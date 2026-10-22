package com.gimeal.api.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gimeal.api.model.dto.ProdutoRequest;
import com.gimeal.api.model.dto.ProdutoResponse;
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

    public ProdutoResponse buscarPorId(String id) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        String urlTemporaria = s3Service.criarGetUrlTemporaria(produto.getCodigoImagem());

        return new ProdutoResponse(produto.getId(), produto.getCodigoImagem(), urlTemporaria);
    }

    public List<ProdutoResponse> buscarTodos() {

        List<Produto> produtos = produtoRepository.findAll();
        
        if (produtos.isEmpty()) {
            throw new RuntimeException("Nenhum produto encontrado");
        }

        List<ProdutoResponse> respostaList = new ArrayList<>();

        for (Produto produto : produtos) {
            
            String urlTemporaria = s3Service.criarGetUrlTemporaria(produto.getCodigoImagem());

            ProdutoResponse response = new ProdutoResponse(
                produto.getId(),
                produto.getCodigoImagem(),
                urlTemporaria
            );

            respostaList.add(response);
        }
        
        return respostaList;
    }

    public void excluirProduto(String id) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        String codigoImagem = produto.getCodigoImagem();

        produtoRepository.deleteById(id);
        s3Service.excluirImagemS3(codigoImagem);
    }
    
}
