package com.gimeal.api.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private String nomeCliente;
    private TipoConsumo tipoConsumo;
    private FormaPagamento formaPagamento;
    private List<ItemPedido> itemPedido = new ArrayList<>();

    public Pedido(){

    }

    public Pedido(
        String id,
        StatusPedidos status,
        LocalDateTime dataHora,
        Double valorTotal,
        String nomeCliente,
        TipoConsumo tipoConsumo,
        FormaPagamento formaPagamento,
        List<ItemPedido> itemPedido){
            this.id = id;
            this.status = status;
            this.dataHora = dataHora;
            this.valorTotal = valorTotal;
            this.nomeCliente = nomeCliente;
            this.tipoConsumo = tipoConsumo;
            this.formaPagamento = formaPagamento;
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

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public TipoConsumo getTipoConsumo() {
        return tipoConsumo;
    }

    public void setTipoConsumo(TipoConsumo tipoConsumo) {
        this.tipoConsumo = tipoConsumo;
    }

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public List<ItemPedido> getItemPedido() {
        return itemPedido;
    }

    public void setItemPedido(List<ItemPedido> itemPedido) {
        this.itemPedido = itemPedido;
    }

    

}