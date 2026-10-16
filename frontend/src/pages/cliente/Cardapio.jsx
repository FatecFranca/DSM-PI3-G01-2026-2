import React, { useState } from 'react';
import Header from "../../componets/Header/Header";
import Slider from "../../componets/Slider/Slider";
import cafe from '../../assets/cafe.png';
import croassant from '../../assets/croassats.jpg';
import donnuts from '../../assets/donnuts.png';

import { useCardapio } from '../../context/CardapioContext';
import IconesCategorias from '../../componets/IconesCategorias/IconesCategorias';
import { iconesDisponiveis } from '../../componets/ListaCategorias/SeletorIcones';
import { FaUtensils, FaPlus } from 'react-icons/fa6';
import { Search } from 'lucide-react';
import Button from '../../componets/Button/Button'; // Certifique-se de que o caminho está correto
import { FaBagShopping } from 'react-icons/fa6';
// Importação do CSS separado
import '../../styles/CardapioCliente.css'// ou crie um CardapioCliente.css dedicado

function Cardapio() {
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

  const produtosFiltrados = produtos.filter((produto) => {
    const bateCategoria = categoriaAtiva === 'todos' || produto.categoriaId === categoriaAtiva;
    const bateBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    return bateCategoria && bateBusca;
  });

  return (
    <div className="pagina-cardapio">
      <Header />

      <div className="container-conteudo">
        
        {/* Barra de Pesquisa */}
        <div className="container-pesquisa">
          <div className="caixa-pesquisa">
            <Search size={18} color="#A0A0A0" />
            <input 
              type="text"
              placeholder="pesquisar produto"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-pesquisa"
            />
          </div>
        </div>

        {/* Slider de Banners */}
        <Slider slides={imagensCardapio} />

        {/* Lista de Categorias */}
        <div className="container-categorias-cliente">
          <IconesCategorias
            texto="Tudo"
            icone={<FaUtensils />}
            variante="redondo"
            ativo={categoriaAtiva === 'todos'}
            onClick={() => setCategoriaAtiva('todos')}
          />

          {categorias.map((cat) => (
            <IconesCategorias
              key={cat.id}
              texto={cat.texto}
              icone={renderizarIcone(cat.icone)}
              variante="redondo"
              ativo={categoriaAtiva === cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
            />
          ))}
        </div>

        {/* Grade de Produtos */}
        <div className="grade-produtos">
          {produtosFiltrados.length === 0 ? (
            <p className="nenhum-produto">
              Nenhum produto encontrado.
            </p>
          ) : (
            produtosFiltrados.map((produto) => (
              <div key={produto.id} className="card-produto">
                
                <div className="card-imagem-container">
                  {produto.imagem ? (
                    <img src={produto.imagem} alt={produto.nome} className="card-imagem" />
                  ) : (
                    <span className="card-sem-imagem">Sem foto</span>
                  )}
                </div>

                <div className="card-info">
                  <div>
                    <h3 className="card-titulo">{produto.nome}</h3>
                    <p className="card-descricao">{produto.descricao}</p>
                  </div>

                  <div className="card-footer">
                    <span className="card-preco">R$ {produto.preco}</span>
                    <button className="botao-adicionar">
                      <FaPlus size={11} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Barra Inferior Fixa */}
      <div className="barra-inferior">
  <Button 
    texto="NENHUM ITEM ADICIONADO" 
    icone={<FaBagShopping size={16} />}
    altura="48px"
    largura="100%"
    cor="#5C1D24"
    corTexto="#ffffff"
    onClick={() => console.log('Abrir carrinho')}
  />
</div>
    </div>
  );
}

export default Cardapio;