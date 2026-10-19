import React, { useState } from 'react';
import { X, ImagePlus, Edit2, Trash2 } from "lucide-react";

const MAX_OPCOES_COMBO = 3;

// Produtos (já cadastrados) que fazem parte de uma opção de combo.
// Ignora ids de produtos que foram excluídos depois.
function produtosDoCombo(combo, produtos) {
    return (combo.produtosIds || [])
        .map((id) => produtos.find((p) => p.id === id))
        .filter(Boolean);
}

// ---------------------------------------------------------------
// Estilos (inline, igual ao que você já usa neste arquivo)
// ---------------------------------------------------------------
const est = {
    secao: { marginTop: '24px', marginBottom: '24px' },
    titulo: { color: '#4A2E18', fontSize: '18px', marginBottom: '4px' },
    descricao: { fontSize: '12px', color: '#666', marginBottom: '12px', lineHeight: '1.4' },
    caixa: { background: '#FAF8F5', border: '1px solid #E2D9D2', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    vazio: { textAlign: 'center', color: '#999', fontSize: '13px', padding: '6px' },
    linha: { display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF', border: '1px solid #EFECE9', padding: '14px 16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    linhaNome: { flex: 1, color: '#4A2E18', fontSize: '14px' },
    linhaPreco: { color: '#888', fontSize: '14px', whiteSpace: 'nowrap' },
    iconeBtn: { background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    formInline: { display: 'flex', gap: '10px' },
    input: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2D9D2', backgroundColor: '#FFF', fontSize: '14px', outline: 'none' },
    inputPreco: { width: '120px', flexShrink: 0 },
    btnAdicionar: { width: '100%', backgroundColor: '#4A2E18', color: '#FFF', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '500', cursor: 'pointer' },
    btnLink: { background: 'none', border: 'none', color: '#8B5A3A', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' },
    check: { width: '20px', height: '20px', accentColor: '#5C1D24', cursor: 'pointer' },
    thumb: { width: '64px', height: '56px', borderRadius: '10px', background: '#EFECE5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: '#999' },
    thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
    comboNome: { color: '#6B4A2F', fontSize: '14px', fontWeight: 600 },
    comboItens: { color: '#999', fontSize: '12px', marginTop: '2px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#4A2E18', marginBottom: '6px' },
    campo: { marginBottom: '16px' },
    aviso: { color: '#888', fontSize: '12px', marginTop: '6px' },
    listaProdutos: { maxHeight: '260px', overflowY: 'auto', border: '1px solid #EAE5DE', borderRadius: '12px', padding: '8px' },
    grupo: { fontSize: '12px', fontWeight: 600, color: '#6B4A2F', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '8px 4px 6px' },
};

function estiloBotao(desabilitado) {
    return { ...est.btnAdicionar, opacity: desabilitado ? 0.5 : 1, cursor: desabilitado ? 'not-allowed' : 'pointer' };
}

// ---------------------------------------------------------------
// Lista com cadastro/edição na própria tela (Ingredientes e Adicionais)
// comPreco = false -> só nome | comPreco = true -> nome + valor
// ---------------------------------------------------------------
function SecaoItens({ titulo, descricao, itens, setItens, comPreco = false, vazio, placeholderNome, textoBotao, nomeDoTipo }) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    const formularioValido = nome.trim() !== '' && (!comPreco || preco.trim() !== '');

    function limpar() {
        setNome('');
        setPreco('');
        setEditandoId(null);
    }

    function salvar() {
        if (!formularioValido) return;
        const dados = comPreco ? { nome: nome.trim(), preco: preco.trim() } : { nome: nome.trim() };

        if (editandoId) {
            setItens(itens.map((i) => (i.id === editandoId ? { ...i, ...dados } : i)));
        } else {
            setItens([...itens, { id: crypto.randomUUID(), ...dados }]);
        }
        limpar();
    }

    function iniciarEdicao(item) {
        setEditandoId(item.id);
        setNome(item.nome);
        setPreco(item.preco ?? '');
    }

    function remover(item) {
        if (window.confirm(`Deseja realmente excluir o ${nomeDoTipo} "${item.nome}"?`)) {
            setItens(itens.filter((i) => i.id !== item.id));
            if (editandoId === item.id) limpar();
        }
    }

    // Enter dentro do input adiciona o item (sem isso, o Enter salvaria o prato inteiro)
    function aoTeclar(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            salvar();
        }
    }

    return (
        <div style={est.secao}>
            <h3 style={est.titulo}>{titulo}</h3>
            <p style={est.descricao}>{descricao}</p>

            <div style={est.caixa}>
                {itens.length === 0 && <p style={est.vazio}>{vazio}</p>}

                {itens.map((item) => (
                    <div key={item.id} style={{ ...est.linha, ...(editandoId === item.id ? { borderColor: '#C49A45' } : {}) }}>
                        <span style={est.linhaNome}>{item.nome}</span>
                        {comPreco && <span style={est.linhaPreco}>R$ {item.preco}</span>}
                        <button type="button" style={est.iconeBtn} aria-label={`Editar ${item.nome}`} onClick={() => iniciarEdicao(item)}>
                            <Edit2 size={16} color="#C49A45" />
                        </button>
                        <button type="button" style={est.iconeBtn} aria-label={`Excluir ${item.nome}`} onClick={() => remover(item)}>
                            <Trash2 size={16} color="#888" />
                        </button>
                    </div>
                ))}

                <div style={est.formInline}>
                    <input
                        type="text"
                        style={est.input}
                        placeholder={placeholderNome}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        onKeyDown={aoTeclar}
                    />
                    {comPreco && (
                        <input
                            type="text"
                            inputMode="decimal"
                            style={{ ...est.input, ...est.inputPreco }}
                            placeholder="2,00"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            onKeyDown={aoTeclar}
                        />
                    )}
                </div>

                <button type="button" style={estiloBotao(!formularioValido)} onClick={salvar} disabled={!formularioValido}>
                    {editandoId ? 'Salvar alteração' : textoBotao}
                </button>

                {editandoId && (
                    <button type="button" style={est.btnLink} onClick={limpar}>Cancelar edição</button>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
// Tamanhos: Pequeno / Médio / Grande — liga/desliga e acréscimo no preço
// ---------------------------------------------------------------
function SecaoTamanhos({ tamanhos, setTamanhos }) {
    function alternar(id) {
        setTamanhos(tamanhos.map((t) => (t.id === id ? { ...t, ativo: !t.ativo } : t)));
    }

    function mudarPreco(id, valor) {
        setTamanhos(tamanhos.map((t) => (t.id === id ? { ...t, preco: valor } : t)));
    }

    return (
        <div style={est.secao}>
            <h3 style={est.titulo}>Tamanhos disponíveis</h3>
            <p style={est.descricao}>Marque os tamanhos em que este prato é vendido e, se quiser, o acréscimo no preço.</p>

            <div style={est.caixa}>
                {tamanhos.map((tam) => (
                    <div key={tam.id} style={est.linha}>
                        <input
                            type="checkbox"
                            style={est.check}
                            checked={tam.ativo}
                            onChange={() => alternar(tam.id)}
                            aria-label={`Disponibilizar tamanho ${tam.nome}`}
                        />
                        <span style={est.linhaNome}>{tam.nome}</span>
                        <input
                            type="text"
                            inputMode="decimal"
                            style={{ ...est.input, ...est.inputPreco, opacity: tam.ativo ? 1 : 0.5 }}
                            placeholder="+ R$ 0,00"
                            value={tam.preco}
                            disabled={!tam.ativo}
                            onChange={(e) => mudarPreco(tam.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
// Combos: até 3 opções montadas com produtos já cadastrados
// ---------------------------------------------------------------
function SecaoCombos({ combos, produtos, onAdicionar, onEditar, onExcluir }) {
    const limiteAtingido = combos.length >= MAX_OPCOES_COMBO;

    return (
        <div style={est.secao}>
            <h3 style={est.titulo}>Monte as opções do combo</h3>
            <p style={est.descricao}>
                Defina tudo o que o cliente pode selecionar para personalizar o combo dele. (máximo {MAX_OPCOES_COMBO} opções)
            </p>

            <div style={est.caixa}>
                {combos.length === 0 && <p style={est.vazio}>Nenhuma opção de combo cadastrada.</p>}

                {combos.map((combo) => {
                    const itens = produtosDoCombo(combo, produtos);
                    const miniatura = itens.find((p) => p.imagem)?.imagem;

                    return (
                        <div key={combo.id} style={est.linha}>
                            <div style={est.thumb}>
                                {miniatura ? <img src={miniatura} alt={combo.nome} style={est.thumbImg} /> : 'Sem imagem'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={est.comboNome}>{combo.nome}</div>
                                {itens.length > 0 && <div style={est.comboItens}>{itens.map((p) => p.nome).join(' + ')}</div>}
                            </div>

                            <span style={est.linhaPreco}>+ R$ {combo.preco}</span>

                            <button type="button" style={est.iconeBtn} aria-label={`Editar ${combo.nome}`} onClick={() => onEditar(combo)}>
                                <Edit2 size={16} color="#C49A45" />
                            </button>
                            <button type="button" style={est.iconeBtn} aria-label={`Excluir ${combo.nome}`} onClick={() => onExcluir(combo)}>
                                <Trash2 size={16} color="#888" />
                            </button>
                        </div>
                    );
                })}

                <button type="button" style={estiloBotao(limiteAtingido)} onClick={onAdicionar} disabled={limiteAtingido}>
                    {limiteAtingido ? 'Limite de opções atingido' : 'Adicionar opção de combo'}
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
// Modal para criar/editar UMA opção de combo (abre por cima do modal de prato)
// ---------------------------------------------------------------
function ModalCombo({ combo, categorias, produtos, produtoAtualId, onSalvar, onFechar }) {
    const [nome, setNome] = useState(combo?.nome || '');
    const [preco, setPreco] = useState(combo?.preco || '');
    const [selecionados, setSelecionados] = useState(combo?.produtosIds || []);

    // O próprio prato que está sendo editado não entra no combo dele
    const disponiveis = produtos.filter((p) => p.id !== produtoAtualId);

    function alternar(id) {
        setSelecionados((atuais) => (atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id]));
    }

    function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!nome.trim() || selecionados.length === 0) return;
        onSalvar({ nome: nome.trim(), preco: preco.trim(), produtosIds: selecionados });
    }

    const semSelecao = selecionados.length === 0;

    return (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-conteudo" style={{ maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
                <button type="button" className="modal-fechar modal-fechar-prato" onClick={onFechar} aria-label="Fechar">
                    <X size={22} />
                </button>

                <h2 className="modal-titulo modal-titulo-prato">{combo ? 'Editar opção de combo' : 'Nova opção de combo'}</h2>
                <p className="modal-subtitulo modal-subtitulo-prato">Escolha os produtos já cadastrados que fazem parte desta opção.</p>

                <form onSubmit={handleSubmit}>
                    <div style={est.campo}>
                        <label style={est.label}>Nome da opção</label>
                        <input type="text" style={est.input} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="2 Donuts + 1 Bebida" autoFocus required />
                    </div>

                    <div style={est.campo}>
                        <label style={est.label}>Valor adicional do combo R$</label>
                        <input type="text" inputMode="decimal" style={est.input} value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="18,90" required />
                        <p style={est.aviso}>Este valor é somado ao preço do prato quando o cliente escolhe esta opção.</p>
                    </div>

                    <div style={est.campo}>
                        <label style={est.label}>Produtos incluídos</label>

                        {disponiveis.length === 0 ? (
                            <p style={est.aviso}>Cadastre outros pratos primeiro para poder montar um combo.</p>
                        ) : (
                            <div style={est.listaProdutos}>
                                {categorias.map((cat) => {
                                    const daCategoria = disponiveis.filter((p) => p.categoriaId === cat.id);
                                    if (daCategoria.length === 0) return null;

                                    return (
                                        <div key={cat.id}>
                                            <div style={est.grupo}>{cat.texto}</div>
                                            {daCategoria.map((p) => {
                                                const marcado = selecionados.includes(p.id);
                                                return (
                                                    <label
                                                        key={p.id}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px',
                                                            border: `1px solid ${marcado ? '#8B5A3A' : 'transparent'}`,
                                                            background: marcado ? '#F3EEE7' : 'transparent',
                                                            cursor: 'pointer', fontSize: '14px', color: '#444',
                                                        }}
                                                    >
                                                        <input type="checkbox" style={est.check} checked={marcado} onChange={() => alternar(p.id)} />
                                                        <div style={{ ...est.thumb, width: '44px', height: '40px' }}>
                                                            {p.imagem ? <img src={p.imagem} alt={p.nome} style={est.thumbImg} /> : null}
                                                        </div>
                                                        <span style={{ flex: 1 }}>{p.nome}</span>
                                                        <span style={est.linhaPreco}>R$ {p.preco}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {disponiveis.length > 0 && semSelecao && <p style={est.aviso}>Selecione pelo menos um produto.</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={semSelecao}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#5C1D24', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: semSelecao ? 'not-allowed' : 'pointer', marginBottom: '10px', opacity: semSelecao ? 0.5 : 1 }}
                    >
                        Salvar opção
                    </button>
                    <button type="button" onClick={onFechar} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#8E806A', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
// Modal principal do prato
// ---------------------------------------------------------------
function ModalPrato({
    isOpen,
    onClose,
    onSubmit,
    isEdicao,
    categoriaNome,
    nomePrato, setNomePrato,
    descricaoPrato, setDescricaoPrato,
    precoPrato, setPrecoPrato,
    imagemPrato, onUploadImagem,
    // Listas configuráveis do prato
    ingredientes = [], setIngredientes,
    adicionais = [], setAdicionais,
    tamanhos = [], setTamanhos,
    combos = [], setCombos,
    // Necessários para montar combos com produtos já cadastrados
    categorias = [],
    produtos = [],
    produtoAtualId = null,
}) {
    // IMPORTANTE: todos os hooks ficam ANTES do "return null".
    // (useState depois de um return condicional quebra as regras dos hooks
    // e o React lança erro quando o modal abre.)
    const [comboModal, setComboModal] = useState(null); // { combo: null | objeto }

    if (!isOpen) return null;

    function salvarCombo(dados) {
        const { combo } = comboModal;
        if (combo) {
            setCombos(combos.map((c) => (c.id === combo.id ? { ...c, ...dados } : c)));
        } else {
            setCombos([...combos, { id: crypto.randomUUID(), ...dados }]);
        }
        setComboModal(null);
    }

    function excluirCombo(combo) {
        if (window.confirm(`Deseja realmente excluir a opção de combo "${combo.nome}"?`)) {
            setCombos(combos.filter((c) => c.id !== combo.id));
        }
    }

    function fechar() {
        setComboModal(null);
        onClose();
    }

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-conteudo modal-prato" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <button className="modal-fechar modal-fechar-prato" onClick={fechar} aria-label="Fechar">
                        <X size={22} />
                    </button>

                    <h2 className="modal-titulo modal-titulo-prato">
                        {isEdicao ? 'Editar Prato' : 'Novo Prato'}
                    </h2>
                    <p className="modal-subtitulo modal-subtitulo-prato">
                        Este item aparece na categoria <strong>{categoriaNome}</strong>
                    </p>

                    {/* O submit principal salva o prato inteiro */}
                    <form onSubmit={onSubmit}>
                        <label className="upload-imagem">
                            <div className="upload-imagem-area">
                                {imagemPrato ? (
                                    <img src={imagemPrato} alt="Prévia" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <ImagePlus size={32} />
                                        <span>Toque para enviar uma imagem</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={onUploadImagem} hidden />
                        </label>

                        <div className="campo-prato">
                            <label>Nome</label>
                            <input
                                type="text"
                                value={nomePrato}
                                onChange={(e) => setNomePrato(e.target.value)}
                                placeholder="Croassant de Goiabada"
                                required
                            />
                        </div>

                        <div className="campo-prato">
                            <label>Descrição</label>
                            <textarea
                                value={descricaoPrato}
                                onChange={(e) => setDescricaoPrato(e.target.value)}
                                placeholder="Texto informativo sobre o prato"
                                rows={3}
                            />
                        </div>

                        <div className="campo-prato campo-preco">
                            <label>Preço R$</label>
                            <input
                                type="text"
                                value={precoPrato}
                                onChange={(e) => setPrecoPrato(e.target.value)}
                                placeholder="33,90"
                                required
                            />
                        </div>

                        {/* INGREDIENTES: o cliente poderá retirar algum */}
                        <SecaoItens
                            titulo="Ingredientes"
                            descricao="Adicione os ingredientes que compõem o prato. O cliente poderá retirar algum deles."
                            itens={ingredientes}
                            setItens={setIngredientes}
                            vazio="Nenhum ingrediente cadastrado."
                            placeholderNome="ingrediente"
                            textoBotao="Adicionar ingrediente"
                            nomeDoTipo="ingrediente"
                        />

                        {/* ADICIONAIS: extras com valor */}
                        <SecaoItens
                            titulo="Adicionais do prato"
                            descricao="Cadastre os ingredientes extras que o cliente pode escolher para turbinar o pedido."
                            itens={adicionais}
                            setItens={setAdicionais}
                            comPreco
                            vazio="Nenhum adicional cadastrado."
                            placeholderNome="adicional"
                            textoBotao="Adicionar adicional"
                            nomeDoTipo="adicional"
                        />

                        {/* TAMANHOS */}
                        <SecaoTamanhos tamanhos={tamanhos} setTamanhos={setTamanhos} />

                        {/* COMBOS */}
                        <SecaoCombos
                            combos={combos}
                            produtos={produtos}
                            onAdicionar={() => setComboModal({ combo: null })}
                            onEditar={(combo) => setComboModal({ combo })}
                            onExcluir={excluirCombo}
                        />

                        {/* Botões Finais de Salvar o Prato Inteiro */}
                        <button type="submit" className="btn-modal btn-modal-primario" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#5C1D24', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
                            Salvar alterações
                        </button>
                        <button type="button" className="btn-modal btn-modal-secundario" onClick={fechar} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#8E806A', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>

            {/* Fora do <form> do prato, para não aninhar formulários */}
            {comboModal && (
                <ModalCombo
                    key={comboModal.combo?.id || 'novo'}
                    combo={comboModal.combo}
                    categorias={categorias}
                    produtos={produtos}
                    produtoAtualId={produtoAtualId}
                    onSalvar={salvarCombo}
                    onFechar={() => setComboModal(null)}
                />
            )}
        </>
    );
}

export default ModalPrato;