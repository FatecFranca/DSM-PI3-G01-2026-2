import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Store, CreditCard, Banknote, Copy } from 'lucide-react';
import { BiSolidShoppingBags } from 'react-icons/bi';
import Header from '../../../componets/Header/Header';

// ---------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------
const Tela = styled.div`
  position: fixed;
  inset: 0;
  z-index: 250;
  background-color: #F4EEE8;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Topo = styled.div`
  position: relative;
`;

const BotaoFechar = styled.button`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
`;

const Corpo = styled.form`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Abas do topo (Identificação, Consumir, Pagamento)
const ContainerAbas = styled.div`
  background: #FFF;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #EFECE9;
`;

const AbaItem = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: ${({ $ativa }) => ($ativa ? 'bold' : '500')};
  color: ${({ $ativa }) => ($ativa ? '#5C1D24' : '#888')};
  position: relative;
  padding-bottom: 6px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    background-color: ${({ $ativa }) => ($ativa ? '#5C1D24' : 'transparent')};
    border-radius: 2px;
  }
`;

const CardConteudo = styled.div`
  background: #FFF;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 320px;
  align-items: center;
  justify-content: center;
`;

const TituloSecao = styled.h3`
  margin: 0 0 8px;
  color: #5C1D24;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
`;

const InputNome = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #C4A897;
  background-color: #FAF8F5;
  font-size: 14px;
  outline: none;
  color: #4A2E18;

  &:focus {
    border-color: #8B5A3A;
    background-color: #FFF;
  }
`;

const CardOpcaoGrande = styled.button`
  width: 100%;
  padding: 20px 24px;
  border-radius: 14px;
  border: 2px solid ${({ $marcado }) => ($marcado ? '#8B5A3A' : '#C4A897')};
  background: ${({ $marcado }) => ($marcado ? '#F7F3EE' : '#FFF')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  color: #5C4033;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  transition: all 0.15s ease;

  svg {
    color: #5C4033;
    flex-shrink: 0;
  }

  &:hover {
    border-color: #8B5A3A;
  }
`;

