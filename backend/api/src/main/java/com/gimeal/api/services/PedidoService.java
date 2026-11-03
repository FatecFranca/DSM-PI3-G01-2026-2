package com.gimeal.api.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.models.AdicionalPedido;
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

    public List<Pedido> listarTodos() {
        return repository.findAll();
    }

    public Optional<Pedido> buscarPorId(String id) {
        return repository.findById(id);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Pedido não encontrado.");
        }
        repository.deleteById(id);
    }

    public Pedido salvar(Pedido pedido) {
        if (pedido.getId() == null) {
            prepararPedidoNovo(pedido);
        }
        return repository.save(pedido);
    }

    private void prepararPedidoNovo(Pedido pedido) {
        if (pedido.getItemPedido() == null || pedido.getItemPedido().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O pedido precisa ter ao menos um item");
        }

        pedido.setStatus(StatusPedidos.EM_PREPARO);
        pedido.setDataHora(LocalDateTime.now());

        double total = 0;
        for (ItemPedido item : pedido.getItemPedido()) {
            calcularItem(item);
            total = total + (item.getPrecoUnitario() * item.getQuantidade());
        }

        pedido.setValorTotal(arredondar(total));
    }

    private void calcularItem(ItemPedido item) {
        if (item.getProdutoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "produtoId é obrigatório");
        }
        if (item.getQuantidade() == null || item.getQuantidade() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Quantidade mínima é 1");
        }

        Produto produto = produtoRepository.findById(item.getProdutoId()).orElse(null);
        if (produto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Produto não encontrado: " + item.getProdutoId());
        }

        item.setProdutoId(produto.getId());

        double preco = precoDoProduto(produto, item.getTamanho());

        List<AdicionalPedido> adicionaisConfirmados = new ArrayList<>();
        if (item.getAdicionais() != null) {
            for (AdicionalPedido escolhido : item.getAdicionais()) {
                Ingrediente ingrediente = buscarAdicional(produto, escolhido.getIngredienteId());

                double precoAdicional = 0;
                if (ingrediente.getPreco() != null) {
                    precoAdicional = ingrediente.getPreco();
                }

                adicionaisConfirmados.add(
                        new AdicionalPedido(ingrediente.getId(), ingrediente.getNome(), precoAdicional));
                preco = preco + precoAdicional;
            }
        }

        ComboPedido comboConfirmado = null;
        if (item.getCombo() != null) {
            OpcaoCombo opcao = acharCombo(produto, item.getCombo().getNome());
            if (opcao == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Combo inválido: " + item.getCombo().getNome());
            }
            comboConfirmado = new ComboPedido(opcao.getNome(), opcao.getPreco(), nomesDoCombo(opcao));
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
        double precoBase = 0;
        if (produto.getPrecoBase() != null) {
            precoBase = produto.getPrecoBase();
        }

        if (nomeTamanho == null) {
            return precoBase;
        }

        for (Tamanhos tamanho : produto.getTamanhos()) {
            boolean mesmoNome = nomeTamanho.equals(tamanho.getNome());
            boolean estaAtivo = Boolean.TRUE.equals(tamanho.getAtivo());

            if (mesmoNome && estaAtivo) {
                if (tamanho.getPreco() != null && tamanho.getPreco() > 0) {
                    return tamanho.getPreco();
                }
                return precoBase;
            }
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Tamanho inválido: " + nomeTamanho);
    }

    private Ingrediente buscarAdicional(Produto produto, String ingredienteId) {
        if (ingredienteId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "ingredienteId é obrigatório no adicional");
        }

        Ingrediente ingrediente = ingredienteRepository.findById(ingredienteId).orElse(null);
        if (ingrediente == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ingrediente não encontrado: " + ingredienteId);
        }

        boolean oferecido = false;
        for (String idOferecido : produto.getIngredientesAdicionaisIds()) {
            if (idOferecido.equals(ingrediente.getId())) {
                oferecido = true;
            }
        }
        if (!oferecido) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Adicional não disponível para este produto: " + ingredienteId);
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
            Produto p = produtoRepository.findById(idProduto).orElse(null);
            if (p != null) {
                nomes.add(p.getNome());
            }
        }
        return nomes;
    }

    private double arredondar(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}