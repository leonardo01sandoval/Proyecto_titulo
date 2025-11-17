// src/components/UserProfile.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ChangePassword from './ChangePassword';

export default function UserProfile({ isOpen, onToggle }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
    }
  };

  const handleChangePasswordSuccess = () => {
    setTimeout(() => {
      setShowChangePassword(false);
    }, 2000);
  };

  return (
    <>
      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && (
        <div className="ProfileOverlay" onClick={onToggle} />
      )}

      {/* Panel lateral */}
      <div className={`UserProfilePanel ${isOpen ? 'open' : ''}`}>
        {/* Botón de toggle */}
        <button
          className="ProfileToggle"
          onClick={onToggle}
          title={isOpen ? 'Cerrar perfil' : 'Abrir perfil'}
        >
          {isOpen ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>

        {/* Contenido del panel */}
        <div className="ProfileContent">
          {!showChangePassword ? (
            <>
              <div className="ProfileHeader">
                <div className="ProfileAvatar">
                  <FaUser size={32} />
                </div>
                <h2 className="ProfileName">{currentUser?.name || 'Usuario'}</h2>
              </div>

              <div className="ProfileInfo">
                <div className="ProfileInfoItem">
                  <div className="ProfileInfoLabel">
                    <FaUser size={14} /> Nombre
                  </div>
                  <div className="ProfileInfoValue">
                    {currentUser?.name || 'N/A'}
                  </div>
                </div>

                <div className="ProfileInfoItem">
                  <div className="ProfileInfoLabel">
                    <FaEnvelope size={14} /> Email
                  </div>
                  <div className="ProfileInfoValue">
                    {currentUser?.email || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="ProfileActions">
                <button
                  className="ProfileButton"
                  onClick={() => setShowChangePassword(true)}
                >
                  <FaLock size={16} />
                  <span>Cambiar Contraseña</span>
                </button>

                <button
                  className="ProfileButton logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

              <div className="ProfileFooter">
                <p>v1.0 • LLM Dashboard</p>
              </div>
            </>
          ) : (
            <ChangePassword
              onClose={() => setShowChangePassword(false)}
              onSuccess={handleChangePasswordSuccess}
            />
          )}
        </div>
      </div>
    </>
  );
}
