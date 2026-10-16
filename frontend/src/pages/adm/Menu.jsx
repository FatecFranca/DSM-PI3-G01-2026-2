
import React, { useState } from 'react';
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";
import { useCardapio } from "../../context/CardapioContext";
import IconesCategorias from "../../componets/IconesCategorias/IconesCategorias";
import { iconesDisponiveis } from "../../componets/ListaCategorias/SeletorIcones";
import { FaUtensils } from "react-icons/fa6";
import { Plus, Trash2, Edit3, X, ImagePlus } from "lucide-react";

import '../../styles/MenuAdm.css';

function Menu() {
    const {
        categorias,
        produtos,
        adicionarCategoria,
        excluirCategoria,
        adicionarProduto,
        editarProduto,
        excluirProduto
    } = useCardapio();

    const [categoriaAtiva, setCategoriaAtiva] = useState(
        categorias[0]?.id || ''
    );

    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
    const [isModalPratoOpen, setIsModalPratoOpen] = useState(false);

    const [pratoEmEdicaoId, setPratoEmEdicaoId] = useState(null);

    const [nomeCat, setNomeCat] = useState('');
    const [iconeCat, setIconeCat] = useState('FaUtensils');

    const [nomePrato, setNomePrato] = useState('');
    const [descricaoPrato, setDescricaoPrato] = useState('');
    const [precoPrato, setPrecoPrato] = useState('');
    const [imagemPrato, setImagemPrato] = useState('');

    function renderizarIcone(nomeIcone) {
        const item = iconesDisponiveis.find(
            (i) => i.nome === nomeIcone
        );

        if (!item) return <FaUtensils />;

        const Componente = item.componente;

        return <Componente />;
    }

    const categoriaAtual = categorias.find(
        (cat) => cat.id === categoriaAtiva
    );

    const produtosDaCategoria = produtos.filter(
        (p) => p.categoriaId === categoriaAtiva
    );

    function handleCriarCategoria(e) {
        e.preventDefault();

        if (!nomeCat.trim()) return;

        adicionarCategoria(nomeCat, iconeCat);

        setNomeCat('');
        setIsModalCategoriaOpen(false);
    }

    function handleSalvarPrato(e) {
        e.preventDefault();

        if (!nomePrato.trim() || !categoriaAtual) return;

        const dadosPrato = {
            nome: nomePrato,
            descricao: descricaoPrato,
            preco: precoPrato,
            imagem: imagemPrato
        };

        if (pratoEmEdicaoId) {
            editarProduto(pratoEmEdicaoId, dadosPrato);
        } else {
            adicionarProduto({
                categoriaId: categoriaAtual.id,
                ...dadosPrato
            });
        }

        fecharModalPrato();
    }

    function abrirModalNovoPrato() {
        setPratoEmEdicaoId(null);
        setNomePrato('');
        setDescricaoPrato('');
        setPrecoPrato('');
        setImagemPrato('');
        setIsModalPratoOpen(true);
    }

    function abrirModalEditarPrato(produto) {
        setPratoEmEdicaoId(produto.id);
        setNomePrato(produto.nome);
        setDescricaoPrato(produto.descricao);
        setPrecoPrato(produto.preco);
        setImagemPrato(produto.imagem || '');
        setIsModalPratoOpen(true);
    }

    function fecharModalPrato() {
        setIsModalPratoOpen(false);
        setPratoEmEdicaoId(null);
    }

    function handleUploadImagem(e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagemPrato(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }

    function handleExcluirCategoria(id) {
        if (
            window.confirm(
                "Deseja realmente excluir esta categoria e os seus produtos?"
            )
        ) {
            excluirCategoria(id);

            const restantes = categorias.filter(
                (c) => c.id !== id
            );

            setCategoriaAtiva(restantes[0]?.id || '');
        }
    }

    function handleExcluirProduto(produto) {
        if (
            window.confirm(
                `Deseja realmente excluir o prato "${produto.nome}"?`
            )
        ) {
            excluirProduto(produto.id);
        }
    }

    return (
        <div className="menu-page">
            <Header />
            <MenuAba />

            <main className="menu-container">

                {/* Categorias */}
                <div className="categorias-barra">
                    {categorias.map((cat) => (
                        <IconesCategorias
                            key={cat.id}
                            texto={cat.texto}
                            icone={renderizarIcone(cat.icone)}
                            variante="pilula"
                            ativo={categoriaAtiva === cat.id}
                            onClick={() => setCategoriaAtiva(cat.id)}
                        />
                    ))}

                    <button
                        className="btn-categorias"
                        onClick={() => setIsModalCategoriaOpen(true)}
                    >
                        <Plus size={18} />
                        <span>Categorias</span>
                    </button>
                </div>

                {/* Conteúdo da categoria */}
                {categoriaAtual ? (
                    <section>
                        <div className="categoria-cabecalho">
                            <div>
                                <div className="categoria-titulo">
                                    {renderizarIcone(categoriaAtual.icone)}
                                    <h2>{categoriaAtual.texto}</h2>
                                </div>

                                <p className="categoria-contagem">
                                    {produtosDaCategoria.length} item(ns)
                                    nesta categoria
                                </p>
                            </div>

                            <button
                                className="btn-excluir-categoria"
                                onClick={() =>
                                    handleExcluirCategoria(categoriaAtual.id)
                                }
                            >
                                <Trash2 size={16} />
                                <span>Excluir</span>
                            </button>
                        </div>

                        {/* Adicionar prato */}
                        <button
                            className="btn-adicionar-prato"
                            onClick={abrirModalNovoPrato}
                        >
                            <Plus size={20} />
                            <span>
                                Adicionar novo prato a esta categoria
                            </span>
                        </button>

                        {/* Lista de pratos */}
                        <div className="lista-pratos">
                            {produtosDaCategoria.length === 0 ? (
                                <p className="lista-vazia">
                                    Nenhum prato cadastrado nesta categoria.
                                </p>
                            ) : (
                                produtosDaCategoria.map((produto) => (
                                    <article
                                        className="prato-card"
                                        key={produto.id}
                                    >
                                        <div className="prato-informacoes">
                                            <h3>{produto.nome}</h3>

                                            <p className="prato-descricao">
                                                {produto.descricao}
                                            </p>

                                            <span className="prato-preco">
                                                R$ {produto.preco}
                                            </span>

                                            <div className="prato-acoes">
                                                <button
                                                    className="btn-editar"
                                                    onClick={() =>
                                                        abrirModalEditarPrato(
                                                            produto
                                                        )
                                                    }
                                                >
                                                    <Edit3 size={14} />
                                                    <span>Editar</span>
                                                </button>

                                                <button
                                                    className="btn-excluir-prato"
                                                    aria-label={`Excluir ${produto.nome}`}
                                                    onClick={() =>
                                                        handleExcluirProduto(
                                                            produto
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="prato-imagem">
                                            {produto.imagem ? (
                                                <img
                                                    src={produto.imagem}
                                                    alt={produto.nome}
                                                />
                                            ) : (
                                                <span>Sem imagem</span>
                                            )}
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                ) : (
                    <p className="nenhuma-categoria">
                        Nenhuma categoria cadastrada. Clique em
                        "Categorias" para criar uma.
                    </p>
                )}
            </main>

            {/* Modal: Nova categoria */}
            {isModalCategoriaOpen && (
                <div className="modal-overlay">
                    <div className="modal-conteudo">
                        <button
                            className="modal-fechar"
                            aria-label="Fechar modal"
                            onClick={() =>
                                setIsModalCategoriaOpen(false)
                            }
                        >
                            <X size={22} />
                        </button>

                        <h2 className="modal-titulo">
                            Nova Categoria
                        </h2>

                        <p className="modal-subtitulo">
                            Agrupe os seus itens, como "Pizzas",
                            "Bebidas" ou "Sobremesas"
                        </p>

                        <form onSubmit={handleCriarCategoria}>
                            <div className="campo-categoria">
                                <label htmlFor="nome-categoria">
                                    Nome da Categoria
                                </label>

                                <input
                                    id="nome-categoria"
                                    type="text"
                                    value={nomeCat}
                                    onChange={(e) =>
                                        setNomeCat(e.target.value)
                                    }
                                    placeholder="Ex: Pizzas Salgadas"
                                    required
                                />
                            </div>

                            <div className="campo-icones">
                                <label>Ícone</label>

                                <div className="grade-icones">
                                    {iconesDisponiveis.map(
                                        ({ nome, componente: IconComponent }) => (
                                            <button
                                                key={nome}
                                                type="button"
                                                aria-label={`Selecionar ícone ${nome}`}
                                                aria-pressed={iconeCat === nome}
                                                className={`icone-opcao ${
                                                    iconeCat === nome
                                                        ? 'icone-selecionado'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    setIconeCat(nome)
                                                }
                                            >
                                                <IconComponent />
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-modal btn-modal-primario"
                            >
                                Criar categoria
                            </button>

                            <button
                                type="button"
                                className="btn-modal btn-modal-secundario"
                                onClick={() =>
                                    setIsModalCategoriaOpen(false)
                                }
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Novo ou editar prato */}
            {isModalPratoOpen && (
                <div className="modal-overlay">
                    <div className="modal-conteudo modal-prato">
                        <button
                            className="modal-fechar modal-fechar-prato"
                            aria-label="Fechar modal"
                            onClick={fecharModalPrato}
                        >
                            <X size={22} />
                        </button>

                        <h2 className="modal-titulo modal-titulo-prato">
                            {pratoEmEdicaoId
                                ? 'Editar Prato'
                                : 'Novo Prato'}
                        </h2>

                        <p className="modal-subtitulo modal-subtitulo-prato">
                            Este item aparece na categoria{' '}
                            <strong>
                                {categoriaAtual?.texto}
                            </strong>
                        </p>

                        <form onSubmit={handleSalvarPrato}>
                            {/* Envio de imagem */}
                            <label className="upload-imagem">
                                <div className="upload-imagem-area">
                                    {imagemPrato ? (
                                        <img
                                            src={imagemPrato}
                                            alt="Prévia do prato"
                                        />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <ImagePlus size={32} />
                                            <span>
                                                Toque para enviar uma imagem
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadImagem}
                                    hidden
                                />
                            </label>

                            {/* Nome */}
                            <div className="campo-prato">
                                <label htmlFor="nome-prato">
                                    Nome
                                </label>

                                <input
                                    id="nome-prato"
                                    type="text"
                                    value={nomePrato}
                                    onChange={(e) =>
                                        setNomePrato(e.target.value)
                                    }
                                    placeholder="Croassant de Goiabada"
                                    required
                                />
                            </div>

                            {/* Descrição */}
                            <div className="campo-prato">
                                <label htmlFor="descricao-prato">
                                    Descrição
                                </label>

                                <textarea
                                    id="descricao-prato"
                                    value={descricaoPrato}
                                    onChange={(e) =>
                                        setDescricaoPrato(e.target.value)
                                    }
                                    placeholder="Texto informativo sobre o prato"
                                    rows={3}
                                />
                            </div>

                            {/* Preço */}
                            <div className="campo-prato campo-preco">
                                <label htmlFor="preco-prato">
                                    Preço R$
                                </label>

                                <input
                                    id="preco-prato"
                                    type="text"
                                    value={precoPrato}
                                    onChange={(e) =>
                                        setPrecoPrato(e.target.value)
                                    }
                                    placeholder="33,90"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-modal btn-modal-primario"
                            >
                                Salvar alterações
                            </button>

                            <button
                                type="button"
                                className="btn-modal btn-modal-secundario"
                                onClick={fecharModalPrato}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu;
