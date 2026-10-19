import React from 'react';
import { X } from "lucide-react";
import { iconesDisponiveis } from "../../../componets/ListaCategorias/SeletorIcones";

function ModalCategoria({ isOpen, onClose, onSubmit, nomeCat, setNomeCat, iconeCat, setIconeCat }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-conteudo">
                <button className="modal-fechar" onClick={onClose} aria-label="Fechar">
                    <X size={22} />
                </button>

                <h2 className="modal-titulo">Nova Categoria</h2>
                <p className="modal-subtitulo">Agrupe os seus itens, como "Pizzas", "Bebidas" ou "Sobremesas"</p>

                <form onSubmit={onSubmit}>
                    <div className="campo-categoria">
                        <label htmlFor="nome-categoria">Nome da Categoria</label>
                        <input
                            id="nome-categoria"
                            type="text"
                            value={nomeCat}
                            onChange={(e) => setNomeCat(e.target.value)}
                            placeholder="Ex: Pizzas Salgadas"
                            required
                        />
                    </div>

                    <div className="campo-icones">
                        <label>Ícone</label>
                        <div className="grade-icones">
                            {iconesDisponiveis.map(({ nome, componente: IconComponent }) => (
                                <button
                                    key={nome}
                                    type="button"
                                    className={`icone-opcao ${iconeCat === nome ? 'icone-selecionado' : ''}`}
                                    onClick={() => setIconeCat(nome)}
                                >
                                    <IconComponent />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-modal btn-modal-primario">
                        Criar categoria
                    </button>
                    <button type="button" className="btn-modal btn-modal-secundario" onClick={onClose}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalCategoria;