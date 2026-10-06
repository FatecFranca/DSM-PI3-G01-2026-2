import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MenuAba.css';

export default function MenuAba() {
  const navigate = useNavigate();
  const location = useLocation();

  // Descobre qual aba está ativa com base na URL
  const abaAtiva = location.pathname === '/menu' ? 'menu' : 'aparencia';

  return (
    <div className="container-abas">
      
      {/* Botão Menu */}
      <button 
        className={`botao-aba ${abaAtiva === 'menu' ? 'ativo' : ''}`}
        onClick={() => navigate('/menu')}
      >
        {/* Se a aba for menu, renderiza a pílula animada por trás do texto */}
        {abaAtiva === 'menu' && (
          <motion.div 
            className="fundo-deslizante" 
            layoutId="pill" // <--- É isso que faz o efeito de deslizar!
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="texto-botao">Menu</span>
      </button>

      {/* Botão Aparência */}
      <button 
        className={`botao-aba ${abaAtiva === 'aparencia' ? 'ativo' : ''}`}
        onClick={() => navigate('/preferencias')}
      >
        {/* Se a aba for aparência, a pílula desliza para cá */}
        {abaAtiva === 'aparencia' && (
          <motion.div 
            className="fundo-deslizante" 
            layoutId="pill" 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="texto-botao">Aparência</span>
      </button>

    </div>
  );
}