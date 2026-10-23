package com.gimeal.api.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pedido")
public class Pedido {
    
    @Id 
    private String id;

    private StatusPedidos status;
    private LocalDateTime dataHora;
    private Double valorTotal;
    private List<ItemPedido> itemPedido;

    public Pedido(){

    }

    public Pedido(
        String id,
        StatusPedidos status,
        LocalDateTime dataHora,
        Double valorTotal,
        List<ItemPedido> itemPedido){
            this.id = id;
            this.status = status;
            this.dataHora = dataHora;
            this.valorTotal = valorTotal;
            this.itemPedido = itemPedido;
        }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public StatusPedidos getStatus() {
        return status;
    }

    public void setStatus(StatusPedidos status) {
        this.status = status;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<ItemPedido> getItemPedido() {
        return itemPedido;
    }

    public void setItemPedido(List<ItemPedido> itemPedido) {
        this.itemPedido = itemPedido;
    }

        

}
