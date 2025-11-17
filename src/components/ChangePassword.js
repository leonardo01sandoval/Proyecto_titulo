// src/components/ChangePassword.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLock, FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function ChangePassword({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = updatePassword(formData.currentPassword, formData.newPassword);

      if (result.success) {
        setSuccess(true);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (success) {
    return (
      <div className="ChangePasswordModal">
        <div className="ModalHeader">
          <h3 className="ModalTitle">Cambiar Contraseña</h3>
          <button onClick={handleClose} className="ModalClose">
            <FaTimes />
          </button>
        </div>
        <div className="SuccessMessage">
          <FaCheckCircle size={48} className="SuccessIcon" />
          <p className="SuccessText">
            ¡Contraseña actualizada exitosamente!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ChangePasswordModal">
      <div className="ModalHeader">
        <h3 className="ModalTitle">Cambiar Contraseña</h3>
        <button onClick={handleClose} className="ModalClose">
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ModalForm">
        {error && (
          <div className="LoginError">
            {error}
          </div>
        )}

        <div className="FormGroup">
          <label className="FormLabel">
            <FaLock size={14} /> Contraseña Actual
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="FormInput"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="FormGroup">
          <label className="FormLabel">
            <FaLock size={14} /> Nueva Contraseña
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="FormInput"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="FormGroup">
          <label className="FormLabel">
            <FaLock size={14} /> Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="FormInput"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="ModalButtons">
          <button
            type="button"
            onClick={handleClose}
            className="btn ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="LoginButton"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}
