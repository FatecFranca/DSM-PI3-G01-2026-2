package com.gimeal.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gimeal.api.dtos.AvaliacaoRequest;
import com.gimeal.api.dtos.PedidoRequest;
import com.gimeal.api.dtos.PedidoResponse;
import com.gimeal.api.dtos.StatusRequest;
import com.gimeal.api.dtos.TempoPreparoRequest;
import com.gimeal.api.models.Pedido;
import com.gimeal.api.models.StatusPedidos;
import com.gimeal.api.services.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PedidoResponse> listarTodos(
            @RequestParam(required = false) List<StatusPedidos> status) {
        return service.listarPorStatus(status);
    }

    @GetMapping("/hoje")
    public List<PedidoResponse> listarDeHoje() {
        return service.listarDeHoje();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@Valid @RequestBody PedidoRequest request) {
        Pedido pedidoSalvo = service.criar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(pedidoSalvo);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponse> atualizarStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusRequest request) {

        return ResponseEntity.ok(service.atualizarStatus(id, request.status()));
    }

    // Botoes de +/- 5 min na cozinha.
    @PatchMapping("/{id}/tempo-preparo")
    public ResponseEntity<PedidoResponse> atualizarTempoPreparo(
            @PathVariable String id,
            @Valid @RequestBody TempoPreparoRequest request) {

        return ResponseEntity.ok(service.atualizarTempoPreparo(id, request.tempoPreparoMin()));
    }

    // Avaliacao por estrelas do cliente, depois que o pedido foi entregue.
    @PostMapping("/{id}/avaliacao")
    public ResponseEntity<PedidoResponse> avaliar(
            @PathVariable String id,
            @Valid @RequestBody AvaliacaoRequest request) {

        return ResponseEntity.ok(service.avaliar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
