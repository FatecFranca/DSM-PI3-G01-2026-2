package com.gimeal.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.dtos.AvaliacaoRequest;
import com.gimeal.api.dtos.PedidoRequest;
import com.gimeal.api.dtos.PedidoResponse;
import com.gimeal.api.models.AdicionalPedido;
import com.gimeal.api.models.Avaliacao;
import com.gimeal.api.models.ComboPedido;
import com.gimeal.api.models.Ingrediente;
import com.gimeal.api.models.ItemPedido;
import com.gimeal.api.models.OpcaoCombo;
import com.gimeal.api.models.Pedido;
import com.gimeal.api.models.Produto;
import com.gimeal.api.models.StatusPedidos;
import com.gimeal.api.models.Tamanhos;
import com.gimeal.api.repositories.IngredienteRepository;
import com.gimeal.api.repositories.PedidoRepository;
import com.gimeal.api.repositories.ProdutoRepository;

@Service
public class PedidoService {

    private static final int TEMPO_PREPARO_PADRAO = 15;

    private final PedidoRepository repository;
    private final ProdutoRepository produtoRepository;
    private final IngredienteRepository ingredienteRepository;

    public PedidoService(
            PedidoRepository repository,
            ProdutoRepository produtoRepository,
            IngredienteRepository ingredienteRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    public List<PedidoResponse> listarTodos() {
        return repository.findAllByOrderByCriadoEmDesc().stream()
                .map(this::montarResposta)
                .toList();
    }

    // Abas da cozinha: Fila, Ativos (preparando + pronto) e Entregues.
    public List<PedidoResponse> listarPorStatus(List<StatusPedidos> status) {
        if (status == null || status.isEmpty()) {
            return listarTodos();
        }

        return repository.findByStatusInOrderByCriadoEmAsc(status).stream()
                .map(this::montarResposta)
                .toList();
    }

    public List<PedidoResponse> listarDeHoje() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();

        return repository.findByCriadoEmAfterOrderByCriadoEmDesc(inicioDoDia).stream()
                .map(this::montarResposta)
                .toList();
    }

    public Optional<PedidoResponse> buscarPorId(String id) {
        return repository.findById(id)
                .map(this::montarResposta);
    }

    public Pedido criar(PedidoRequest request) {
        Pedido pedido = new Pedido();

        pedido.setNomeCliente(request.nomeCliente());
        pedido.setTipoConsumo(request.tipoConsumo());
        pedido.setFormaPagamento(request.formaPagamento());
        pedido.setItens(request.itens());

        pedido.setSenha(proximaSenhaDoDia());
        pedido.setStatus(StatusPedidos.FILA);
        pedido.setCriadoEm(LocalDateTime.now());
        pedido.setTempoPreparoMin(TEMPO_PREPARO_PADRAO);
        pedido.setValorTotal(calcularTotal(request.itens()));

        return repository.save(pedido);
    }

    private Integer proximaSenhaDoDia() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();

