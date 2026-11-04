import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Minus, Plus, AlertTriangle } from 'lucide-react';
import { useCardapio } from '../../context/CardapioContext';
import Header from '../../componets/Header/Header';

// ---------------------------------------------------------------
// Textos e Configurações
// ---------------------------------------------------------------
const ROTULO_CONSUMO = { levar: 'Levar para a viagem', comer_local: 'Comer aqui' };
const ROTULO_PAGAMENTO = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' };

const PASSO_TEMPO = 5;   
const TEMPO_MIN = 5;
const TEMPO_MAX = 180;

function minSeg(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function textoPedidos(qtd) {
  return `${qtd} ${qtd === 1 ? 'pedido' : 'pedidos'}`;
}

function situacaoDoPedido(pedido, agora) {
  const tempoPreparo = pedido.tempoPreparoMin || 15;
  const previstoMs = tempoPreparo * 60000;

  if (pedido.status === 'fila') {
    return {
      rotulo: 'Na fila',
      tom: 'fila',
      cronometro: `${minSeg(agora - (pedido.criadoEm || agora))} aguardando · ${tempoPreparo} min`,
      atrasado: false,
    };
  }

  if (pedido.status === 'preparando') {
    const decorrido = Math.max(0, agora - (pedido.iniciadoEm || agora));
    if (decorrido > previstoMs) {
      return {
        rotulo: 'Preparando · atrasado',
        tom: 'atrasado',
        cronometro: `atrasado ${minSeg(decorrido - previstoMs)} · previsto ${tempoPreparo} min`,
        atrasado: true,
      };
    }
    return {
      rotulo: 'Preparando',
      tom: 'preparando',
      cronometro: `${minSeg(decorrido)} em preparo · faltam ~${Math.ceil((previstoMs - decorrido) / 60000)} min`,
      atrasado: false,
    };
  }

  if (pedido.status === 'pronto') {
    return { rotulo: 'Pronto', tom: 'pronto', cronometro: `pronto há ${minSeg(agora - (pedido.prontoEm || agora))}`, atrasado: false };
  }

  return {
    rotulo: 'Entregue',
    tom: 'entregue',
    cronometro: `total ${minSeg((pedido.entregueEm || agora) - (pedido.criadoEm || agora))}`,
    atrasado: false,
  };
}

// ---------------------------------------------------------------
// Estilos personalizados (Seguindo o padrão Café/Adm)
// ---------------------------------------------------------------
const COR_PRINCIPAL = '#5C1D24'; // Vinho / Marrom do tema

const TONS = {
  fila:       { fundo: '#FDF3E7', texto: '#A8660D', ponto: '#D98E04' },
  preparando: { fundo: '#F5E6E8', texto: COR_PRINCIPAL, ponto: COR_PRINCIPAL },
  atrasado:   { fundo: '#FDE8E8', texto: '#C92A2A', ponto: '#C92A2A' },
  pronto:     { fundo: '#E3F2E8', texto: '#2F9E62', ponto: '#2F9E62' },
  entregue:   { fundo: '#EFECE9', texto: '#7C7280', ponto: '#9A8F9E' },
};

const Pagina = styled.div`
  min-height: 100vh;
  background-color: #F4EEE8; /* Fundo padrão bege suave */
  padding-bottom: 40px;
  box-sizing: border-box;
  font-family: inherit;
`;

const ContainerCozinha = styled.main`
  width: 100%;
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BotaoAlertaAtraso = styled.button`
  width: 100%;
  background: #FDE8E8;
  border: 1px solid #E3B4B4;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #C92A2A;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 4px 12px rgba(201, 42, 42, 0.08);
  transition: background 0.2s ease;

  &:hover {
    background: #FAD4D4;
  }

  svg {
    flex-shrink: 0;
  }
`;

const Abas = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Aba = styled.button`
  border: 1.5px solid ${({ $ativa }) => ($ativa ? COR_PRINCIPAL : '#D9D2CB')};
  background: ${({ $ativa }) => ($ativa ? COR_PRINCIPAL : '#FFF')};
  color: ${({ $ativa }) => ($ativa ? '#FFF' : '#5C4033')};
  border-radius: 16px;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $ativa }) => ($ativa ? '0 4px 12px rgba(92, 29, 36, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)')};

  strong { display: block; font-size: 16px; font-weight: 700; }
  span { display: block; font-size: 12px; margin-top: 4px; opacity: 0.85; }

  &:hover {
    border-color: ${COR_PRINCIPAL};
  }
`;

const CardPedido = styled.article`
  background: ${({ $entregue }) => ($entregue ? '#FAF7F5' : '#FFF')};
  border: 1px solid ${({ $atrasado }) => ($atrasado ? '#E3B4B4' : '#E8E2DD')};
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: ${({ $entregue }) => ($entregue ? 0.75 : 1)};
`;

const TopoCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  h2 { margin: 0; font-size: 20px; color: #4A2E18; }
  p { margin: 4px 0 0; font-size: 13px; color: #8B5A3A; font-weight: 500; }
`;

