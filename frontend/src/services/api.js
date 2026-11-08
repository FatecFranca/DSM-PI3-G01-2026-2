// Endereço único da API. Se mudar a porta do Spring, muda só aqui.
const URL_BASE = 'http://localhost:8888';

// Erro lançado quando a API responde com status >= 400.
// Guarda o status e o corpo para a tela conseguir mostrar a mensagem
// que o backend mandou (ex.: "Não é possível excluir uma categoria com produtos vinculados.")
export class ErroApi extends Error {
    constructor(mensagem, status, corpo) {
        super(mensagem);
        this.name = 'ErroApi';
        this.status = status;
        this.corpo = corpo;
    }
}

// Centraliza o fetch para não repetir checagem de resposta
// em cada função de domínio.
export async function requisitar(caminho, opcoes = {}) {
    const eUmArquivo = opcoes.body instanceof FormData
    const resposta = await fetch(`${URL_BASE}${caminho}`, {
        ...opcoes,
        headers: {
            ...(eUmArquivo ? {} : {'Content-Type': 'application/json'}),
            ...(opcoes.headers || {}),
        },
    });

    // 204 (DELETE) e 200 sem corpo não têm o que ler.
    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    const corpo = texto ? tentarJson(texto) : null;

    if (!resposta.ok) {
        throw new ErroApi(
            extrairMensagem(corpo) || `Erro ${resposta.status}`,
            resposta.status,
            corpo
        );
    }

    return corpo;
}

// Quando o Spring devolve uma página de erro HTML (em vez de JSON),
// JSON.parse estouraria e esconderia o erro real. Aqui devolvemos null
// e o erro sobe com a mensagem genérica de status.
function tentarJson(texto) {
    try {
        return JSON.parse(texto);
    } catch {
        return null;
    }
}

// O backend responde de dois jeitos:
// - erro de validação: { "campo": ["mensagem", ...] }   (ValidationExceptionHandler)
// - erro de negócio:   { status, erro, mensagem, ... }  (ApiExceptionHandler)
function extrairMensagem(corpo) {
    if (!corpo || typeof corpo !== 'object') return null;

    if (typeof corpo.mensagem === 'string') {
        return corpo.mensagem;
    }

    // Primeira mensagem de validação de campo
    for (const valor of Object.values(corpo)) {
        if (Array.isArray(valor) && valor.length > 0) {
            return valor[0];
        }
    }

    return null;
}

export const api = {
    get: (caminho) => requisitar(caminho),
    post: (caminho, dados) => requisitar(caminho, { method: 'POST', body: JSON.stringify(dados) }),
    upload: (caminho, formData) => requisitar(caminho, {method: 'PUT', body: formData}),
    put: (caminho, dados) => requisitar(caminho, { method: 'PUT', body: JSON.stringify(dados) }),
    patch: (caminho, dados) => requisitar(caminho, { method: 'PATCH', body: JSON.stringify(dados) }),
    delete: (caminho) => requisitar(caminho, { method: 'DELETE' }),
};
