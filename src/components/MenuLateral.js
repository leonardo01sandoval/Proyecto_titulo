// src/components/MenuLateral.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaComments, FaUsers, FaTable, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function MenuLateral({ onProfileClick, isOpen, onClose }) {
  const { currentUser } = useAuth();

  const handleLinkClick = () => {
    // Cerrar menú en móvil al hacer click en un link
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <aside className={`MenuLateral ${isOpen ? 'open' : ''}`}>
      <NavLink to="/" className="MenuLateral-brand" onClick={handleLinkClick}>
        <FaChartBar size={22} /> LLM Dashboard
      </NavLink>
      <nav className="MenuLateral-nav">
        <NavLink to="/" end className="MenuLateral-link" onClick={handleLinkClick}>
          Dashboard
        </NavLink>
        <NavLink to="/chats" className="MenuLateral-link" onClick={handleLinkClick}>
          Chats
        </NavLink>
        <NavLink to="/clientes" className="MenuLateral-link" onClick={handleLinkClick}>
          Clientes
        </NavLink>
        <NavLink to="/datatable" className="MenuLateral-link" onClick={handleLinkClick}>
          Datos
        </NavLink>
      </nav>

      {/* Perfil de Usuario */}
      {currentUser && (
        <div className="MenuLateral-profile">
          <button className="ProfileButton-menu" onClick={onProfileClick}>
            <div className="ProfileButton-avatar">
              <FaUser size={16} />
            </div>
            <div className="ProfileButton-info">
              <div className="ProfileButton-name">{currentUser.name}</div>
              <div className="ProfileButton-email">{currentUser.email}</div>
            </div>
          </button>
        </div>
      )}

      <footer className="MenuLateral-footer">v1.0 • Leonardo Sandoval</footer>
    </aside>
  );
}
