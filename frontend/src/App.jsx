import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/cliente/Home';
import Cardapio from './pages/cliente/Cardapio';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/cardapio' element={<Cardapio/>}/>
    </Routes>
  );
}

export default App;