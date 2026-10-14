import React from 'react'
import './IconesCategoria.css'
const IconesCategorias = ({
    texto,
    icone,
    ativo = false,
    variante = 'pilula', // 'pilula' (admin) ou ' redondo' (cardápio)
    onClick,
    cor = "EFECE5",
    corIcone = '#895737',

}) => {
  return (
    <button type='button' onClick={onClick} className={`categoria ${variante} ${ativo ? 'ativo': ''}`} style={{ '--icone-cor': corIcone, '--cor-fundo': cor}}
    >
        <span className='icone-wrapper'>{icone}</span>
        <span className='categoria-texto'>{texto}</span>
    </button>
  )
}

export default IconesCategorias
