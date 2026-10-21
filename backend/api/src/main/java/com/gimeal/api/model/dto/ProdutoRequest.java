package com.gimeal.api.model.dto;

import org.springframework.web.multipart.MultipartFile;

public record ProdutoRequest(
    String codigoImagem,
    MultipartFile imagem) {
    
}
