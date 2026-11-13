import { api } from './api';

export function listarIngredientes() {
    return api.get('/ingredientes');
}

export function criarIngrediente(nome, preco, quantidade) {
    return api.post('/ingredientes', { nome, preco, quantidade });
}

export function atualizarIngrediente(id, nome, preco, quantidade) {
    return api.put(`/ingredientes/${id}`, { nome, preco, quantidade });
}

export function excluirIngrediente(id) {
    return api.delete(`/ingredientes/${id}`);
}
