// src/components/MenuLateral.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaComments, FaUsers, FaTable } from 'react-icons/fa';
import '../App.css';

export default function MenuLateral() {
  return (
    <aside className="MenuLateral">
      <NavLink to="/" className="MenuLateral-brand">
        <FaChartBar size={22} /> LLM Dashboard
      </NavLink>
      <nav className="MenuLateral-nav">
        <NavLink to="/" end className="MenuLateral-link">
          Dashboard
        </NavLink>
        <NavLink to="/chats" className="MenuLateral-link">
          Chats
        </NavLink>
        <NavLink to="/clientes" className="MenuLateral-link">
          Clientes
        </NavLink>
        <NavLink to="/datatable" className="MenuLateral-link">
          Datos
        </NavLink>
      </nav>
      <footer className="MenuLateral-footer">v1.0 • Leonardo Sandoval</footer>
    </aside>
  );
}
