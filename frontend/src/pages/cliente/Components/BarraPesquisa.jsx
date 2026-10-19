import React from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';

const ContainerPesquisa = styled.div`
  margin: 16px 0 20px;
`;

const CaixaPesquisa = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #FFF;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  width: 96%;
  margin: auto;
`;

const InputPesquisa = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #4A2E18;
  background: transparent;
`;

function BarraPesquisa({ busca, setBusca }) {
  return (
    <ContainerPesquisa>
      <CaixaPesquisa>
        <Search size={18} color="#A0A0A0" />
        <InputPesquisa 
          type="text"
          placeholder="pesquisar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </CaixaPesquisa>
    </ContainerPesquisa>
  );
}

export default BarraPesquisa;