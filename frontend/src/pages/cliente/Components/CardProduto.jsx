import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa6';

const CardProdutoContainer = styled.div`
  background-color: #FFF;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
`;

const ImagemContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: #ece9e3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: #BBB;
    font-size: 12px;
  }
`;

const CardInfo = styled.div`
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitulo = styled.h3`
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
`;

const CardDescricao = styled.p`
  font-size: 11px;
  color: #888;
  margin: 0 0 12px 0;
  line-height: 1.3;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const CardPreco = styled.span`
  font-weight: bold;
  color: #5C1D24;
  font-size: 14px;
`;

// Botão redondo com Flexbox garantindo o ícone perfeitamente centralizado
const BotaoAdicionarCircular = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #5C1D24;
  color: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.1s ease, opacity 0.1s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

function CardProduto({ produto, onAdicionar }) {
  return (
    // Tocar em qualquer parte do card (foto, nome, descrição) abre a tela do produto
    <CardProdutoContainer onClick={() => onAdicionar(produto)}>
      <ImagemContainer>
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} />
        ) : (
          <span>Sem foto</span>
        )}
      </ImagemContainer>

      <CardInfo>
        <div>
          <CardTitulo>{produto.nome}</CardTitulo>
          <CardDescricao>{produto.descricao}</CardDescricao>
        </div>

        <CardFooter>
          <CardPreco>R$ {produto.preco}</CardPreco>
          
          <BotaoAdicionarCircular
            onClick={(e) => {
              e?.stopPropagation?.(); // evita abrir duas vezes (botão + card)
              onAdicionar(produto);
            }}
            aria-label={`Adicionar ${produto.nome}`}
          >
            <FaPlus size={12} />
          </BotaoAdicionarCircular>
        </CardFooter>
      </CardInfo>
    </CardProdutoContainer>
  );
}

export default CardProduto;