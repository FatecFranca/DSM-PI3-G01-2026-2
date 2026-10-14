
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CardapioContext = createContext(null);

function carregarCategorias() {
  try {
    const dados = localStorage.getItem("categorias");
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

export function CardapioProvider({ children }) {
  const [categorias, setCategorias] = useState(
    carregarCategorias
  );

  useEffect(() => {
    localStorage.setItem(
      "categorias",
      JSON.stringify(categorias)
    );
  }, [categorias]);

  function adicionarCategoria(texto, icone) {
    const novaCategoria = {
      id: crypto.randomUUID(),
      texto,
      icone,
    };

    setCategorias((lista) => [...lista, novaCategoria]);
  }

  function editarCategoria(id, texto, icone) {
    setCategorias((lista) =>
      lista.map((categoria) =>
        categoria.id === id
          ? { ...categoria, texto, icone }
          : categoria
      )
    );
  }

  function excluirCategoria(id) {
    setCategorias((lista) =>
      lista.filter((categoria) => categoria.id !== id)
    );
  }

  return (
    <CardapioContext.Provider
      value={{
        categorias,
        adicionarCategoria,
        editarCategoria,
        excluirCategoria,
      }}
    >
      {children}
    </CardapioContext.Provider>
  );
}

export function useCardapio() {
  const contexto = useContext(CardapioContext);

  if (!contexto) {
    throw new Error(
      "useCardapio precisa estar dentro de CardapioProvider"
    );
  }

  return contexto;
}
