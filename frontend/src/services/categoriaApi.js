import { api } from './api';

function paraCategoriaDoFront(categoria) {
    return {
        id: categoria.id,
        texto: categoria.nome,
        icone: categoria.icone,
    };
}

function paraCategoriaDaApi(categoria) {
    return {
        nome: categoria.texto,
        icone: categoria.icone,
    };
}

export async function listarCategorias() {
    const categorias = await api.get('/categorias');
    return categorias.map(paraCategoriaDoFront);
}

export async function criarCategoria(texto, icone) {
    const criada = await api.post('/categorias', { nome: texto, icone });
    return paraCategoriaDoFront(criada);
}

export async function atualizarCategoria(id, texto, icone) {
    const atualizada = await api.put(`/categorias/${id}`, { nome: texto, icone });
    return paraCategoriaDoFront(atualizada);
}

export function excluirCategoria(id) {
    return api.delete(`/categorias/${id}`);
}
