
import { useState } from 'react'

import { useCardapio } from '../../context/CardapioContext'

import SeletorIcones, {
  iconesDisponiveis,
} from './SeletorIcones'

import './ListaCategorias.css'

function ListaCategorias() {
  const {
    categorias,
    adicionarCategoria,
    editarCategoria,
    excluirCategoria,
  } = useCardapio()

  const [nome, setNome] = useState('')
  const [icone, setIcone] = useState('FaMugHot')
  const [editandoId, setEditandoId] = useState(null)

  function cancelarEdicao() {
    setEditandoId(null)
    setNome('')
    setIcone('FaMugHot')
  }

  function salvarCategoria(event) {
    event.preventDefault()

    const nomeFormatado = nome.trim()

    if (!nomeFormatado) {
      alert('Digite o nome da categoria.')
      return
    }

    const nomeJaExiste = categorias.some(
      (categoria) =>
        categoria.texto.toLowerCase() ===
          nomeFormatado.toLowerCase() &&
        categoria.id !== editandoId
    )

    if (nomeJaExiste) {
      alert('Essa categoria já existe.')
      return
    }

    if (editandoId) {
      editarCategoria(editandoId, nomeFormatado, icone)
    } else {
      adicionarCategoria(nomeFormatado, icone)
    }

    cancelarEdicao()
  }

  function iniciarEdicao(categoria) {
    setEditandoId(categoria.id)
    setNome(categoria.texto)

    const iconeValido = iconesDisponiveis.some(
      (item) => item.nome === categoria.icone
    )

    setIcone(iconeValido ? categoria.icone : 'FaMugHot')
  }

  function removerCategoria(id) {
    const confirmou = window.confirm(
      'Deseja realmente excluir esta categoria?'
    )

    if (confirmou) {
      excluirCategoria(id)

      if (editandoId === id) {
        cancelarEdicao()
      }
    }
  }

  function renderizarIcone(nomeIcone) {
    const item = iconesDisponiveis.find(
      (iconeItem) => iconeItem.nome === nomeIcone
    )

    if (!item) return null

    const Icone = item.componente

    return <Icone aria-hidden="true" />
  }

  return (
    <section className="lista-categorias">
      <h2>Gerenciar categorias</h2>

      <form onSubmit={salvarCategoria}>
        <label htmlFor="nome-categoria">
          Nome da categoria
        </label>

        <input
          id="nome-categoria"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Digite o nome da categoria"
          required
        />

        <SeletorIcones
          iconeSelecionado={icone}
          onSelecionar={setIcone}
        />

        <div className="previa-categoria">
          <span>Prévia:</span>

          <span className="icone-previa">
            {renderizarIcone(icone)}
          </span>

          <span>{nome || 'Nome da categoria'}</span>
        </div>

        <button type="submit" className="botao-salvar">
          {editandoId
            ? 'Salvar alterações'
            : 'Adicionar categoria'}
        </button>

        {editandoId && (
          <button
            type="button"
            className="botao-cancelar"
            onClick={cancelarEdicao}
          >
            Cancelar edição
          </button>
        )}
      </form>

      <h3>Categorias cadastradas</h3>

      {categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <ul className="itens-categorias">
          {categorias.map((categoria) => (
            <li key={categoria.id} className="item-categoria">
              <div className="categoria-info">
                <span className="icone-categoria">
                  {renderizarIcone(categoria.icone)}
                </span>

                <span>{categoria.texto}</span>
              </div>

              <div className="acoes-categoria">
                <button
                  type="button"
                  onClick={() => iniciarEdicao(categoria)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => removerCategoria(categoria.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaCategorias
