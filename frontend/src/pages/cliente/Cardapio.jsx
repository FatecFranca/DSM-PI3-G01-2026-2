import React from 'react';
import styled from 'styled-components';
import Header from "../../componets/Header/Header";
import ConteudoCardapio from './Components/ConteudoCardapio';

const PaginaCardapio = styled.div`
  background-color: #F8F8F7;
  min-height: 100vh;
  padding-bottom: 80px;
  font-family: sans-serif;
`;

function Cardapio() {
  return (
    <PaginaCardapio>
      <Header />
      <ConteudoCardapio />
    </PaginaCardapio>
  );
}

export default Cardapio;