// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChartBar, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
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
      let result;
      if (isLogin) {
        result = login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          setError('Por favor ingresa tu nombre');
          setLoading(false);
          return;
        }
        result = register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
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
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="LoginSubtitle">
              {isLogin
                ? 'Ingresa tus credenciales para acceder'
                : 'Completa el formulario para registrarte'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="LoginForm">
            {error && (
              <div className="LoginError">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="FormGroup">
                <label className="FormLabel">
                  <FaUser size={14} /> Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="FormInput"
                  placeholder="Tu nombre completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="FormGroup">
              <label className="FormLabel">
                <FaEnvelope size={14} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="FormInput"
                placeholder="tu@email.com"
                required
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
              />
            </div>

            {isLogin && (
              <div className="FormForgot">
                <Link to="/forgot-password" className="ForgotLink">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="LoginButton"
              disabled={loading}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Crear Cuenta')}
            </button>
          </form>

          <div className="LoginFooter">
            <p>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              {' '}
              <button
                onClick={toggleMode}
                className="ToggleLink"
                type="button"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
