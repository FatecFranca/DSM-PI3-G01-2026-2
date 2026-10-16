import React from 'react';
import styled from 'styled-components';
import IconesCategorias from "../../../componets/IconesCategorias/IconesCategorias";
import { FaUtensils } from 'react-icons/fa6';

const ContainerCategorias = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 20px 0;
  align-items: center;
  width: 95%;
  justify-content: space-evenly;
`;

function BarraCategoriasCliente({ categorias, categoriaAtiva, setCategoriaAtiva, renderizarIcone }) {
  return (
    <ContainerCategorias>
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
    </ContainerCategorias>
  );
}

export default BarraCategoriasCliente;