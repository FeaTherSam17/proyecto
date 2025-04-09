import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',  // Asegúrate de usar "username" aquí, no "usuario"
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,  // Aquí debe coincidir con "username" del servidor
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la autenticación');
      }

      const data = await response.json();
      if (data.success) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirección basada en el rol
        switch (data.user.role) {
          case 1:
            navigate('/AdminDashboard');
            break;
          case 2:
            navigate('/Almacenista');
            break;
          case 3:
            navigate('/Cajero');
            break;
          case 4:
            navigate('/Jardinero');
            break;
          default:
            setError('Rol no reconocido');
        }
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError(err.message.includes('Failed to fetch') 
        ? 'No se pudo conectar al servidor' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <h1>GreenHouse Portal</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">
              <span className="input-icon">👤</span>
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              value={credentials.username}  // Usa "username" en lugar de "usuario"
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value.trim()  // Actualiza "username" aquí
              })}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <span className="input-icon">🔒</span>
              Contraseña
            </label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
                required
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="eye-icon" />
                ) : (
                  <EyeIcon className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Verificando...' : 'Ingresar al sistema'}
          </button>
        </form>

        <div className="about-section">
          <div className="about-content">
            <h3>Acerca del sistema</h3>
            <p>Versión 2.0 - Sistema de administración para invernaderos</p>
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
