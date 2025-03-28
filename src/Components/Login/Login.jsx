import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './Login.css';
import logo from './assets/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
    // Lógica de autenticación aquí
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Encabezado con logo */}
        <div className="login-header">
          <div className="logo-container">
            <img 
              src={logo} 
              alt="Logo de la empresa" 
              className="logo"
            />
            <h1>GreenHouse Portal</h1>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo Usuario */}
          <div className="input-group">
            <label htmlFor="username">
              <span className="input-icon">👤</span>
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ej: MiltonObsceno"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="input-group">
            <label htmlFor="password">
              <span className="input-icon">🔒</span>
              Contraseña
            </label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ej: P@ssw0rd123"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="eye-icon" />
                ) : (
                  <EyeIcon className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Botón de Ingreso */}
          <button type="submit" className="login-button">
            Ingresar al sistema
          </button>
        </form>

        {/* Sección "Acerca de" */}
        <div className="about-section">
          <div className="about-content">
            <h3>Acerca del sistema</h3>
            <p>Versión 1.0 - Sistema de administración para invernaderos</p>
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;