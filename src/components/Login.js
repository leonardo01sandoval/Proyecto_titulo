// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChartBar, FaLock, FaUser } from 'react-icons/fa';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginContainer">
        <div className="LoginBox">
          <div className="LoginHeader">
            <div className="LoginLogo">
              <FaChartBar size={32} />
            </div>
            <h1 className="LoginTitle">Dashboard de Gestión de Chats</h1>
            <p className="LoginSubtitle">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="LoginForm">
            {error && (
              <div className="LoginError">
                {error}
              </div>
            )}

            <div className="FormGroup">
              <label className="FormLabel">
                <FaUser size={14} /> Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="FormInput"
                placeholder="Tu nombre de usuario"
                required
                autoComplete="username"
              />
            </div>

            <div className="FormGroup">
              <label className="FormLabel">
                <FaLock size={14} /> Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="FormInput"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="LoginButton"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          <div className="LoginFooter">
            <p className="login-hint">
              Usuario de prueba: <strong>ramrez</strong> | Contraseña: <strong>ramrez</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
