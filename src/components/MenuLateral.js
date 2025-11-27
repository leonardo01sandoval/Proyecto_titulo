// src/components/MenuLateral.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaComments, FaUsers, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

export default function MenuLateral({ onProfileClick }) {
  const { currentUser } = useAuth();

  const getUserName = () => {
    if (!currentUser) return 'Usuario';
    return currentUser.username || currentUser.first_name || 'Usuario';
  };

  const getUserEmail = () => {
    if (!currentUser) return '';
    return currentUser.email || '';
  };

  return (
    <aside className="MenuLateral">
      <NavLink to="/dashboard" className="MenuLateral-brand">
        <FaChartBar size={22} /> Chat Dashboard
      </NavLink>
      <nav className="MenuLateral-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `MenuLateral-link ${isActive ? 'active' : ''}`}
        >
          <FaChartBar size={16} /> Dashboard
        </NavLink>
        <NavLink
          to="/chats"
          className={({ isActive }) => `MenuLateral-link ${isActive ? 'active' : ''}`}
        >
          <FaComments size={16} /> Chats
        </NavLink>
        <NavLink
          to="/clientes"
          className={({ isActive }) => `MenuLateral-link ${isActive ? 'active' : ''}`}
        >
          <FaUsers size={16} /> Clientes
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
              <div className="ProfileButton-name">{getUserName()}</div>
              <div className="ProfileButton-email">{getUserEmail()}</div>
            </div>
          </button>
        </div>
      )}

      <footer className="MenuLateral-footer">v1.0 • Chat Analytics</footer>
    </aside>
  );
}