// Estilos da Tela do Pix
const BoxPixInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;

  .tempo {
    color: #8B5A3A;
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }

  .contador {
    font-size: 22px;
    font-weight: bold;
    color: #4A2E18;
    margin: 0;
  }

  .qr-code {
    width: 160px;
    height: 160px;
    background-color: #F0F0F0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
    img { width: 100%; height: 100%; object-fit: contain; }
  }

  .copiar-codigo {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6B5B53;
    font-size: 12px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 6px;

    &:hover { color: #5C1D24; }
  }
`;

const LinhaSubtotalCheckout = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 8px;

  span {
    color: #5C1D24;
    font-size: 14px;
    font-weight: bold;
  }

  strong {
    color: #5C1D24;
    font-size: 16px;
  }
`;

const BotaoProximo = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #5C1D24;
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function IconePix() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8B5A3A' }}>
      <path d="M12 2L4.5 9.5L12 17L19.5 9.5L12 2ZM12 4.8L16.7 9.5L12 14.2L7.3 9.5L12 4.8ZM12 18.5L8.5 15L7.1 16.4L12 21.3L16.9 16.4L15.5 15L12 18.5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------
// Componente principal TelaCheckout
// ---------------------------------------------------------------
export default function TelaCheckout({ itens, total, onFechar, onFinalizarPedidoSucesso }) {
  const [etapa, setEtapa] = useState('identificacao'); 
  const [nomeCliente, setNomeCliente] = useState('');
  const [tipoConsumo, setTipoConsumo] = useState(null); 
  const [formaPagamento, setFormaPagamento] = useState(null); 
  const [tempoRestante, setTempoRestante] = useState(632); 

  useEffect(() => {
    let timer;
    if (etapa === 'pix_confirmacao' && tempoRestante > 0) {
      timer = setInterval(() => setTempoRestante((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [etapa, tempoRestante]);

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatarMoeda(val) {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function tratarKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (etapa === 'identificacao' && nomeCliente.trim()) {
        avancar();
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    avancar();
  }

  function avancar() {
    if (etapa === 'identificacao') {
      if (!nomeCliente.trim()) return;
      setEtapa('consumir');
    } else if (etapa === 'consumir') {
      if (!tipoConsumo) return;
      setEtapa('pagamento');
    } else if (etapa === 'pagamento') {
      if (!formaPagamento) return;
      if (formaPagamento === 'pix') {
        setEtapa('pix_confirmacao');
      } else {
        concluirPedido();
      }
    } else if (etapa === 'pix_confirmacao') {
      concluirPedido();
    }
  }

  // "forma" é passada direto nos cliques de Cartão/Dinheiro: o setFormaPagamento
  // só atualiza o estado na próxima renderização, então ler formaPagamento aqui
  // logo depois dele devolveria o valor antigo (null) e o pedido sairia sem forma de pagamento.
  function concluirPedido(forma = formaPagamento) {
    onFinalizarPedidoSucesso({
      nomeCliente: nomeCliente.trim(),
      tipoConsumo,
      formaPagamento: forma,
      itens,
      total,
    });
  }

  function copiarCodigoPix() {
    navigator.clipboard.writeText('00020126360014BR.GOV.BCB.PIX011400000000000000520400005303986540538.405802BR5910Cafe do Vovo6006Franca62070503***6304E2CA');
    window.alert('Código Pix copiado para a área de transferência!');
  }

  return (
    <Tela role="dialog" aria-modal="true" aria-label="Finalizar pedido">
      <Topo>
        <Header />
        <BotaoFechar type="button" onClick={onFechar} aria-label="Fechar">
          <X size={22} />
        </BotaoFechar>
      </Topo>

      <Corpo onSubmit={handleSubmit}>
        {/* Abas Superiores */}
        <ContainerAbas>
          <AbaItem $ativa={etapa === 'identificacao'}>
            identificação
          </AbaItem>
          <AbaItem $ativa={etapa === 'consumir'}>
            Consumir
          </AbaItem>
          <AbaItem $ativa={etapa === 'pagamento' || etapa === 'pix_confirmacao'}>
            Pagamento
          </AbaItem>
        </ContainerAbas>

        {/* Card de Conteúdo */}
        <CardConteudo>
          {/* ETAPA 1: IDENTIFICAÇÃO */}
          {etapa === 'identificacao' && (
            <>
              <TituloSecao>Como podemos te chamar?</TituloSecao>
              <InputNome
                type="text"
                placeholder="Insira seu nome:"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                onKeyDown={tratarKeyDown}
                autoFocus
              />
            </>
          )}

          {/* ETAPA 2: CONSUMIR */}
          {etapa === 'consumir' && (
            <>
              <TituloSecao>Olá, {nomeCliente}</TituloSecao>

              <CardOpcaoGrande
                type="button"
                $marcado={tipoConsumo === 'levar'}
                onClick={() => {
                  setTipoConsumo('levar');
                  setEtapa('pagamento'); // Avança direto ao clicar
                }}
              >
                <BiSolidShoppingBags size={32} />
                <span>levar para a viagem</span>
              </CardOpcaoGrande>

              <CardOpcaoGrande
                type="button"
                $marcado={tipoConsumo === 'comer_local'}
                onClick={() => {
                  setTipoConsumo('comer_local');
                  setEtapa('pagamento'); // Avança direto ao clicar
                }}
              >
                <Store size={32} />
                <span>Comer aqui</span>
              </CardOpcaoGrande>
            </>
          )}

          {/* ETAPA 3: PAGAMENTO */}
          {etapa === 'pagamento' && (
            <>
              <TituloSecao>Como gostaria de Pagar?</TituloSecao>

              <CardOpcaoGrande
                type="button"
                $marcado={formaPagamento === 'pix'}
                onClick={() => {
                  setFormaPagamento('pix');
                  setEtapa('pix_confirmacao'); // Avança direto ao selecionar Pix
                }}
              >
                <IconePix />
                <span>Pix</span>
              </CardOpcaoGrande>

              <CardOpcaoGrande
                type="button"
                $marcado={formaPagamento === 'cartao'}
                onClick={() => {
                  setFormaPagamento('cartao');
                  concluirPedido('cartao'); // Finaliza se for cartão
                }}
              >
                <CreditCard size={28} />
                <span>Cartão</span>
              </CardOpcaoGrande>

              <CardOpcaoGrande
                type="button"
                $marcado={formaPagamento === 'dinheiro'}
                onClick={() => {
                  setFormaPagamento('dinheiro');
                  concluirPedido('dinheiro'); // Finaliza se for dinheiro
                }}
              >
                <Banknote size={28} />
                <span>Dinheiro</span>
              </CardOpcaoGrande>
            </>
          )}

          {/* ETAPA 4: PIX */}
          {etapa === 'pix_confirmacao' && (
            <BoxPixInfo>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setEtapa('pagamento')} 
                  style={{ background: 'none', border: 'none', color: '#8B5A3A', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                >
                  Alterar forma de pagamento
                </button>
                <span style={{ fontSize: '11px', color: '#888' }}>Como gostaria de Pagar?</span>
              </div>

              <CardOpcaoGrande style={{ padding: '12px', cursor: 'default' }}>
                <IconePix />
                <span>Pague com o Pix</span>
              </CardOpcaoGrande>

              <p className="tempo">Tempo restante para confirmar pedido:</p>
              <p className="contador">{formatarTempo(tempoRestante)}</p>

              <div className="qr-code">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=CafeDoVovoPix-${total}`} 
                  alt="QR Code Pix" 
                />
              </div>

              <button type="button" className="copiar-codigo" onClick={copiarCodigoPix}>
                <Copy size={16} />
                <span>Copiar código/protocolo de pagamento<br />00000.000.0000.e.0f134.00000</span>
              </button>

              <LinhaSubtotalCheckout>
                <span>Subtotal:</span>
                <strong>valor: {formatarMoeda(total)}</strong>
              </LinhaSubtotalCheckout>
            </BoxPixInfo>
          )}
        </CardConteudo>

        {/* Botão Próximo (Exibido apenas na primeira etapa ou na tela do QR code para confirmar) */}
        {etapa !== 'consumir' && etapa !== 'pagamento' && (
          <BotaoProximo
            type="submit"
            disabled={
              (etapa === 'identificacao' && !nomeCliente.trim())
            }
          >
            {etapa === 'pix_confirmacao' ? 'Concluir Pedido' : 'Próximo'}
          </BotaoProximo>
        )}
      </Corpo>
    </Tela>
  );
}