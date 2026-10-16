import React, { useState } from 'react';
import cafe from '../../../assets/cafe.png';
import croassant from '../../../assets/croassats.jpg'; // imagens que vão aparecer no carriossel
import donnuts from '../../../assets/donnuts.png';

import { useCardapio } from '../../../context/CardapioContext'; 
import { iconesDisponiveis } from '../../../componets/ListaCategorias/SeletorIcones';
import { FaUtensils } from 'react-icons/fa6';
import Slider from '../../../componets/Slider/Slider';

import BarraPesquisa from './BarraPesquisa';
import BarraCategoriasCliente from './BarraCategoriasCliente';
import GradeProdutos from './GradeProdutos';
import BarraInferiorCarrinho from './BarraInferiorCarrinho';




function ConteudoCardapio() {

  const imagensCardapio = [cafe, croassant, donnuts];
  const { categorias, produtos } = useCardapio();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [busca, setBusca] = useState('');

  function renderizarIcone(nomeIcone) {
    const item = iconesDisponiveis.find((i) => i.nome === nomeIcone);
    if (!item) return <FaUtensils />;
    const Componente = item.componente;
    return <Componente aria-hidden="true" />;
  }

 
  // filtragem global de produtos
  const produtosFiltrados = produtos.filter((produto) => {
    if (busca.trim() !== '') {
      return produto.nome.toLowerCase().includes(busca.toLowerCase());
    }
    return categoriaAtiva === 'todos' || produto.categoriaId === categoriaAtiva;
  });

  return (
    <>
      <div className="container-conteudo">
        <BarraPesquisa busca={busca} setBusca={setBusca} />
        <Slider slides={imagensCardapio} height="300px" />
        <BarraCategoriasCliente 
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          setCategoriaAtiva={setCategoriaAtiva}
          renderizarIcone={renderizarIcone}
        />
        <GradeProdutos 
          produtos={produtosFiltrados}
          onAdicionar={(produto) => console.log('Adicionar', produto.nome)}
        />
      </div>

      <BarraInferiorCarrinho 
        onClickCarrinho={() => console.log('Abrir carrinho')}
      />
    </>
  );
}

export default ConteudoCardapio;