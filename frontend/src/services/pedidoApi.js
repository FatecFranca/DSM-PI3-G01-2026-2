import { api } from './api';

const STATUS_PARA_API = {
    fila: 'FILA',
    preparando: 'PREPARANDO',
    pronto: 'PRONTO',
    entregue: 'ENTREGUE',
    cancelado: 'CANCELADO',
};

const STATUS_PARA_FRONT = {
    FILA: 'fila',
    PREPARANDO: 'preparando',
    PRONTO: 'pronto',
    ENTREGUE: 'entregue',
    CANCELADO: 'cancelado',
};

function paraMillis(dataHora) {
    if (!dataHora) return null;
    return new Date(dataHora).getTime();
}

function paraPedidoDoFront(pedido) {
    return {
        id: pedido.id,
        senha: pedido.senha,
        status: STATUS_PARA_FRONT[pedido.status] || 'fila',
        criadoEm: paraMillis(pedido.criadoEm),
        iniciadoEm: paraMillis(pedido.iniciadoEm),
        prontoEm: paraMillis(pedido.prontoEm),
        entregueEm: paraMillis(pedido.entregueEm),
        tempoPreparoMin: pedido.tempoPreparoMin ?? 15,
        nomeCliente: pedido.nomeCliente,
        tipoConsumo: pedido.tipoConsumo,
        formaPagamento: pedido.formaPagamento,
        itens: pedido.itens || [],
        total: pedido.valorTotal,
        avaliacao: pedido.avaliacao || null,
        avaliacaoPulada: pedido.avaliacaoPulada || false,
    };
}

function paraItemDaApi(item) {
    return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        tamanho: item.tamanho || null,
        ingredientesRemovidos: item.ingredientesRemovidos || [],
        adicionais: (item.adicionais || []).map((adicional) => ({
            nome: adicional.nome,
            preco: adicional.preco,
        })),
        combo: item.combo
            ? {
                    nome: item.combo.nome,
                    preco: item.combo.preco,
                    itens: item.combo.itens || [],
                }
            : null,
    };
}

export async function listarPedidos(filtroStatus) {
    const query = filtroStatus && filtroStatus.length > 0
        ? `?status=${filtroStatus.map((s) => STATUS_PARA_API[s]).join(',')}`
        : '';

    const pedidos = await api.get(`/pedidos${query}`);
    return pedidos.map(paraPedidoDoFront);
}

export async function listarPedidosDeHoje() {
    const pedidos = await api.get('/pedidos/hoje');
    return pedidos.map(paraPedidoDoFront);
}

export async function buscarPedido(id) {
    const pedido = await api.get(`/pedidos/${id}`);
    return paraPedidoDoFront(pedido);
}

export async function criarPedido(dadosPedido) {
    const corpo = {
        nomeCliente: dadosPedido.nomeCliente,
        tipoConsumo: String(dadosPedido.tipoConsumo || '').toUpperCase(),
        formaPagamento: String(dadosPedido.formaPagamento || '').toUpperCase(),
        itens: (dadosPedido.itens || []).map(paraItemDaApi),
    };

    const criado = await api.post('/pedidos', corpo);
    return paraPedidoDoFront(criado);
}

export async function atualizarStatusPedido(id, status) {
    const atualizado = await api.patch(`/pedidos/${id}/status`, {
        status: STATUS_PARA_API[status],
    });

    return paraPedidoDoFront(atualizado);
}

export async function atualizarTempoPreparo(id, tempoPreparoMin) {
    const atualizado = await api.patch(`/pedidos/${id}/tempo-preparo`, {
        tempoPreparoMin,
    });

    return paraPedidoDoFront(atualizado);
}

export async function avaliarPedido(id, nota, comentario) {
    const atualizado = await api.post(`/pedidos/${id}/avaliacao`, {
        nota,
        comentario: comentario || null,
    });

    return paraPedidoDoFront(atualizado);
}

export function excluirPedido(id) {
    return api.delete(`/pedidos/${id}`);
}
