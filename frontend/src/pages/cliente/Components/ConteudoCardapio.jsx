import React, { useState } from 'react';
import styled from 'styled-components';
import { X, ArrowLeft, Trash2, Pencil } from 'lucide-react';
import cafe from '../../../assets/cafe.png';
import croassant from '../../../assets/croassats.jpg'; // imagens que vão aparecer no carriossel
import donnuts from '../../../assets/donnuts.png';

import { useCardapio } from '../../../context/CardapioContext'; 
import { iconesDisponiveis } from '../../../componets/ListaCategorias/SeletorIcones';
import { FaUtensils } from 'react-icons/fa6';
import Slider from '../../../componets/Slider/Slider';
import Header from '../../../componets/Header/Header';

import BarraPesquisa from './BarraPesquisa';
import BarraCategoriasCliente from './BarraCategoriasCliente';
import GradeProdutos from './GradeProdutos';
import BarraInferiorCarrinho from './BarraInferiorCarrinho';

// ---------------------------------------------------------------
// Helpers de preço (os preços do admin são texto, ex.: "33,90")
// ---------------------------------------------------------------
function paraNumero(valor) {
  if (typeof valor === 'number') return valor;
  const texto = String(valor ?? '').trim();
  if (!texto) return 0;
  const normalizado = texto.includes(',') ? texto.replace(/\./g, '').replace(',', '.') : texto;
  const numero = parseFloat(normalizado.replace(/[^\d.-]/g, ''));
  return Number.isNaN(numero) ? 0 : numero;
}

