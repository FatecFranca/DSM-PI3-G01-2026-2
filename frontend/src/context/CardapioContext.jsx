import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CardapioContext = createContext(null);

// Função auxiliar para carregar dados salvos no navegador (LocalStorage)
function carregarDados(chave, valorInicial) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorInicial;
  } catch {
    return valorInicial;
  }
}

export function CardapioProvider({ children }) {
  // Estado que armazena a lista de categorias criadas
  const [categorias, setCategorias] = useState(() => 
    carregarDados("categorias", [])
  );

  // Estado que armazena a lista de produtos vinculados
  const [produtos, setProdutos] = useState(() => 
    carregarDados("produtos", [])
  );

  // Estado que armazena os pedidos feitos pelos clientes (painel da cozinha)
  const [pedidos, setPedidos] = useState(() =>
    carregarDados("pedidos", [])
  );

  // Sincroniza as categorias com o LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  // Sincroniza os produtos com o LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  // Sincroniza os pedidos com o LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Quando OUTRA aba do mesmo navegador altera os pedidos (ex.: o cliente
  // finaliza um pedido enquanto a cozinha está aberta em outra aba), atualiza aqui.
  useEffect(() => {
    function aoMudarStorage(evento) {
      if (evento.key !== "pedidos") return;
      try {
        setPedidos(evento.newValue ? JSON.parse(evento.newValue) : []);
      } catch {
        // ignora valor inválido
      }
    }
    window.addEventListener("storage", aoMudarStorage);
    return () => window.removeEventListener("storage", aoMudarStorage);
  }, []);

  // Função para adicionar uma nova categoria
  function adicionarCategoria(texto, icone) {
    const novaCategoria = {
      id: crypto.randomUUID(), // Cria um ID único
      texto,
      icone,
    };
    setCategorias((lista) => [...lista, novaCategoria]);
  }

  // Função para editar uma categoria existente
  function editarCategoria(id, texto, icone) {
    setCategorias((lista) =>
      lista.map((categoria) =>
        String(categoria.id) === String(id)
          ? { ...categoria, texto, icone }
          : categoria
      )
    );
  }

  // Função para excluir uma categoria e limpar produtos vinculados
  function excluirCategoria(id) {
    setCategorias((lista) =>
      lista.filter((categoria) => String(categoria.id) !== String(id))
    );
    // Remove os produtos que pertenciam a essa categoria excluída
    setProdutos((lista) =>
      lista.filter((produto) => String(produto.categoriaId) !== String(id))
    );
  }

  // Função para adicionar um novo produto vinculado a uma categoria
  function adicionarProduto(produto) {
    const novoProduto = { id: crypto.randomUUID(), ...produto };
    setProdutos((lista) => [...lista, novoProduto]);
  }

  // Função para EDITAR um produto existente (ADICIONADA AQUI)
  function editarProduto(id, dadosAtualizados) {
    setProdutos((lista) =>
      lista.map((produto) =>
        String(produto.id) === String(id)
          ? { ...produto, ...dadosAtualizados }
          : produto
      )
    );
  }

  // Função para excluir um produto pelo ID
  function excluirProduto(id) {
    setProdutos((lista) => lista.filter((produto) => String(produto.id) !== String(id)));
  }

  // Cria um pedido para a cozinha e devolve o pedido criado (com a senha).
  // A senha é um número sequencial que recomeça a cada dia (1, 2, 3...),
  // assim dois clientes nunca ficam com a mesma senha no mesmo dia.
  function adicionarPedido(dadosPedido) {
    const hoje = new Date().toDateString();
    const pedidosDeHoje = pedidos.filter(
      (p) => new Date(p.criadoEm).toDateString() === hoje
    );
    const maiorSenha = pedidosDeHoje.reduce((maior, p) => Math.max(maior, p.senha), 0);

    const novoPedido = {
      id: crypto.randomUUID(),
      senha: maiorSenha + 1,
      status: "fila", // fila -> preparando -> pronto -> entregue
      tempoPreparoMin: 15,
      criadoEm: Date.now(),
      iniciadoEm: null,
      prontoEm: null,
      entregueEm: null,
      ...dadosPedido,
    };

    setPedidos((lista) => [...lista, novoPedido]);
    return novoPedido;
  }

  // Atualiza campos de um pedido (status, tempo de preparo, horários...)
  function atualizarPedido(id, dadosAtualizados) {
    setPedidos((lista) =>
      lista.map((pedido) =>
        pedido.id === id ? { ...pedido, ...dadosAtualizados } : pedido
      )
    );
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
        editarProduto, // <--- EXPOSTO AQUI
        excluirProduto,
        pedidos,
        adicionarPedido,
        atualizarPedido,
      }}
    >
      {children}
    </CardapioContext.Provider>
  );
}

// Hook personalizado para facilitar o uso do contexto nas páginas
export function useCardapio() {
  const contexto = useContext(CardapioContext);
  if (!contexto) {
    throw new Error("useCardapio precisa estar dentro de CardapioProvider");
  }
  return contexto;
}