        return repository.findFirstByCriadoEmAfterOrderBySenhaDesc(inicioDoDia)
                .map(ultimo -> ultimo.getSenha() + 1)
                .orElse(1);
    }

    private Double calcularTotal(List<ItemPedido> itens) {
        if (itens == null || itens.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O pedido precisa ter ao menos um item.");
        }

        double total = 0;

        for (ItemPedido item : itens) {
            calcularItem(item);
            total = total + (item.getPrecoUnitario() * item.getQuantidade());
        }

        return arredondar(total);
    }

    private void calcularItem(ItemPedido item) {
        if (item.getProdutoId() == null || item.getProdutoId().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O produto do item é obrigatório.");
        }

        if (item.getQuantidade() == null || item.getQuantidade() < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A quantidade mínima é 1.");
        }

        Produto produto = produtoRepository.findById(item.getProdutoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Produto não encontrado: " + item.getProdutoId()));

        double preco = precoDoProduto(produto, item.getTamanho());

        List<AdicionalPedido> adicionaisConfirmados = new ArrayList<>();

        if (item.getAdicionais() != null) {
            for (AdicionalPedido escolhido : item.getAdicionais()) {
                Ingrediente ingrediente = resolverAdicional(produto, escolhido);

                double precoAdicional = ingrediente.getPreco() == null
                        ? 0
                        : ingrediente.getPreco();

                adicionaisConfirmados.add(new AdicionalPedido(
                        ingrediente.getId(),
                        ingrediente.getNome(),
                        precoAdicional));

                preco = preco + precoAdicional;
            }
        }

        ComboPedido comboConfirmado = null;

        if (item.getCombo() != null) {
            OpcaoCombo opcao = acharCombo(produto, item.getCombo().getNome());

            if (opcao == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Combo inválido: " + item.getCombo().getNome());
            }

            comboConfirmado = new ComboPedido(
                    opcao.getNome(),
                    opcao.getPreco(),
                    nomesDoCombo(opcao));

            if (opcao.getPreco() != null) {
                preco = preco + opcao.getPreco();
            }
        }

        item.setNomeProduto(produto.getNome());
        item.setAdicionais(adicionaisConfirmados);
        item.setCombo(comboConfirmado);
        item.setPrecoUnitario(arredondar(preco));

        if (item.getIngredientesRemovidos() == null) {
            item.setIngredientesRemovidos(new ArrayList<>());
        }
    }

    private double precoDoProduto(Produto produto, String nomeTamanho) {
        double precoBase = produto.getPrecoBase() == null ? 0 : produto.getPrecoBase();

        if (nomeTamanho == null || nomeTamanho.isBlank()) {
            return precoBase;
        }

        for (Tamanhos tamanhos : produto.getTamanhos()) {
            boolean mesmoNome = nomeTamanho.equals(tamanhos.getNome());
            boolean estaAtivo = Boolean.TRUE.equals(tamanhos.getAtivo());

            if (mesmoNome && estaAtivo) {
                if (tamanhos.getPreco() != null && tamanhos.getPreco() > 0) {
                    return tamanhos.getPreco();
                }

                return precoBase;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Tamanho inválido: " + nomeTamanho);
    }

    private Ingrediente resolverAdicional(Produto produto, AdicionalPedido escolhido) {
        Ingrediente ingrediente = null;

        if (escolhido.getIngredienteId() != null && !escolhido.getIngredienteId().isBlank()) {
            ingrediente = ingredienteRepository.findById(escolhido.getIngredienteId())
                    .orElse(null);
        }

        if (ingrediente == null && escolhido.getNome() != null && !escolhido.getNome().isBlank()) {
            ingrediente = ingredienteRepository.findByNomeIgnoreCase(escolhido.getNome().trim())
                    .orElse(null);
        }

        if (ingrediente == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Adicional não encontrado: "
                            + (escolhido.getNome() != null ? escolhido.getNome()
                                    : escolhido.getIngredienteId()));
        }

        if (!produto.getIngredientesAdicionaisIds().contains(ingrediente.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Adicional não disponível para este produto: " + ingrediente.getNome());
        }

        return ingrediente;
    }

    private OpcaoCombo acharCombo(Produto produto, String nome) {
        for (OpcaoCombo opcao : produto.getOpcoesCombo()) {
            if (opcao.getNome() != null && opcao.getNome().equals(nome)) {
                return opcao;
            }
        }

        return null;
    }

    private List<String> nomesDoCombo(OpcaoCombo opcao) {
        List<String> nomes = new ArrayList<>();

        for (String idProduto : opcao.getProdutosIds()) {
            produtoRepository.findById(idProduto)
                    .ifPresent(produto -> nomes.add(produto.getNome()));
        }

        return nomes;
    }

    public PedidoResponse atualizarStatus(String id, StatusPedidos novoStatus) {
        Pedido pedido = buscarEntidade(id);

        StatusPedidos atual = pedido.getStatus();

        if (atual == StatusPedidos.ENTREGUE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido já foi entregue e não pode mudar de status.");
        }

        if (atual == StatusPedidos.CANCELADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido foi cancelado e não pode mudar de status.");
        }

        if (!transicaoPermitida(atual, novoStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é possível mudar de " + atual + " para " + novoStatus + ".");
        }

        pedido.setStatus(novoStatus);

        switch (novoStatus) {
            case PREPARANDO -> pedido.setIniciadoEm(LocalDateTime.now());
            case PRONTO -> pedido.setProntoEm(LocalDateTime.now());
            case ENTREGUE -> pedido.setEntregueEm(LocalDateTime.now());
            case FILA -> {
                pedido.setIniciadoEm(null);
                pedido.setProntoEm(null);
            }
            default -> {
            }
        }

        return montarResposta(repository.save(pedido));
    }

    private boolean transicaoPermitida(StatusPedidos atual, StatusPedidos novo) {
        if (atual == null) {
            atual = StatusPedidos.FILA;
        }

        return switch (atual) {
            case FILA -> novo == StatusPedidos.PREPARANDO || novo == StatusPedidos.CANCELADO;
            case PREPARANDO -> novo == StatusPedidos.PRONTO
                    || novo == StatusPedidos.FILA
                    || novo == StatusPedidos.CANCELADO;
            case PRONTO -> novo == StatusPedidos.ENTREGUE || novo == StatusPedidos.CANCELADO;
            default -> false;
        };
    }

    public PedidoResponse atualizarTempoPreparo(String id, Integer tempoPreparoMin) {
        Pedido pedido = buscarEntidade(id);

        pedido.setTempoPreparoMin(tempoPreparoMin);

        return montarResposta(repository.save(pedido));
    }

    public PedidoResponse avaliar(String id, AvaliacaoRequest request) {
        Pedido pedido = buscarEntidade(id);

        if (pedido.getStatus() != StatusPedidos.ENTREGUE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Só é possível avaliar um pedido já entregue.");
        }

        if (pedido.getAvaliacao() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido já foi avaliado.");
        }

        pedido.setAvaliacao(new Avaliacao(
                request.nota(),
                request.comentario(),
                LocalDateTime.now()));

        return montarResposta(repository.save(pedido));
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Pedido não encontrado.");
        }

        repository.deleteById(id);
    }

    private Pedido buscarEntidade(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado."));
    }

    private double arredondar(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }

    private PedidoResponse montarResposta(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getSenha(),
                pedido.getStatus(),
                pedido.getCriadoEm(),
                pedido.getIniciadoEm(),
                pedido.getProntoEm(),
                pedido.getEntregueEm(),
                pedido.getTempoPreparoMin(),
                pedido.getValorTotal(),
                pedido.getNomeCliente(),
                pedido.getTipoConsumo(),
                pedido.getFormaPagamento(),
                pedido.getItens(),
                pedido.getAvaliacao(),
                pedido.getAvaliacaoPulada());
    }
}
