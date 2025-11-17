// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChartBar, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: nueva contraseña, 3: éxito
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular verificación de email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email === email);

    setTimeout(() => {
      if (userExists) {
        setStep(2);
      } else {
        setError('Email no encontrado');
      }
      setLoading(false);
    }, 500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const result = resetPassword(email, newPassword);

    setTimeout(() => {
      if (result.success) {
        setStep(3);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="LoginPage">
      <div className="LoginContainer">
        <div className="LoginBox">
          <div className="LoginHeader">
            <div className="LoginLogo">
              <FaChartBar size={32} />
            </div>
            <h1 className="LoginTitle">
              {step === 1 && 'Recuperar Contraseña'}
              {step === 2 && 'Nueva Contraseña'}
              {step === 3 && '¡Contraseña Actualizada!'}
            </h1>
            <p className="LoginSubtitle">
              {step === 1 && 'Ingresa tu email para recuperar tu cuenta'}
              {step === 2 && 'Ingresa tu nueva contraseña'}
              {step === 3 && 'Tu contraseña ha sido actualizada exitosamente'}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="LoginForm">
              {error && (
                <div className="LoginError">
                  {error}
                </div>
              )}

              <div className="FormGroup">
                <label className="FormLabel">
                  <FaEnvelope size={14} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="FormInput"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="LoginButton"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit} className="LoginForm">
              {error && (
                <div className="LoginError">
                  {error}
                </div>
              )}

              <div className="FormGroup">
                <label className="FormLabel">
                  <FaLock size={14} /> Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="FormInput"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="FormGroup">
                <label className="FormLabel">
                  <FaLock size={14} /> Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="FormInput"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="LoginButton"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="SuccessMessage">
              <FaCheckCircle size={64} className="SuccessIcon" />
              <p className="SuccessText">
                Tu contraseña ha sido actualizada correctamente.
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={handleBackToLogin}
                className="LoginButton"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}

          {step !== 3 && (
            <div className="LoginFooter">
              <p>
                <Link to="/login" className="ToggleLink">
                  Volver a iniciar sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
