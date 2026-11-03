package com.gimeal.api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    private final IngredienteRepository ingredienteRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(
            ProdutoRepository repository,
            IngredienteRepository ingredienteRepository,
            CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.ingredienteRepository = ingredienteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Optional<Produto> buscarPorId(String id) {
        return repository.findById(id);
    }

    public void excluir(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produto não encontrado.");
        }
        repository.deleteById(id);
    }

    public Produto salvar(Produto produto) {
        garantirListas(produto);
        validarReferencias(produto);
        gerarIdsInternos(produto);
        return repository.save(produto);
    }

    private void garantirListas(Produto produto) {
        if (produto.getTamanhos() == null) {
            produto.setTamanhos(new ArrayList<>());
        }
        if (produto.getIngredientesBaseIds() == null) {
            produto.setIngredientesBaseIds(new ArrayList<>());
        }
        if (produto.getIngredientesAdicionaisIds() == null) {
            produto.setIngredientesAdicionaisIds(new ArrayList<>());
        }
        if (produto.getOpcoesCombo() == null) {
            produto.setOpcoesCombo(new ArrayList<>());
        }
    }

    private void validarReferencias(Produto produto) {
        if (produto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(produto.getCategoriaId()).orElse(null);
            if (categoria == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Categoria não encontrada: " + produto.getCategoriaId());
            }
            produto.setCategoriaId(categoria.getId());
        }

        List<String> idsBase = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesBaseIds()) {
            Ingrediente ingrediente = ingredienteRepository.findById(idIngrediente).orElse(null);
            if (ingrediente == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Ingrediente não encontrado: " + idIngrediente);
            }
            idsBase.add(ingrediente.getId());
        }
        produto.setIngredientesBaseIds(idsBase);

        List<String> idsAdicionais = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesAdicionaisIds()) {
            Ingrediente ingrediente = ingredienteRepository.findById(idIngrediente).orElse(null);
            if (ingrediente == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Ingrediente não encontrado: " + idIngrediente);
            }
            if (ingrediente.getPreco() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O ingrediente " + ingrediente.getNome() + " não tem preço e não pode ser adicional");
            }
            idsAdicionais.add(ingrediente.getId());
        }
        produto.setIngredientesAdicionaisIds(idsAdicionais);

        for (OpcaoCombo opcao : produto.getOpcoesCombo()) {
            List<String> idsProdutos = new ArrayList<>();
            if (opcao.getProdutosIds() != null) {
                for (String idProduto : opcao.getProdutosIds()) {
                    Produto doCombo = repository.findById(idProduto).orElse(null);
                    if (doCombo == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Produto do combo não encontrado: " + idProduto);
                    }
                    idsProdutos.add(doCombo.getId());
                }
            }
            opcao.setProdutosIds(idsProdutos);
        }
    }

    private void gerarIdsInternos(Produto produto) {
        for (Tamanhos tamanho : produto.getTamanhos()) {
            if (tamanho.getId() == null || tamanho.getId().isBlank()) {
                tamanho.setId(UUID.randomUUID().toString());
            }
        }
        for (OpcaoCombo opcao : produto.getOpcoesCombo()) {
            if (opcao.getId() == null || opcao.getId().isBlank()) {
                opcao.setId(UUID.randomUUID().toString());
            }
        }
    }

    public List<ProdutoResponse> listarCardapio() {
        List<ProdutoResponse> resposta = new ArrayList<>();
        for (Produto produto : repository.findAll()) {
            resposta.add(montarResposta(produto));
        }
        return resposta;
    }

    public Optional<ProdutoResponse> buscarDetalhe(String id) {
        Produto produto = repository.findById(id).orElse(null);
        if (produto == null) {
            return Optional.empty();
        }
        return Optional.of(montarResposta(produto));
    }

    private ProdutoResponse montarResposta(Produto produto) {
        CategoriaResumo categoria = null;
        if (produto.getCategoriaId() != null) {
            Categoria c = categoriaRepository.findById(produto.getCategoriaId()).orElse(null);
            if (c != null) {
                categoria = new CategoriaResumo(c.getId(), c.getNome(), c.getIcone());
            }
        }

        List<IngredienteResumo> base = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesBaseIds()) {
            Ingrediente ing = ingredienteRepository.findById(idIngrediente).orElse(null);
            if (ing != null) {
                base.add(new IngredienteResumo(ing.getId(), ing.getNome()));
            }
        }

        List<AdicionalResumo> adicionais = new ArrayList<>();
        for (String idIngrediente : produto.getIngredientesAdicionaisIds()) {
            Ingrediente ing = ingredienteRepository.findById(idIngrediente).orElse(null);
            if (ing != null) {
                adicionais.add(new AdicionalResumo(ing.getId(), ing.getNome(), ing.getPreco()));
            }
        }

        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getPrecoBase(),
                produto.getDescricao(),
                produto.getCodigoImagem(),
                categoria,
                produto.getTamanhos(),
                base,
                adicionais,
                produto.getOpcoesCombo());
    }
}