const ChipStatus = styled.span`
  background: ${({ $tom }) => TONS[$tom].fundo};
  color: ${({ $tom }) => TONS[$tom].texto};
  border: 1px solid ${({ $tom }) => TONS[$tom].texto}33;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  white-space: nowrap;
`;

const ItemPedido = styled.div`
  .linha {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 16px;
    color: #4A2E18;
    font-weight: 600;
  }
  .qtd { color: #8B5A3A; font-size: 15px; }
`;

const Especificacoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

const TAGS = {
  neutro:    { fundo: '#F4EEE8', texto: '#5C4033' },
  remover:   { fundo: '#FDE8E8', texto: '#C92A2A' },
  adicionar: { fundo: '#E3F2E8', texto: '#1F7A44' },
};

const Tag = styled.span`
  background: ${({ $tom }) => TAGS[$tom].fundo};
  color: ${({ $tom }) => TAGS[$tom].texto};
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
`;

const LinhaTempo = styled.div`
  background: #F9F6F0;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5C4033;
  font-size: 13px;

  .controle { display: flex; align-items: center; gap: 12px; }
  .valor { font-weight: 700; color: #4A2E18; font-size: 15px; min-width: 50px; text-align: center; }
`;

const BotaoTempo = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #D9D2CB;
  border-radius: 8px;
  background: #FFF;
  color: #4A2E18;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.1s;

  &:hover { background: #F4EEE8; }
`;

const ChipCronometro = styled.span`
  align-self: flex-start;
  background: #F9F6F0;
  color: #5C4033;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $tom }) => TONS[$tom].ponto};
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: 12px;
`;

const BotaoAcao = styled.button`
  flex: ${({ $largura }) => $largura || 1};
  height: 48px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $tipo }) =>
    $tipo === 'principal' ? COR_PRINCIPAL : $tipo === 'entregar' ? '#2F9E62' : $tipo === 'iniciar' ? '#4A2E18' : 'transparent'};
  color: ${({ $tipo }) => ($tipo === 'fantasma' ? '#5C4033' : '#FFF')};
  border: ${({ $tipo }) => ($tipo === 'fantasma' ? '1.5px solid #D9D2CB' : 'none')};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const BlocoAvaliacao = styled.div`
  background: #FFF9E6;
  border: 1px solid #E6D298;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  color: #5C4033;

  .estrelas { color: #D98E04; font-size: 16px; letter-spacing: 2px; }
  .comentario { margin-top: 4px; font-style: italic; }
`;

const Concluido = styled.p`
  text-align: center;
  color: #7C7280;
  font-size: 15px;
  font-weight: 600;
  margin: 4px 0 0;
`;

const Vazio = styled.p`
  text-align: center;
  color: #8B5A3A;
  padding: 40px 0;
  font-size: 15px;
`;

const Rodape = styled.p`
  text-align: center;
  color: #8B5A3A;
  font-size: 12px;
  margin: 8px 0 0;
  opacity: 0.8;
`;

