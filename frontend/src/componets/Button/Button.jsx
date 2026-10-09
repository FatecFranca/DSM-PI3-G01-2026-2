import './Button.css'

import React from 'react'

function Button({
    texto,              // sem valor padrão quem usar vai decidir o texto
    icone,              // icone opsional: se ninguem passar fica como undefided
    altura = '40px',
    largura = 'auto',  // o valor do paramêtro aqui é auto pq ele vai se adptar ao tamanho da tela
    cor = '#5B000A',
    corTexto = '#ffffff',
    onClick,
    type = 'button'

}) {
  return (
    <button className='button' 
    type={type} 
    onClick={onClick}
    style={{
        '--button-largura': largura,
        '--button-altura': altura,
        '--button-cor': cor,
        '--button-corTexto': corTexto,
    }}
>
    {icone && <span className='button-icone'>{icone}</span>}
    <span>{texto}</span>
    </button>
  )
}

export default Button
