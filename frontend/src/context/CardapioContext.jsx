import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  listarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria as excluirCategoriaNaApi,
} from "../services/categoriaApi";

import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto as excluirProdutoNaApi,
} from "../services/produtoApi";

import {
  listarPedidos,
  criarPedido,
  atualizarStatusPedido,
  atualizarTempoPreparo,
  avaliarPedido,
} from "../services/pedidoApi"; 

const CardapioContext = createContext(null);

// Chave do localStorage que guarda só os IDs dos pedidos deste aparelho.
// O pedido em si fica no Mongo; aqui é apenas "quais são meus".
const CHAVE_MEUS_PEDIDOS = "meusPedidosIds";

function carregarMeusPedidos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_MEUS_PEDIDOS) || "[]");
  } catch {
    return [];
  }
}

export function CardapioProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estado que armazena a url das imagens  //////////////////////////////////////
  const [urlsImagens, setUrlsImagens] = useState({}); 

  // Mantidos em memória: o carrinho é local, não vai para o banco
  // até o cliente fechar o pedido no checkout.
  const [meusIds, setMeusIds] = useState(carregarMeusPedidos); //////////////////////////////////

  // ---------------------------------------------------------------
  // Carga inicial: categorias, produtos e pedidos vêm da API
  // ---------------------------------------------------------------
  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const [categoriasDaApi, produtosDaApi, pedidosDaApi] = await Promise.all([
        listarCategorias(),
        listarProdutos(),
        listarPedidos(),
      ]);

      setCategorias(categoriasDaApi);
      setProdutos(produtosDaApi);
      setPedidos(pedidosDaApi);
    } catch (falha) {
      setErro(falha.message || "Não foi possível carregar o cardápio.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  // A cozinha precisa ver pedido novo sem apertar F5.
  // Um polling simples resolve sem precisar de WebSocket.
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const pedidosDaApi = await listarPedidos();
        setPedidos(pedidosDaApi);
      } catch {
        // se a API cair, mantém o que já está na tela
      }
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAVE_MEUS_PEDIDOS, JSON.stringify(meusIds));
  }, [meusIds]);

  // ---------------------------------------------------------------
  // Categorias
  // ---------------------------------------------------------------
  async function adicionarCategoria(texto, icone) {
    const criada = await criarCategoria(texto, icone);
    setCategorias((lista) => [...lista, criada]);
    return criada;
  }

  async function editarCategoria(id, texto, icone) {
    const atualizada = await atualizarCategoria(id, texto, icone);

    setCategorias((lista) =>
      lista.map((categoria) => (categoria.id === id ? atualizada : categoria))
    );

    return atualizada;
  }

  // O backend recusa excluir categoria com produtos vinculados.
  // O front antigo apagava os produtos junto; agora quem decide é a API,
  // e o erro volta para a tela mostrar.
  async function excluirCategoria(id) {
    await excluirCategoriaNaApi(id);

    setCategorias((lista) => lista.filter((categoria) => categoria.id !== id));
    setProdutos((lista) => lista.filter((produto) => produto.categoriaId !== id));
  }

  // ---------------------------------------------------------------
  // Produtos
  // ---------------------------------------------------------------
  async function adicionarProduto(produto) {
    const criado = await criarProduto(produto);
    await recarregar();
    return criado;
  }

  async function editarProduto(id, dadosAtualizados) {
    const atualizado = await atualizarProduto(id, dadosAtualizados);

    setProdutos((lista) =>
      lista.map((produto) => (produto.id === id ? atualizado : produto))
    );

    return atualizado;
  }

  async function excluirProduto(id) {
    await excluirProdutoNaApi(id);
    setProdutos((lista) => lista.filter((produto) => produto.id !== id));
  }

  // ---------------------------------------------------------------
  // Pedidos
  // ---------------------------------------------------------------
  async function adicionarPedido(dadosPedido) {
    const criado = await criarPedido(dadosPedido);

    setPedidos((lista) => [...lista, criado]);
    setMeusIds((lista) => [...lista, criado.id]);

    return criado;
  }

  async function atualizarPedido(id, dadosAtualizados) {
    const atual = pedidos.find((pedido) => pedido.id === id);

    // A cozinha manda { status } ou { tempoPreparoMin }.
    // A tela do cliente manda { avaliacao } ou { avaliacaoPulada }.
    if (dadosAtualizados.status && dadosAtualizados.status !== atual?.status) {
      const atualizado = await atualizarStatusPedido(id, dadosAtualizados.status);
      setPedidos((lista) => lista.map((p) => (p.id === id ? atualizado : p)));
      return atualizado;
    }

    if (
      dadosAtualizados.tempoPreparoMin != null &&
      dadosAtualizados.tempoPreparoMin !== atual?.tempoPreparoMin
    ) {
      const atualizado = await atualizarTempoPreparo(
        id,
        dadosAtualizados.tempoPreparoMin
      );
      setPedidos((lista) => lista.map((p) => (p.id === id ? atualizado : p)));
      return atualizado;
    }

    if (dadosAtualizados.avaliacao) {
      const atualizado = await avaliarPedido(
        id,
        dadosAtualizados.avaliacao.nota,
        dadosAtualizados.avaliacao.comentario
      );
      setPedidos((lista) => lista.map((p) => (p.id === id ? atualizado : p)));
      return atualizado;
    }

    // "Agora não" da avaliação: não existe campo no backend,
    // fica só na sessão do navegador.
    if (dadosAtualizados.avaliacaoPulada) {
      setPedidos((lista) =>
        lista.map((p) =>
          p.id === id ? { ...p, avaliacaoPulada: true, fechouAvaliacao: true } : p
        )
      );
    }

    return atual;
  }

  return (
    <CardapioContext.Provider
      value={{
        categorias,
        adicionarCategoria,
        editarCategoria,
        excluirCategoria,
        produtos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        pedidos,
        setPedidos,
        adicionarPedido,
        atualizarPedido,
        meusIds,
        recarregar,
        carregando,
        erro,
      }}
    >
      {children}
    </CardapioContext.Provider>
  );
}

export function useCardapio() {
  const contexto = useContext(CardapioContext);

  if (!contexto) {
    throw new Error("useCardapio precisa estar dentro de CardapioProvider");
  }

  return contexto;
}