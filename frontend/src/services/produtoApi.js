// Requisição da API para os produtos
const API = 'http://localhost:8888/api/produto';

function montarFormData(arquivo) {
    const formData = new FormData();

    formData.append('imagem', arquivo);
    return formData;
}

export async function listarTodos() {
    const resposta = await fetch(API);

    if (!resposta.ok) return [];

    return resposta.json();
}

export async function enviarImagem(arquivo) {
    const resposta = await fetch(API, {
        method: 'POST',
        body: montarFormData(arquivo)
    });
    if (!resposta.ok) throw new Error('Erro ao enviar imagem');

    return resposta.json();
}

export async function atualzarImagem(id, arquivo) {
    const resposta = await fetch(`${API}/${id}`, {
        method: 'PUT',
        body: montarFormData(arquivo)
    });

    if (!resposta.ok) throw new Error('Erro ao atualizar imagem');

    return resposta.json();
}

export async function exlcuirImagem(id) {
    const resposta = await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    if (!resposta.ok) throw new Error('Erro ao excluir imagem');
};