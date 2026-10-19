
import { Routes, Route } from 'react-router-dom';
import Home from './pages/cliente/Home';               // pagina de abertura cliente.
import Cardapio from './pages/cliente/Cardapio';      // mostra as opções de itens do carrdapio disponiveis para os clientes
import Preferencias from './pages/adm/Preferencias'; // edita preferencias de aparencia do sistema
import Menu from './pages/adm/Menu';                // página de menu que mostra as categorias q tem em adm


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/cardapio' element={<Cardapio/>}/>
      <Route path='/preferencias' element={<Preferencias/>}/>
      <Route path='/menu' element={<Menu/>}/>
    </Routes>
  );
}

export default App;