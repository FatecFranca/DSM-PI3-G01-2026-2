import React from 'react';
import { Plus, Trash2, Edit3 } from "lucide-react";
import { iconesDisponiveis } from "../../../componets/ListaCategorias/SeletorIcones";
import { FaUtensils } from "react-icons/fa6";

function SecaoCategoria({ 
    categoria, 
    produtos, 
    onExcluirCategoria, 
    onAbrirNovoPrato, 
    onEditarPrato, 
    onExcluirProduto 
}) {
    function renderizarIcone(nomeIcone) {
        const item = iconesDisponiveis.find((i) => i.nome === nomeIcone);
        if (!item) return <FaUtensils />;
        const Componente = item.componente;
        return <Componente />;
    }

    const produtosDaCategoria = produtos.filter((p) => p.categoriaId === categoria.id);

    return (
        <section>
            <div className="categoria-cabecalho">
                <div>
                    <div className="categoria-titulo">
                        {renderizarIcone(categoria.icone)}
                        <h2>{categoria.texto}</h2>
                    </div>

                    <p className="categoria-contagem">
                        {produtosDaCategoria.length} item(ns) nesta categoria
                    </p>
                </div>

                <button
                    className="btn-excluir-categoria"
                    onClick={() => onExcluirCategoria(categoria.id)}
                >
                    <Trash2 size={16} />
                    <span>Excluir</span>
                </button>
            </div>

            <button
                className="btn-adicionar-prato"
                onClick={onAbrirNovoPrato}
            >
                <Plus size={20} />
                <span>Adicionar novo prato a esta categoria</span>
            </button>

            <div className="lista-pratos">
                {produtosDaCategoria.length === 0 ? (
                    <p className="lista-vazia">Nenhum prato cadastrado nesta categoria.</p>
                ) : (
                    produtosDaCategoria.map((produto) => (
                        <article className="prato-card" key={produto.id}>
                            <div className="prato-informacoes">
                                <h3>{produto.nome}</h3>
                                <p className="prato-descricao">{produto.descricao}</p>
                                <span className="prato-preco">R$ {produto.preco}</span>

                                <div className="prato-acoes">
                                    <button
                                        className="btn-editar"
                                        onClick={() => onEditarPrato(produto)}
                                    >
                                        <Edit3 size={14} />
                                        <span>Editar</span>
                                    </button>

                                    <button
                                        className="btn-excluir-prato"
                                        aria-label={`Excluir ${produto.nome}`}
                                        onClick={() => onExcluirProduto(produto)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="prato-imagem">
                                {produto.imagem ? (
                                    <img src={produto.imagem} alt={produto.nome} />
                                ) : (
                                    <span>Sem imagem</span>
                                )}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}

export default SecaoCategoria;