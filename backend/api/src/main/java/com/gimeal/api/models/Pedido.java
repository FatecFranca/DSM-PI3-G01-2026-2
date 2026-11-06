package com.gimeal.api.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Document(collection = "pedidos")
public class Pedido {

    @Id
    private String id;

    private Integer senha;
    private StatusPedidos status;
    private LocalDateTime criadoEm;
    private LocalDateTime iniciadoEm;
    private LocalDateTime prontoEm;
    private LocalDateTime entregueEm;
    private Integer tempoPreparoMin;
    private Double valorTotal;

    @NotBlank(message = "O nome do cliente é obrigatório.")
    private String nomeCliente;

    @NotNull(message = "O tipo de consumo é obrigatório.")
    private TipoConsumo tipoConsumo;

    @NotNull(message = "A forma de pagamento é obrigatória.")
    private FormaPagamento formaPagamento;

    @NotEmpty(message = "O pedido precisa ter ao menos um item.")
    private List<ItemPedido> itens = new ArrayList<>();

    private Avaliacao avaliacao;

    private Boolean avaliacaoPulada;

    public Pedido() {
    }

    public Pedido(
            String id,
            Integer senha,
            StatusPedidos status,
            LocalDateTime criadoEm,
            LocalDateTime iniciadoEm,
            LocalDateTime prontoEm,
            LocalDateTime entregueEm,
            Integer tempoPreparoMin,
            Double valorTotal,
            String nomeCliente,
            TipoConsumo tipoConsumo,
            FormaPagamento formaPagamento,
            List<ItemPedido> itens,
            Avaliacao avaliacao,
            Boolean avaliacaoPulada) {
        this.id = id;
        this.senha = senha;
        this.status = status;
        this.criadoEm = criadoEm;
        this.iniciadoEm = iniciadoEm;
        this.prontoEm = prontoEm;
        this.entregueEm = entregueEm;
        this.tempoPreparoMin = tempoPreparoMin;
        this.valorTotal = valorTotal;
        this.nomeCliente = nomeCliente;
        this.tipoConsumo = tipoConsumo;
        this.formaPagamento = formaPagamento;
        this.itens = itens;
        this.avaliacao = avaliacao;
        this.avaliacaoPulada = avaliacaoPulada;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getSenha() {
        return senha;
    }

    public void setSenha(Integer senha) {
        this.senha = senha;
    }

    public StatusPedidos getStatus() {
        return status;
    }

    public void setStatus(StatusPedidos status) {
        this.status = status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getIniciadoEm() {
        return iniciadoEm;
    }

    public void setIniciadoEm(LocalDateTime iniciadoEm) {
        this.iniciadoEm = iniciadoEm;
    }

    public LocalDateTime getProntoEm() {
        return prontoEm;
    }

    public void setProntoEm(LocalDateTime prontoEm) {
        this.prontoEm = prontoEm;
    }

    public LocalDateTime getEntregueEm() {
        return entregueEm;
    }

    public void setEntregueEm(LocalDateTime entregueEm) {
        this.entregueEm = entregueEm;
    }

    public Integer getTempoPreparoMin() {
        return tempoPreparoMin;
    }

    public void setTempoPreparoMin(Integer tempoPreparoMin) {
        this.tempoPreparoMin = tempoPreparoMin;
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

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    public Avaliacao getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }

    public Boolean getAvaliacaoPulada() {
        return avaliacaoPulada;
    }

    public void setAvaliacaoPulada(Boolean avaliacaoPulada) {
        this.avaliacaoPulada = avaliacaoPulada;
    }
}
