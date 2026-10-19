import React from 'react';
import styled from 'styled-components';
import CardProduto from './CardProduto';

const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 10px;
`;

const NenhumProduto = styled.p`
  text-align: center;
  color: #888;
  grid-column: 1 / -1;
  padding: 30px 0;
`;

function GradeProdutos({ produtos, onAdicionar }) {
  return (
    <Grade>
      {produtos.length === 0 ? (
        <NenhumProduto>Nenhum produto encontrado.</NenhumProduto>
      ) : (
        produtos.map((produto) => (
          <CardProduto 
            key={produto.id} 
            produto={produto} 
            onAdicionar={onAdicionar} 
          />
        ))
      )}
    </Grade>
  );
}

export default GradeProdutos;