import React, { useState, useEffect } from 'react';
import './JardineroPanel.css';
import logo from '../Login/assets/logo.png';

const JardineroPanel = () => {
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const idJardinero = 1; // ← cámbialo por el ID real del jardinero logueado

  // Cargar tareas desde el backend
  useEffect(() => {
    fetch(`http://localhost:3001/tareas/jardinero/${idJardinero}`)
      .then(res => {
        console.log('Respuesta del servidor:', res);
        return res.json(); // Asegúrate de que la respuesta sea JSON
      })
      .then(data => {
        console.log('Datos recibidos:', data);
        setTareas(data.tareas);
      })
      .catch(err => console.error('Error al cargar tareas:', err));
  }, []);
  

  const completarTarea = (id) => {
    fetch(`http://localhost:3001/tareas/${id}/completar`, {
      method: 'PUT'
    })
    .then(res => {
      if (res.ok) {
        setTareas(tareas.map(t => t.id_tarea === id ? { ...t, completada: true } : t));
      }
    })
    .catch(err => console.error('Error al completar tarea:', err));
  };

  const formatFecha = (fecha) => {
    const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const tareasFiltradas = tareas.filter(t => 
    filtroPrioridad === 'todas' || t.prioridad === filtroPrioridad
  );

  return (
    <div className="jardinero-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="GreenHouse Logo" className="logo" />
          <h1>GreenHouse</h1>
        </div>
        <div className="filtros-sidebar">
          <h3>Filtrar por:</h3>
          <div className="filtro-group">
            {['todas', 'alta', 'media', 'baja'].map(p => (
              <button 
                key={p}
                className={`filtro-btn prioridad-${p} ${filtroPrioridad === p ? 'active' : ''}`}
                onClick={() => setFiltroPrioridad(p)}
              >
                {p === 'todas' ? 'Todas las tareas' : `Prioridad ${p}`}
              </button>
            ))}
          </div>
        </div>
        <button className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="header-mobile">
          <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
            <i className="fas fa-bars"></i>
          </button>
          <h2>Mis Tareas</h2>
        </div>

        <div className="tareas-grid">
          {tareasFiltradas.length === 0 ? (
            <div className="sin-tareas">
              <i className="fas fa-check-circle"></i>
              <p>No hay tareas pendientes</p>
            </div>
          ) : (
            tareasFiltradas.map(tarea => (
              <div 
                key={tarea.id_tarea} 
                className={`tarea-card ${tarea.prioridad} ${tarea.completada ? 'completada' : ''}`}
                onClick={() => setTareaSeleccionada(tarea)}
              >
                <div className="tarea-header">
                  <h3>{tarea.titulo}</h3>
                  <span className="prioridad-badge">{tarea.prioridad.toUpperCase()}</span>
                </div>
                <p className="zona-text">{tarea.zona}</p>
                <div className="tarea-footer">
                  <span className="fecha-text">{formatFecha(tarea.fecha_limite)}</span>
                  {!tarea.completada && (
                    <button 
                      className="completar-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        completarTarea(tarea.id_tarea);
                      }}
                    >
                      Completar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal detalles */}
      {tareaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setTareaSeleccionada(null)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-header">
              <h2>{tareaSeleccionada.titulo}</h2>
              <span className={`modal-prioridad ${tareaSeleccionada.prioridad}`}>
                {tareaSeleccionada.prioridad.toUpperCase()}
              </span>
            </div>
            <div className="modal-body">
              <div className="info-row">
                <i className="fas fa-map-marker-alt"></i>
                <p><strong>Ubicación:</strong> {tareaSeleccionada.zona}</p>
              </div>
              <div className="info-row">
                <i className="far fa-calendar-alt"></i>
                <p><strong>Fecha límite:</strong> {formatFecha(tareaSeleccionada.fecha_limite)}</p>
              </div>
              <div className="descripcion-container">
                <h4>Descripción:</h4>
                <p>{tareaSeleccionada.descripcion}</p>
              </div>
            </div>
            <div className="modal-footer">
              {!tareaSeleccionada.completada && (
                <button 
                  className="completar-modal-btn"
                  onClick={() => {
                    completarTarea(tareaSeleccionada.id_tarea);
                    setTareaSeleccionada(null);
                  }}
                >
                  <i className="fas fa-check"></i> Marcar como completada
                </button>
              )}
              <button className="cerrar-modal-btn" onClick={() => setTareaSeleccionada(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar móvil */}
      {menuAbierto && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar">
            <button className="close-mobile-menu" onClick={() => setMenuAbierto(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="filtro-group">
              {['todas', 'alta', 'media', 'baja'].map(p => (
                <button 
                  key={p}
                  className={`filtro-btn prioridad-${p} ${filtroPrioridad === p ? 'active' : ''}`}
                  onClick={() => {
                    setFiltroPrioridad(p);
                    setMenuAbierto(false);
                  }}
                >
                  {p === 'todas' ? 'Todas las tareas' : `Prioridad ${p}`}
                </button>
              ))}
            </div>
            <button className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JardineroPanel;
