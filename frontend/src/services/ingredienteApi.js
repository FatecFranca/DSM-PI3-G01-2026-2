import { api } from './api';

// O ModalPrato cria ingredientes e adicionais dentro do próprio modal.
// O backend já cria o ingrediente automaticamente quando ele vem junto
// no ProdutoRequest, então este arquivo serve para consulta e para
// os casos em que o admin quiser mexer direto na lista.
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
