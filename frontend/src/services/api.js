// Endereço único da API. Se mudar a porta do Spring, muda só aqui.
const URL_BASE = 'http://localhost:8888';

export class ErroApi extends Error {
    constructor(mensagem, status, corpo) {
        super(mensagem);
        this.name = 'ErroApi';
        this.status = status;
        this.corpo = corpo;
    }
}

export async function requisitar(caminho, opcoes = {}) {
    const eUmArquivo = opcoes.body instanceof FormData
    const resposta = await fetch(`${URL_BASE}${caminho}`, {
        ...opcoes,
        headers: {
            ...(eUmArquivo ? {} : {'Content-Type': 'application/json'}),
            ...(opcoes.headers || {}),
        },
    });

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

function tentarJson(texto) {
    try {
        return JSON.parse(texto);
    } catch {
        return null;
    }
}

function extrairMensagem(corpo) {
    if (!corpo || typeof corpo !== 'object') return null;

    if (typeof corpo.mensagem === 'string') {
        return corpo.mensagem;
    }

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
