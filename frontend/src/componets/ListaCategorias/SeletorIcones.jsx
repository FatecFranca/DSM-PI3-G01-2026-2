
import {
  FaMugHot,
  FaPizzaSlice,
  FaBurger,
  FaCakeCandles,
  FaIceCream,
  FaCookieBite,
  FaBreadSlice,
  FaGlassWater,
  FaBottleWater,
  FaAppleWhole,
  FaFish,
  FaEgg,
  FaCheese,
  FaLeaf,
  FaUtensils,
  FaMartiniGlass,
  FaHotdog,
  FaBowlFood,
  FaDrumstickBite,
  FaShrimp,
  FaPepperHot,
  FaCarrot,
  FaLemon,
  FaSeedling,
  FaWineGlass,
  FaBacon,
  FaCandyCane,
  FaPlateWheat,
} from 'react-icons/fa6'

import './ListaCategorias.css'

export const iconesDisponiveis = [
  { nome: 'FaMugHot', componente: FaMugHot },
  { nome: 'FaPizzaSlice', componente: FaPizzaSlice },
  { nome: 'FaBurger', componente: FaBurger },
  { nome: 'FaCakeCandles', componente: FaCakeCandles },
  { nome: 'FaIceCream', componente: FaIceCream },
  { nome: 'FaCookieBite', componente: FaCookieBite },
  { nome: 'FaBreadSlice', componente: FaBreadSlice },
  { nome: 'FaGlassWater', componente: FaGlassWater },
  { nome: 'FaBottleWater', componente: FaBottleWater },
  { nome: 'FaAppleWhole', componente: FaAppleWhole },
  { nome: 'FaFish', componente: FaFish },
  { nome: 'FaEgg', componente: FaEgg },
  { nome: 'FaCheese', componente: FaCheese },
  { nome: 'FaLeaf', componente: FaLeaf },
  { nome: 'FaUtensils', componente: FaUtensils },
  { nome: 'FaMartiniGlass', componente: FaMartiniGlass },
  { nome: 'FaHotdog', componente: FaHotdog },
  { nome: 'FaBowlFood', componente: FaBowlFood },
  { nome: 'FaDrumstickBite', componente: FaDrumstickBite },
  { nome: 'FaShrimp', componente: FaShrimp },
  { nome: 'FaPepperHot', componente: FaPepperHot },
  { nome: 'FaCarrot', componente: FaCarrot },
  { nome: 'FaLemon', componente: FaLemon },
  { nome: 'FaSeedling', componente: FaSeedling },
  { nome: 'FaWineGlass', componente: FaWineGlass },
  { nome: 'FaBacon', componente: FaBacon },
  { nome: 'FaCandyCane', componente: FaCandyCane },
  { nome: 'FaPlateWheat', componente: FaPlateWheat },
]

function SeletorIcones({ iconeSelecionado, onSelecionar }) {
  return (
    <div className="seletor-icones">
      <p>Escolha o ícone da categoria</p>

      <div className="grade-icones">
        {iconesDisponiveis.map(({ nome, componente: Icone }) => (
          <button
            key={nome}
            type="button"
            title={nome}
            aria-label={`Selecionar ${nome}`}
            aria-pressed={iconeSelecionado === nome}
            className={`celula-icone ${
              iconeSelecionado === nome ? 'selecionado' : ''
            }`}
            onClick={() => onSelecionar(nome)}
          >
            <Icone />
          </button>
        ))}
      </div>
    </div>
  )
}

export default SeletorIcones
