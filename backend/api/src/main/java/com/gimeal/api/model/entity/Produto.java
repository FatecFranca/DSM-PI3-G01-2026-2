package com.gimeal.api.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collation = "produtos")
public class Produto {
    
    @Id 
    private String id;

    private String codigoImagem;

    
    public Produto() {
    }

    public Produto(String codigoImagem) {
        this.codigoImagem = codigoImagem;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigoImagem() {
        return codigoImagem;
    }

    public void setCodigoImagem(String codigoImagem) {
        this.codigoImagem = codigoImagem;
    }

}