function formatarMoeda(valor) {
  return paraNumero(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Produtos já cadastrados que fazem parte de uma opção de combo
// (ignora ids de produtos que foram excluídos depois)
function produtosDoCombo(combo, produtos) {
  return (combo.produtosIds || [])
    .map((id) => produtos.find((p) => p.id === id))
    .filter(Boolean);
}

// ---------------------------------------------------------------
// Estilos da tela de personalização do produto
// ---------------------------------------------------------------
const Tela = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
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
`;

const Corpo = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardDoProduto = styled.div`
  background: #FFF;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const ImagemDoProduto = styled.div`
  width: 150px;
  height: 105px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #ECE9E3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #AAA;
  font-size: 12px;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const TextoDoProduto = styled.div`
  h2 { margin: 0 0 8px; font-size: 18px; color: #4A2E18; }
  p { margin: 0; font-size: 12px; color: #5C4033; line-height: 1.4; }
`;

const CabecalhoEtapa = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BotaoVoltar = styled.button`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1.5px solid #8B5A3A;
  background: #FFF;
  color: #8B5A3A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TituloEtapa = styled.div`
  flex: 1;

  strong { display: block; color: #5C1D24; font-size: 16px; }
  span { display: block; color: #6B5B53; font-size: 11px; margin-top: 2px; }
`;

const Contador = styled.span`
  background: #E8D3B0;
  color: #A8864F;
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

const CaixaOpcoes = styled.div`
  background: #FFF;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const OpcaoLinha = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid ${({ $marcado }) => ($marcado ? '#8B5A3A' : '#D9D2CB')};
  background: ${({ $marcado }) => ($marcado ? '#EFEAE3' : '#FFF')};
  cursor: pointer;
  color: ${({ $marcado }) => ($marcado ? '#8B5A3A' : '#9A8B7E')};

  input {
    width: 20px;
    height: 20px;
    accent-color: #8B5A3A;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const MiniaturaOpcao = styled.div`
  width: 80px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #ECE9E3;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const NomeOpcao = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 14px;

  small {
    display: block;
    font-weight: 400;
    font-size: 11px;
    opacity: 0.8;
    margin-top: 2px;
  }
`;

const PrecoOpcao = styled.span`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
`;

const Rodape = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding-bottom: 16px;
`;

const LinhaSubtotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5C1D24;
  font-weight: 700;

  span { font-size: 14px; }
  strong { font-size: 18px; }
`;

const BotaoAvancar = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 10px;
  background: #5C1D24;
  color: #FFF;
  font-size: 16px;
  cursor: pointer;
`;

// Uma opção (radio ou checkbox). Com semIndicador, só o destaque mostra o que está selecionado.
function Opcao({ tipo, name, marcado, onChange, nome, detalhe, preco, comMiniatura, imagem, semIndicador }) {
  return (
    <OpcaoLinha $marcado={marcado}>
      {comMiniatura && (
        <MiniaturaOpcao>{imagem ? <img src={imagem} alt={nome} /> : null}</MiniaturaOpcao>
      )}

      <NomeOpcao>
        {nome}
        {detalhe && <small>{detalhe}</small>}
      </NomeOpcao>

      {preco && <PrecoOpcao>{preco}</PrecoOpcao>}

      <input
        type={tipo}
        name={name}
        checked={marcado}
        onChange={onChange}
        aria-label={nome}
        style={semIndicador ? { position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 } : undefined}
      />
    </OpcaoLinha>
  );
}

// ---------------------------------------------------------------
// Tela de personalização do produto (o que o cliente vê ao tocar no "+")
// As etapas só aparecem se o admin configurou aquele recurso no prato.
// ---------------------------------------------------------------
export function ModalProdutoCliente({ produto, produtos, itemInicial = null, onFechar, onConfirmar }) {
  const tamanhosAtivos = (produto.tamanhos || []).filter((t) => t.ativo);
  const ingredientes = produto.ingredientes || [];
  const adicionais = produto.adicionais || [];
  // ignora combos cujos produtos foram todos excluídos
  const combos = (produto.combos || []).filter((c) => produtosDoCombo(c, produtos).length > 0);

  // Ordem igual ao protótipo: tamanho -> combo -> retirar itens -> adicionais
  const SUBTITULO = 'personalize o seu prato com base nas suas preferências';
  const etapas = [];
  if (tamanhosAtivos.length > 0) {
    etapas.push({ tipo: 'tamanho', titulo: 'Escolha o tamanho', subtitulo: SUBTITULO });
  }
  if (combos.length > 0) {
    etapas.push({ tipo: 'combo', titulo: 'Quer turbinar o seu Prato?!', subtitulo: SUBTITULO });
  }
  if (ingredientes.length > 0) {
    etapas.push({ tipo: 'ingredientes', titulo: 'Quer retirar algum item do seu Pedido?!', subtitulo: SUBTITULO });
  }
  if (adicionais.length > 0) {
    etapas.push({ tipo: 'adicionais', titulo: 'Quer adicionar algo mais?', subtitulo: SUBTITULO });
  }

  // Ao editar um item do carrinho, começa com as escolhas que o cliente já tinha feito
  const selecaoAnterior = itemInicial?.selecao;
  const tamanhoInicial = tamanhosAtivos.some((t) => t.id === selecaoAnterior?.tamanhoId)
    ? selecaoAnterior.tamanhoId
    : tamanhosAtivos[0]?.id ?? null;

  const [etapaAtual, setEtapaAtual] = useState(0);
  const [tamanhoId, setTamanhoId] = useState(tamanhoInicial);
  const [removidos, setRemovidos] = useState(selecaoAnterior?.removidos ?? []);         // ids de ingredientes retirados
  const [adicionaisSel, setAdicionaisSel] = useState(selecaoAnterior?.adicionaisSel ?? []); // ids de adicionais escolhidos
  const [comboId, setComboId] = useState(selecaoAnterior?.comboId ?? null);

  const tamanho = tamanhosAtivos.find((t) => t.id === tamanhoId) || null;
  const adicionaisEscolhidos = adicionais.filter((a) => adicionaisSel.includes(a.id));
  const combo = combos.find((c) => c.id === comboId) || null;

  const subtotal =
    paraNumero(produto.preco) +
    (tamanho ? paraNumero(tamanho.preco) : 0) +
    adicionaisEscolhidos.reduce((soma, a) => soma + paraNumero(a.preco), 0) +
    (combo ? paraNumero(combo.preco) : 0);

  const etapa = etapas[etapaAtual];
  const ehUltimaEtapa = etapas.length === 0 || etapaAtual === etapas.length - 1;

  function alternar(lista, setLista, id) {
    setLista(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  }

  function avancar() {
    if (!ehUltimaEtapa) {
      setEtapaAtual(etapaAtual + 1);
      return;
    }

    onConfirmar({
      idItem: itemInicial?.idItem ?? crypto.randomUUID(),
      produtoId: produto.id,
      nome: produto.nome,
      tamanho: tamanho ? tamanho.nome : null,
      ingredientesRemovidos: ingredientes.filter((i) => removidos.includes(i.id)).map((i) => i.nome),
      adicionais: adicionaisEscolhidos.map((a) => ({ nome: a.nome, preco: a.preco })),
      combo: combo
        ? { nome: combo.nome, preco: combo.preco, itens: produtosDoCombo(combo, produtos).map((p) => p.nome) }
        : null,
      total: subtotal,
      // guardado para poder editar o item depois, no carrinho
      selecao: { tamanhoId, removidos, adicionaisSel, comboId },
    });
  }

  return (
    <Tela role="dialog" aria-modal="true" aria-label={produto.nome}>
      <Topo>
        <Header />
        <BotaoFechar type="button" onClick={onFechar} aria-label="Fechar">
          <X size={22} />
        </BotaoFechar>
      </Topo>

      <Corpo>
        <CardDoProduto>
          <ImagemDoProduto>
            {produto.imagem ? <img src={produto.imagem} alt={produto.nome} /> : 'Sem foto'}
          </ImagemDoProduto>
          <TextoDoProduto>
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
          </TextoDoProduto>
        </CardDoProduto>

        {etapa && (
          <>
            <CabecalhoEtapa>
              {etapaAtual > 0 && (
                <BotaoVoltar type="button" onClick={() => setEtapaAtual(etapaAtual - 1)} aria-label="Voltar">
                  <ArrowLeft size={20} />
                </BotaoVoltar>
              )}
              <TituloEtapa>
                <strong>{etapa.titulo}</strong>
                <span>{etapa.subtitulo}</span>
              </TituloEtapa>
              <Contador>{etapaAtual + 1} de {etapas.length}</Contador>
            </CabecalhoEtapa>

            <CaixaOpcoes>
              {etapa.tipo === 'tamanho' &&
                tamanhosAtivos.map((t) => (
                  <Opcao
                    key={t.id}
                    tipo="radio"
                    name="tamanho"
                    marcado={tamanhoId === t.id}
                    onChange={() => setTamanhoId(t.id)}
                    nome={t.nome}
                    preco={paraNumero(t.preco) > 0 ? `+ ${formatarMoeda(t.preco)}` : null}
                  />
                ))}

              {etapa.tipo === 'ingredientes' &&
                ingredientes.map((ing) => (
                  <Opcao
                    key={ing.id}
                    tipo="checkbox"
                    marcado={removidos.includes(ing.id)}
                    onChange={() => alternar(removidos, setRemovidos, ing.id)}
                    nome={ing.nome}
                    semIndicador
                  />
                ))}

              {etapa.tipo === 'adicionais' &&
                adicionais.map((ad) => (
                  <Opcao
                    key={ad.id}
                    tipo="checkbox"
                    marcado={adicionaisSel.includes(ad.id)}
                    onChange={() => alternar(adicionaisSel, setAdicionaisSel, ad.id)}
                    nome={ad.nome}
                    preco={`+ ${formatarMoeda(ad.preco)}`}
                  />
                ))}

              {etapa.tipo === 'combo' && (
                <>
                  <Opcao
                    tipo="radio"
                    name="combo"
                    marcado={comboId === null}
                    onChange={() => setComboId(null)}
                    nome="Sem combo"
                  />
                  {combos.map((c) => {
                    const itens = produtosDoCombo(c, produtos);
                    return (
                      <Opcao
                        key={c.id}
                        tipo="radio"
                        name="combo"
                        marcado={comboId === c.id}
                        onChange={() => setComboId(c.id)}
                        nome={c.nome}
                        detalhe={itens.map((p) => p.nome).join(' + ')}
                        preco={`+ ${formatarMoeda(c.preco)}`}
                        comMiniatura
                        imagem={itens.find((p) => p.imagem)?.imagem}
                      />
                    );
                  })}
                </>
              )}
            </CaixaOpcoes>
          </>
        )}

        <Rodape>
          <LinhaSubtotal>
            <span>Subtotal:</span>
            <strong>{formatarMoeda(subtotal)}</strong>
          </LinhaSubtotal>
          <BotaoAvancar type="button" onClick={avancar}>
            {ehUltimaEtapa ? (itemInicial ? 'Salvar alterações' : 'Adicionar ao pedido') : 'Avançar'}
          </BotaoAvancar>
        </Rodape>
      </Corpo>
    </Tela>
  );
}

// ---------------------------------------------------------------
// Tela do carrinho: ver o que foi pedido, remover itens ou cancelar o pedido
// ---------------------------------------------------------------
const TituloPagina = styled.h2`
  margin: 0;
  color: #5C1D24;
  font-size: 20px;
`;

const CardItemPedido = styled.div`
  background: #FFF;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const InfoItemPedido = styled.div`
  flex: 1;
  min-width: 0;

  strong { display: block; color: #4A2E18; font-size: 15px; margin-bottom: 6px; }
  p { margin: 2px 0; color: #6B5B53; font-size: 12px; line-height: 1.4; }
`;

const ValorItemPedido = styled.span`
  color: #5C1D24;
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
`;

const BotaoLixeira = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
`;

const PedidoVazio = styled.p`
  text-align: center;
  color: #888;
  padding: 40px 0;
`;

const BotaoSecundario = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 10px;
  border: 1.5px solid #5C1D24;
  background: transparent;
  color: #5C1D24;
  font-size: 15px;
  cursor: pointer;
`;

const BotaoCancelar = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 10px;
  border: none;
  background: #8E806A;
  color: #FFF;
  font-size: 15px;
  cursor: pointer;
`;

export function TelaCarrinho({ itens, onEditarItem, onRemoverItem, onCancelarPedido, onFechar }) {
  const total = itens.reduce((soma, item) => soma + item.total, 0);

  function remover(item) {
    if (window.confirm(`Remover "${item.nome}" do pedido?`)) {
      onRemoverItem(item.idItem);
    }
  }

  function cancelar() {
    if (window.confirm('Deseja realmente cancelar o pedido? Todos os itens serão removidos.')) {
      onCancelarPedido();
    }
  }

  return (
    <Tela role="dialog" aria-modal="true" aria-label="Seu pedido">
      <Topo>
        <Header />
        <BotaoFechar type="button" onClick={onFechar} aria-label="Fechar">
          <X size={22} />
        </BotaoFechar>
      </Topo>

      <Corpo>
        <TituloPagina>Seu pedido</TituloPagina>

        {itens.length === 0 ? (
          <PedidoVazio>Nenhum item adicionado ainda.</PedidoVazio>
        ) : (
          itens.map((item) => (
            <CardItemPedido key={item.idItem}>
              <InfoItemPedido>
                <strong>{item.nome}</strong>
                {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
                {item.combo && (
                  <p>Combo: {item.combo.nome} ({item.combo.itens.join(' + ')}) — + {formatarMoeda(item.combo.preco)}</p>
                )}
                {item.ingredientesRemovidos.length > 0 && (
                  <p>Sem: {item.ingredientesRemovidos.join(', ')}</p>
                )}
                {item.adicionais.length > 0 && (
                  <p>
                    Adicionais: {item.adicionais.map((a) => `${a.nome} (+ ${formatarMoeda(a.preco)})`).join(', ')}
                  </p>
                )}
              </InfoItemPedido>

              <ValorItemPedido>{formatarMoeda(item.total)}</ValorItemPedido>

              <BotaoLixeira
                type="button"
                style={{ color: '#B8864F' }}
                onClick={() => onEditarItem(item)}
                aria-label={`Editar ${item.nome}`}
              >
                <Pencil size={18} />
              </BotaoLixeira>

              <BotaoLixeira type="button" onClick={() => remover(item)} aria-label={`Remover ${item.nome}`}>
                <Trash2 size={18} />
              </BotaoLixeira>
            </CardItemPedido>
          ))
        )}

        <Rodape>
          {itens.length > 0 && (
            <LinhaSubtotal>
              <span>Total:</span>
              <strong>{formatarMoeda(total)}</strong>
            </LinhaSubtotal>
          )}

          <BotaoSecundario type="button" onClick={onFechar}>
            {itens.length > 0 ? 'Continuar comprando' : 'Voltar ao cardápio'}
          </BotaoSecundario>

          {itens.length > 0 && (
            <BotaoCancelar type="button" onClick={cancelar}>
              Cancelar pedido
            </BotaoCancelar>
          )}
        </Rodape>
      </Corpo>
    </Tela>
  );
}

// ---------------------------------------------------------------
// Conteúdo da página do cardápio (cliente)
// ---------------------------------------------------------------
function ConteudoCardapio() {

  const imagensCardapio = [cafe, croassant, donnuts];
  const { categorias, produtos } = useCardapio();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [busca, setBusca] = useState('');

  // Produto que o cliente tocou no "+" (abre a tela de personalização)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  // Itens já confirmados pelo cliente
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  // Item do carrinho que o cliente está editando (null = produto novo)
  const [itemEmEdicao, setItemEmEdicao] = useState(null);

  const totalCarrinho = carrinho.reduce((soma, item) => soma + item.total, 0);

  function renderizarIcone(nomeIcone) {
    const item = iconesDisponiveis.find((i) => i.nome === nomeIcone);
    if (!item) return <FaUtensils />;
    const Componente = item.componente;
    return <Componente aria-hidden="true" />;
  }

  function removerItem(idItem) {
    setCarrinho((atual) => atual.filter((item) => item.idItem !== idItem));
  }

  function cancelarPedido() {
    setCarrinho([]);
    setCarrinhoAberto(false);
  }

  function editarItem(item) {
    const produto = produtos.find((p) => p.id === item.produtoId);
    if (!produto) {
      window.alert('Este produto não está mais disponível no cardápio.');
      return;
    }
    setItemEmEdicao(item);
    setProdutoSelecionado(produto);
  }

  function fecharProduto() {
    setProdutoSelecionado(null);
    setItemEmEdicao(null);
  }

  // Se o item já existe no carrinho (edição), substitui; senão, adiciona
  function confirmarItem(item) {
    setCarrinho((atual) =>
      atual.some((i) => i.idItem === item.idItem)
        ? atual.map((i) => (i.idItem === item.idItem ? item : i))
        : [...atual, item]
    );
    fecharProduto();
  }

  // filtragem global de produtos
  const produtosFiltrados = produtos.filter((produto) => {
    if (busca.trim() !== '') {
      return produto.nome.toLowerCase().includes(busca.toLowerCase());
    }
    return categoriaAtiva === 'todos' || produto.categoriaId === categoriaAtiva;
  });

  return (
    <>
      <div className="container-conteudo">
        <BarraPesquisa busca={busca} setBusca={setBusca} />
        <Slider slides={imagensCardapio} height="300px" />
        <BarraCategoriasCliente 
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          setCategoriaAtiva={setCategoriaAtiva}
          renderizarIcone={renderizarIcone}
        />
        <GradeProdutos 
          produtos={produtosFiltrados}
          onAdicionar={setProdutoSelecionado}
        />
      </div>

      <BarraInferiorCarrinho 
        quantidade={carrinho.length}
        total={totalCarrinho}
        onClickCarrinho={() => setCarrinhoAberto(true)}
      />

      {carrinhoAberto && (
        <TelaCarrinho
          itens={carrinho}
          onEditarItem={editarItem}
          onRemoverItem={removerItem}
          onCancelarPedido={cancelarPedido}
          onFechar={() => setCarrinhoAberto(false)}
        />
      )}

      {/* Fica depois do carrinho no código para abrir POR CIMA dele ao editar um item */}
      {produtoSelecionado && (
        <ModalProdutoCliente
          key={`${produtoSelecionado.id}-${itemEmEdicao?.idItem ?? 'novo'}`}
          produto={produtoSelecionado}
          produtos={produtos}
          itemInicial={itemEmEdicao}
          onFechar={fecharProduto}
          onConfirmar={confirmarItem}
        />
      )}
    </>
  );
}

export default ConteudoCardapio;