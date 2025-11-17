// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import MenuLateral from './MenuLateral';
import UserProfile from './UserProfile';
import '../App.css';

export default function Layout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // En desktop no necesitamos el overlay
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="AppLayout">
      {/* Overlay para cerrar menú en móvil */}
      {isMenuOpen && (
        <div className="MenuOverlay" onClick={handleCloseMenu} />
      )}

      <MenuLateral
        onProfileClick={handleToggleProfile}
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
      />

      <main className="AppContent">
        {/* Botón hamburguesa para móviles */}
        <button className="MenuToggleButton" onClick={handleToggleMenu}>
          <FaBars size={20} />
        </button>

        <Outlet />
      </main>

      <UserProfile isOpen={isProfileOpen} onToggle={handleToggleProfile} />
    </div>
  );
}
