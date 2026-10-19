import { useState } from "react";
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";
import { useCardapio } from "../../context/CardapioContext";

import BarraCategorias from "./Components/BarraCategorias";
import SecaoCategoria from "./Components/SecaoCategoria";
import ModalCategoria from "./Components/ModalCategoria";
import ModalPrato from "./Components/ModalPrato";

import "../../styles/MenuAdm.css";

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

    const [idSelecionado, setIdSelecionado] = useState("");

    const categoriaAtual =
        categorias.find((c) => c.id === idSelecionado) ?? categorias[0];

    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
    const [isModalPratoOpen, setIsModalPratoOpen] = useState(false);
    const [pratoEmEdicaoId, setPratoEmEdicaoId] = useState(null);

    // Estados do Formulário de Categoria
    const [nomeCat, setNomeCat] = useState('');
    const [iconeCat, setIconeCat] = useState('FaUtensils');

    // Estados do Formulário de Prato
    const [nomePrato, setNomePrato] = useState('');
    const [descricaoPrato, setDescricaoPrato] = useState('');
    const [precoPrato, setPrecoPrato] = useState('');
    const [imagemPrato, setImagemPrato] = useState('');

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
            categoriaId: categoriaAtual.id,
            nome: nomePrato,
            descricao: descricaoPrato,
            preco: precoPrato,
            imagem: imagemPrato
        };

        if (pratoEmEdicaoId) {
            editarProduto(pratoEmEdicaoId, dadosPrato);
        } else {
            adicionarProduto(dadosPrato);
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
            reader.onloadend = () => setImagemPrato(reader.result);
            reader.readAsDataURL(file);
        }
    }

    function handleExcluirCategoria(id) {
        if (window.confirm("Deseja realmente excluir esta categoria e os seus produtos?")) {
            excluirCategoria(id);
            setIdSelecionado("");
        }
    }

    function handleExcluirProduto(produto) {
        if (window.confirm(`Deseja realmente excluir o prato "${produto.nome}"?`)) {
            excluirProduto(produto.id);
        }
    }

    return (
        <div className="menu-page">
            <Header />
            <MenuAba />

            <main className="menu-container">
                <BarraCategorias
                    categorias={categorias}
                    categoriaAtivaId={categoriaAtual?.id}
                    onSelecionar={setIdSelecionado}
                    onAbrirModalCategoria={() => setIsModalCategoriaOpen(true)}
                />

                {categoriaAtual ? (
                    <SecaoCategoria
                        categoria={categoriaAtual}
                        produtos={produtos}
                        onExcluirCategoria={handleExcluirCategoria}
                        onAbrirNovoPrato={abrirModalNovoPrato}
                        onEditarPrato={abrirModalEditarPrato}
                        onExcluirProduto={handleExcluirProduto}
                    />
                ) : (
                    <p className="nenhuma-categoria">
                        Nenhuma categoria cadastrada. Clique em "Categorias" para criar uma.
                    </p>
                )}
            </main>

            <ModalCategoria
                isOpen={isModalCategoriaOpen}
                onClose={() => setIsModalCategoriaOpen(false)}
                onSubmit={handleCriarCategoria}
                nomeCat={nomeCat}
                setNomeCat={setNomeCat}
                iconeCat={iconeCat}
                setIconeCat={setIconeCat}
            />

            <ModalPrato
                isOpen={isModalPratoOpen}
                onClose={fecharModalPrato}
                onSubmit={handleSalvarPrato}
                isEdicao={!!pratoEmEdicaoId}
                categoriaNome={categoriaAtual?.texto}
                nomePrato={nomePrato}
                setNomePrato={setNomePrato}
                descricaoPrato={descricaoPrato}
                setDescricaoPrato={setDescricaoPrato}
                precoPrato={precoPrato}
                setPrecoPrato={setPrecoPrato}
                imagemPrato={imagemPrato}
                onUploadImagem={handleUploadImagem}
            />
        </div>
    );
}

export default Menu;