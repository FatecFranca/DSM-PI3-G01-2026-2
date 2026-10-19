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

  // Sincroniza as categorias com o LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  // Sincroniza os produtos com o LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

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