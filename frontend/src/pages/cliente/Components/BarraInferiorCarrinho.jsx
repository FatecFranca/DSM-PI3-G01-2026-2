import React from 'react';
import styled from 'styled-components';
import Button from '../../../componets/Button/Button';
import { FaBagShopping } from 'react-icons/fa6';

const BarraInferior = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #5C1D24;
  color: #FFF;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  font-size: 13px;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
  z-index: 100;
`;

function BarraInferiorCarrinho({ onClickCarrinho }) {
  return (
    <BarraInferior>
      <Button 
        texto="NENHUM ITEM ADICIONADO" 
        icone={<FaBagShopping size={16} />}
        altura="48px"
        largura="100%"
        cor="#5C1D24"
        corTexto="#ffffff"
        onClick={onClickCarrinho}
      />
    </BarraInferior>
  );
}

export default BarraInferiorCarrinho;