package com.gimeal.api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gimeal.api.dtos.IngredienteRequest;
import com.gimeal.api.dtos.ProdutoRequest;
import com.gimeal.api.dtos.ProdutoResponse;
import com.gimeal.api.dtos.ProdutoResponse.AdicionalResumo;
import com.gimeal.api.dtos.ProdutoResponse.CategoriaResumo;
import com.gimeal.api.dtos.ProdutoResponse.IngredienteResumo;
import com.gimeal.api.models.Categoria;
import com.gimeal.api.models.Ingrediente;
import com.gimeal.api.models.OpcaoCombo;
import com.gimeal.api.models.Produto;
import com.gimeal.api.models.Tamanhos;
import com.gimeal.api.repositories.CategoriaRepository;
import com.gimeal.api.repositories.IngredienteRepository;
import com.gimeal.api.repositories.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final IngredienteRepository ingredienteRepository;

    public ProdutoService(
            ProdutoRepository repository,
            CategoriaRepository categoriaRepository,
            IngredienteRepository ingredienteRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    public List<ProdutoResponse> listarTodos() {
        return repository.findAll().stream()
                .map(this::montarResposta)
                .toList();
    }

    public Optional<ProdutoResponse> buscarPorId(String id) {
        return repository.findById(id)
                .map(this::montarResposta);
    }

    public List<ProdutoResponse> listarPorCategoria(String categoriaId) {
        verificarCategoria(categoriaId);

        return repository.findByCategoriaId(categoriaId).stream()
                .map(this::montarResposta)
                .toList();
    }

    public Produto salvar(ProdutoRequest request) {
        verificarCategoria(request.categoriaId());

        Produto produto = new Produto();
        aplicarDados(produto, request);

        return repository.save(produto);
    }

    public Produto atualizar(String id, ProdutoRequest request) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado."));

        verificarCategoria(request.categoriaId());
        aplicarDados(produto, request);

        return repository.save(produto);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produto não encontrado.");
        }

        repository.deleteById(id);
    }

    private void aplicarDados(Produto produto, ProdutoRequest request) {
        produto.setNome(request.nome());
        produto.setPrecoBase(request.precoBase());
        produto.setDescricao(request.descricao());
        produto.setCategoriaId(request.categoriaId());
        produto.setCodigoImagem(request.codigoImagem());

        produto.setTamanhos(tratarTamanhos(request.tamanhos()));
        produto.setIngredientesBaseIds(tratarIngredientesBase(request.ingredientes()));
        produto.setIngredientesAdicionaisIds(tratarAdicionais(request.adicionais()));
        produto.setOpcoesCombo(tratarCombos(request.opcoesCombo()));
    }

    private List<Tamanhos> tratarTamanhos(List<Tamanhos> tamanhos) {
        if (tamanhos == null) {
            return new ArrayList<>();
        }

        for (Tamanhos tamanho : tamanhos) {
            if (tamanho.getId() == null || tamanho.getId().isBlank()) {
                tamanho.setId(UUID.randomUUID().toString());
            }
        }

        return tamanhos;
    }

    private List<String> tratarIngredientesBase(List<String> nomes) {
        List<String> ids = new ArrayList<>();

        if (nomes == null) {
            return ids;
        }

        for (String nome : nomes) {
            if (nome == null || nome.isBlank()) {
                continue;
            }

            Ingrediente ingrediente = ingredienteRepository
                    .findByNomeIgnoreCase(nome.trim())
                    .orElseGet(() -> ingredienteRepository.save(
                            new Ingrediente(null, nome.trim(), null, null)));

            ids.add(ingrediente.getId());
        }

        return ids;
    }

    private List<String> tratarAdicionais(List<IngredienteRequest> adicionais) {
        List<String> ids = new ArrayList<>();

        if (adicionais == null) {
            return ids;
        }

        for (IngredienteRequest adicional : adicionais) {
            if (adicional.nome() == null || adicional.nome().isBlank()) {
                continue;
            }

            if (adicional.preco() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "O adicional " + adicional.nome() + " precisa ter preço.");
            }

            Ingrediente ingrediente = ingredienteRepository
                    .findByNomeIgnoreCase(adicional.nome().trim())
                    .orElseGet(() -> ingredienteRepository.save(
                            new Ingrediente(null, adicional.nome().trim(), adicional.preco(), null)));

            ingrediente.setPreco(adicional.preco());
            ingredienteRepository.save(ingrediente);

            ids.add(ingrediente.getId());
        }

        return ids;
    }

    private List<OpcaoCombo> tratarCombos(List<OpcaoCombo> combos) {
        if (combos == null) {
            return new ArrayList<>();
        }

        for (OpcaoCombo combo : combos) {
            if (combo.getId() == null || combo.getId().isBlank()) {
                combo.setId(UUID.randomUUID().toString());
            }

            if (combo.getProdutosIds() != null) {
                for (String idProduto : combo.getProdutosIds()) {
                    if (!repository.existsById(idProduto)) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Produto do combo não encontrado: " + idProduto);
                    }
                }
            }
        }

        return combos;
    }

    private void verificarCategoria(String categoriaId) {
        if (categoriaId == null || categoriaId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O identificador da categoria é obrigatório.");
        }

        if (!categoriaRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Categoria não encontrada.");
        }
    }

    private ProdutoResponse montarResposta(Produto produto) {
        CategoriaResumo categoria = null;

        if (produto.getCategoriaId() != null) {
            Categoria encontrada = categoriaRepository
                    .findById(produto.getCategoriaId())
                    .orElse(null);

            if (encontrada != null) {
                categoria = new CategoriaResumo(
                        encontrada.getId(),
                        encontrada.getNome(),
                        encontrada.getIcone());
            }
        }

        List<IngredienteResumo> base = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesBaseIds()) {
            ingredienteRepository.findById(idIngrediente).ifPresent(ingrediente -> base.add(
                    new IngredienteResumo(ingrediente.getId(), ingrediente.getNome())));
        }

        List<AdicionalResumo> adicionais = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesAdicionaisIds()) {
            ingredienteRepository.findById(idIngrediente).ifPresent(ingrediente -> adicionais.add(
                    new AdicionalResumo(
                            ingrediente.getId(),
                            ingrediente.getNome(),
                            ingrediente.getPreco())));
        }

        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getPrecoBase(),
                produto.getDescricao(),
                produto.getCodigoImagem(),
                produto.getCategoriaId(),
                categoria,
                produto.getTamanhos(),
                base,
                adicionais,
                produto.getOpcoesCombo());
    }
}
