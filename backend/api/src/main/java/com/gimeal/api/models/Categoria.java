package com.gimeal.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "Categoria")
public class Categoria {

    @Id 
    private String id;

    private String nome;
    private String icone;

    public Categoria(){

    }

    public Categoria(
        String id,
        String nome,
        String icone) {
            this.id = id;
            this.nome = nome;
            this.icone = icone;
        }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIcone() {
        return icone;
    }

    public void setIcone(String icone) {
        this.icone = icone;
    }

        
    
}
