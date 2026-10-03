import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/cliente/Home';
import Cardapio from './pages/cliente/Cardapio';
import Preferencias from './pages/adm/Preferencias';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/cardapio' element={<Cardapio/>}/>
      <Route path='/preferencias' element={<Preferencias/>}/>
    </Routes>
  );
}

export default App;