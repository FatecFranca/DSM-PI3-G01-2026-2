import { api } from './api';

export function paraNumero(valor) {
    if (typeof valor === 'number') return valor;

    const texto = String(valor ?? '').trim();
    if (!texto) return 0;

    const normalizado = texto.includes(',')
        ? texto.replace(/\./g, '').replace(',', '.')
        : texto;

    const numero = parseFloat(normalizado.replace(/[^\d.-]/g, ''));
    return Number.isNaN(numero) ? 0 : numero;
}

export function paraTextoMoeda(valor) {
    return paraNumero(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function paraProdutoDoFront(produto) {
    return {
        id: produto.id,
        categoriaId: produto.categoriaId,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: paraTextoMoeda(produto.precoBase),
        imagem: produto.urlTemporariaImagem || '',
        ingredientes: produto.ingredientesBase || [],
        adicionais: produto.adicionais || [],
        tamanhos: produto.tamanhos || [],
        combos: produto.opcoesCombo || [],
    };
}

function paraProdutoDaApi(produto) {
    return {
        nome: produto.nome,
        precoBase: paraNumero(produto.preco),
        descricao: produto.descricao || '',
        categoriaId: produto.categoriaId,
        tamanhos: (produto.tamanhos || []).map((tamanho) => ({
            id: tamanho.id,
            nome: tamanho.nome,
            preco: paraNumero(tamanho.preco),
            ativo: Boolean(tamanho.ativo),
        })),
        ingredientes: (produto.ingredientes || []).map((item) => item.nome),
        adicionais: (produto.adicionais || []).map((item) => ({
            nome: item.nome,
            preco: paraNumero(item.preco),
        })),
        opcoesCombo: (produto.combos || []).map((combo) => ({
            id: combo.id,
            nome: combo.nome,
            preco: paraNumero(combo.preco),
            produtosIds: combo.produtosIds || [],
        })),
    };
}

export async function listarProdutos() {
    const produtos = await api.get('/produtos');
    return produtos.map(paraProdutoDoFront);
}

export async function listarProdutosPorCategoria(categoriaId) {
    const produtos = await api.get(`/produtos/categoria/${categoriaId}`);
    return produtos.map(paraProdutoDoFront);
}

export async function criarProduto(produto) {
    const criado = await api.post('/produtos', paraProdutoDaApi(produto));
    return criado;
}

export async function atualizarProduto(id, produto) {
    await api.put(`/produtos/${id}`, paraProdutoDaApi(produto));
    const atualizado = await api.get(`/produtos/${id}`);
    return paraProdutoDoFront(atualizado);
}

export function excluirProduto(id) {
    return api.delete(`/produtos/${id}`);
}

export function enviarImagem(id, arquivo) {
    const formData = new FormData();
    formData.append('imagem', arquivo);
    return api.upload(`/produtos/${id}/imagem`, formData);
}
