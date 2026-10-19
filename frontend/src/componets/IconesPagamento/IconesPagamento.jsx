import './IconesPagamento.css'

const IconesPagamento = ({
  texto,
  icone,
  cor = '#EFECE5', // cores padrão caso não trocar o tema
  corIcone = '#895737',
}) => {
  return (
    <div className='pagamento' style={{
      '--icone-cor': corIcone,
      '--icone-fundo': cor,
    }}>
      <span>{icone}</span>
      <span>{texto}</span>
    </div>
  )
}

export default IconesPagamento