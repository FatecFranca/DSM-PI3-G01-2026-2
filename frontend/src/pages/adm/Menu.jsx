import { useState } from "react";
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";
import { useCardapio } from "../../context/CardapioContext";

import BarraCategorias from "./Components/BarraCategorias";
import SecaoCategoria from "./Components/SecaoCategoria";
import ModalCategoria from "./Components/ModalCategoria";
import ModalPrato from "./Components/ModalPrato";

import "../../styles/MenuAdm.css";

// Tamanhos padrão de todo prato novo (o admin marca quais valem)
function copiarTamanhos() {
    return [
        { id: 'tam-pequeno', nome: 'Pequeno', preco: '', ativo: false },
        { id: 'tam-medio', nome: 'Médio', preco: '', ativo: false },
        { id: 'tam-grande', nome: 'Grande', preco: '', ativo: false },
    ];
}

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

    // Listas configuráveis do prato (o cliente vê isso ao escolher o produto)
    const [ingredientesPrato, setIngredientesPrato] = useState([]); // [{ id, nome }]
    const [adicionaisPrato, setAdicionaisPrato] = useState([]);     // [{ id, nome, preco }]
    const [tamanhosPrato, setTamanhosPrato] = useState(copiarTamanhos()); // [{ id, nome, preco, ativo }]
    const [combosPrato, setCombosPrato] = useState([]);             // [{ id, nome, preco, produtosIds }]

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
            imagem: imagemPrato,
            ingredientes: ingredientesPrato,
            adicionais: adicionaisPrato,
            tamanhos: tamanhosPrato,
            combos: combosPrato
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
        setIngredientesPrato([]);
        setAdicionaisPrato([]);
        setTamanhosPrato(copiarTamanhos());
        setCombosPrato([]);
        setIsModalPratoOpen(true);
    }

    function abrirModalEditarPrato(produto) {
        setPratoEmEdicaoId(produto.id);
        setNomePrato(produto.nome);
        setDescricaoPrato(produto.descricao);
        setPrecoPrato(produto.preco);
        setImagemPrato(produto.imagem || '');
        // Pratos antigos podem não ter esses campos ainda
        setIngredientesPrato(produto.ingredientes || []);
        setAdicionaisPrato(produto.adicionais || []);
        setTamanhosPrato(produto.tamanhos?.length ? produto.tamanhos : copiarTamanhos());
        setCombosPrato(produto.combos || []);
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
                ingredientes={ingredientesPrato}
                setIngredientes={setIngredientesPrato}
                adicionais={adicionaisPrato}
                setAdicionais={setAdicionaisPrato}
                tamanhos={tamanhosPrato}
                setTamanhos={setTamanhosPrato}
                combos={combosPrato}
                setCombos={setCombosPrato}
                categorias={categorias}
                produtos={produtos}
                produtoAtualId={pratoEmEdicaoId}
            />
        </div>
    );
}

export default Menu;