// ---------------------------------------------------------------
// Componente Principal Cozinha
// ---------------------------------------------------------------
export default function Cozinha() {
  const { pedidos = [], atualizarPedido } = useCardapio();
  const [aba, setAba] = useState('fila');
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const porCriacao = (a, b) => (a.criadoEm || 0) - (b.criadoEm || 0);

  const grupos = {
    ativos: pedidos.filter((p) => p.status === 'preparando' || p.status === 'pronto').sort(porCriacao),
    fila: pedidos.filter((p) => !p.status || p.status === 'fila').sort(porCriacao),
    entregues: pedidos.filter((p) => p.status === 'entregue').sort((a, b) => (b.entregueEm || 0) - (a.entregueEm || 0)),
  };

  const atrasados = pedidos.filter((p) => situacaoDoPedido(p, agora).atrasado);
  const pedidosDaAba = grupos[aba];

  function ajustarTempo(pedido, delta) {
    const atual = pedido.tempoPreparoMin || 15;
    const novo = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, atual + delta));
    atualizarPedido(pedido.id, { tempoPreparoMin: novo });
  }

  const iniciar = (p) => atualizarPedido(p.id, { status: 'preparando', iniciadoEm: Date.now() });
  const marcarPronto = (p) => atualizarPedido(p.id, { status: 'pronto', prontoEm: Date.now() });
  const voltarFila = (p) => atualizarPedido(p.id, { status: 'fila', iniciadoEm: null });
  const entregar = (p) => atualizarPedido(p.id, { status: 'entregue', entregueEm: Date.now() });

  const hora = new Date(agora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Pagina>
      <Header />

      <ContainerCozinha>
        {atrasados.length > 0 && (
          <BotaoAlertaAtraso 
            type="button" 
            onClick={() => setAba('ativos')}
            title="Clique para ver os pedidos em atraso"
          >
            <AlertTriangle size={22} />
            <span>Atenção: Você tem {atrasados.length} {atrasados.length === 1 ? 'pedido atrasado' : 'pedidos atrasados'}! Clique para visualizar.</span>
          </BotaoAlertaAtraso>
        )}

        <Abas>
          {[
            ['fila', 'Fila'],
            ['ativos', 'Ativos'],
            ['entregues', 'Entregues'],
          ].map(([chave, titulo]) => (
            <Aba key={chave} type="button" $ativa={aba === chave} onClick={() => setAba(chave)}>
              <strong>{titulo}</strong>
              <span>{textoPedidos(grupos[chave].length)}</span>
            </Aba>
          ))}
        </Abas>

        {pedidosDaAba.length === 0 && <Vazio>Nenhum pedido aqui.</Vazio>}

        {pedidosDaAba.map((pedido) => {
          const situacao = situacaoDoPedido(pedido, agora);
          const statusPedido = pedido.status || 'fila';
          const mostrarTempo = statusPedido === 'fila' || statusPedido === 'preparando';

          return (
            <CardPedido
              key={pedido.id}
              $atrasado={situacao.atrasado}
              $entregue={statusPedido === 'entregue'}
              aria-label={`Pedido senha ${pedido.senha}`}
            >
              <TopoCard>
                <div>
                  <h2>Senha {String(pedido.senha || 0).padStart(3, '0')} · {pedido.nomeCliente || 'Cliente'}</h2>
                  <p>
                    {ROTULO_CONSUMO[pedido.tipoConsumo] || '—'} · {ROTULO_PAGAMENTO[pedido.formaPagamento] || '—'}
                  </p>
                </div>
                <ChipStatus $tom={situacao.tom}>{situacao.rotulo}</ChipStatus>
              </TopoCard>

              <div>
                {(pedido.itens || []).map((item, indice) => (
                  <ItemPedido key={indice} style={{ marginBottom: 10 }}>
                    <div className="linha">
                      <span>{item.nome}</span>
                      <span className="qtd">x{item.quantidade}</span>
                    </div>

                    <Especificacoes>
                      {item.tamanho && <Tag $tom="neutro">Tamanho: {item.tamanho}</Tag>}
                      {item.combo && (
                        <Tag $tom="neutro">Combo: {item.combo.nome} ({item.combo.itens.join(' + ')})</Tag>
                      )}
                      {(item.ingredientesRemovidos || []).map((nome) => (
                        <Tag key={`sem-${nome}`} $tom="remover">SEM {nome}</Tag>
                      ))}
                      {(item.adicionais || []).map((ad) => (
                        <Tag key={`mais-${ad.nome || ad}`} $tom="adicionar">+ {ad.nome || ad}</Tag>
                      ))}
                    </Especificacoes>
                  </ItemPedido>
                ))}
              </div>

              {mostrarTempo && (
                <LinhaTempo>
                  <span>Tempo de preparo</span>
                  <div className="controle">
                    <BotaoTempo type="button" aria-label="Diminuir tempo de preparo" onClick={() => ajustarTempo(pedido, -PASSO_TEMPO)}>
                      <Minus size={16} />
                    </BotaoTempo>
                    <span className="valor">{pedido.tempoPreparoMin || 15} min</span>
                    <BotaoTempo type="button" aria-label="Aumentar tempo de preparo" onClick={() => ajustarTempo(pedido, PASSO_TEMPO)}>
                      <Plus size={16} />
                    </BotaoTempo>
                  </div>
                </LinhaTempo>
              )}

              <ChipCronometro $tom={situacao.tom}>{situacao.cronometro}</ChipCronometro>

              {statusPedido === 'fila' && (
                <Acoes>
                  <BotaoAcao type="button" $tipo="iniciar" onClick={() => iniciar(pedido)}>Iniciar preparo</BotaoAcao>
                </Acoes>
              )}

              {statusPedido === 'preparando' && (
                <Acoes>
                  <BotaoAcao type="button" $tipo="principal" $largura={1} onClick={() => marcarPronto(pedido)}>Marcar pronto</BotaoAcao>
                  <BotaoAcao type="button" $tipo="fantasma" $largura={1} onClick={() => voltarFila(pedido)}>Voltar à fila</BotaoAcao>
                </Acoes>
              )}

              {statusPedido === 'pronto' && (
                <Acoes>
                  <BotaoAcao type="button" $tipo="entregar" onClick={() => entregar(pedido)}>Entregar</BotaoAcao>
                </Acoes>
              )}

              {statusPedido === 'entregue' && pedido.avaliacao && (
                <BlocoAvaliacao aria-label="Avaliação do cliente">
                  <div className="estrelas">
                    {'★'.repeat(pedido.avaliacao.nota)}{'☆'.repeat(5 - pedido.avaliacao.nota)}
                    <span style={{ fontSize: 12, letterSpacing: 0, marginLeft: 8, color: '#8B5A3A' }}>avaliação do cliente</span>
                  </div>
                  {pedido.avaliacao.comentario && <div className="comentario">“{pedido.avaliacao.comentario}”</div>}
                </BlocoAvaliacao>
              )}

              {statusPedido === 'entregue' && <Concluido>Concluído ✓</Concluido>}
            </CardPedido>
          );
        })}

        <Rodape>{hora} · os pedidos novos aparecem aqui automaticamente</Rodape>
      </ContainerCozinha>
    </Pagina>
  );
}