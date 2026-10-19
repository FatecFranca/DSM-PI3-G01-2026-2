import React from 'react';
import { Plus } from "lucide-react";
import IconesCategorias from "../../../componets/IconesCategorias/IconesCategorias";
import { iconesDisponiveis } from "../../../componets/ListaCategorias/SeletorIcones";
import { FaUtensils } from "react-icons/fa6";

function BarraCategorias({ categorias, categoriaAtivaId, onSelecionar, onAbrirModalCategoria }) {
    function renderizarIcone(nomeIcone) {
        const item = iconesDisponiveis.find((i) => i.nome === nomeIcone);
        if (!item) return <FaUtensils />;
        const Componente = item.componente;
        return <Componente />;
    }

    return (
        <div className="categorias-barra">
            {categorias.map((cat) => (
                <IconesCategorias
                    key={cat.id}
                    texto={cat.texto}
                    icone={renderizarIcone(cat.icone)}
                    variante="pilula"
                    ativo={categoriaAtivaId === cat.id}
                    onClick={() => onSelecionar(cat.id)}
                />
            ))}

            <button
                className="btn-categorias"
                onClick={onAbrirModalCategoria}
            >
                <Plus size={18} />
                <span>Categorias</span>
            </button>
        </div>
    );
}

export default BarraCategorias;