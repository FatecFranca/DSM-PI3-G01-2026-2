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

// Converte 33.9 (backend) para "33,90" (formato que as telas exibem).
export function paraTextoMoeda(valor) {
    return paraNumero(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// O backend devolve nomes já resolvidos (categoria, ingredientes, adicionais).
// O front espera os mesmos campos com outro nome em alguns casos.
function paraProdutoDoFront(produto) {
    return {
        id: produto.id,
        categoriaId: produto.categoriaId,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: paraTextoMoeda(produto.precoBase),
        imagem: produto.codigoImagem || '',
        ingredientes: produto.ingredientesBase || [],
        adicionais: produto.adicionais || [],
        tamanhos: produto.tamanhos || [],
        combos: produto.opcoesCombo || [],
    };
}

// O front manda ingredientes/adicionais/combos com nomes diferentes
// e o preço como texto. Aqui traduzimos para o ProdutoRequest do backend.
function paraProdutoDaApi(produto) {
    return {
        nome: produto.nome,
        precoBase: paraNumero(produto.preco),
        descricao: produto.descricao || '',
        categoriaId: produto.categoriaId,
        codigoImagem: produto.imagem || null,
        tamanhos: (produto.tamanhos || []).map((tamanho) => ({
            id: tamanho.id,
            nome: tamanho.nome,
            preco: paraNumero(tamanho.preco),
            ativo: Boolean(tamanho.ativo),
        })),
        // O backend aceita lista de nomes e cria o ingrediente se não existir
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

// O PUT devolve a entidade crua (sem os nomes resolvidos),
// então recarregamos pelo GET para devolver o formato que o front usa.
export async function atualizarProduto(id, produto) {
    await api.put(`/produtos/${id}`, paraProdutoDaApi(produto));
    const atualizado = await api.get(`/produtos/${id}`);
    return paraProdutoDoFront(atualizado);
}

export function excluirProduto(id) {
    return api.delete(`/produtos/${id}`);
}
