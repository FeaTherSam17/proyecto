// Importación de hooks y librerías necesarias
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/logo.png';

// Componente funcional para el formulario de login
const Login = () => {
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estado para las credenciales del usuario
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Estado para manejar errores y estado de carga
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Petición POST al backend para autenticación
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      // Se convierte la respuesta en JSON
      const data = await response.json();

      // Si hubo error, se lanza una excepción
      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      // Si el login fue exitoso
      if (data.success) {
        // Se guarda el usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('id_usuario', JSON.stringify(data.user.id_usuario));

        // Redirige según el rol del usuario
        switch (data.user.role) {
          case 1: navigate('/AdminDashboard'); break;
          case 2: navigate('/Almacenista'); break;
          case 3: navigate('/Cajero'); break;
          case 4: navigate('/Jardinero'); break;
          default: setError('Rol no reconocido');
        }
      }
    } catch (err) {
      // Muestra mensaje si no se puede conectar o si hay otro error
      setError(err.message.includes('Failed to fetch') 
        ? 'No se pudo conectar al servidor' 
        : err.message);
    } finally {
      // Finaliza el estado de carga
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

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Muestra mensaje de error si existe */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Campo para el nombre de usuario */}
          <div className="input-group">
            <label htmlFor="username">
              <span className="input-icon">👤</span>
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value.trim()
              })}
              required
              autoComplete="username"
            />
          </div>

          {/* Campo para la contraseña con opción de mostrarla */}
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

          {/* Botón para enviar el formulario */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Verificando...' : 'Ingresar al sistema'}
          </button>
        </form>

        {/* Sección informativa del sistema */}
        <div className="about-section">
          <div className="about-content">
            <h3>Acerca del sistema</h3>
            <p>Versión 1.4.2 (Estable) - Sistema de administración para invernaderos</p>
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
