import React, { useState } from 'react';
import './JardineroPanel.css';
import logo from '../Login/assets/logo.png';
//import { useNavigate } from 'react-router-dom';

const JardineroPanel = () => {
 // const navigate = useNavigate();
  
  // Estado para las tareas
  const [tareas, setTareas] = useState([
    {
      id_tarea: 1,
      titulo: "Regar plantas zona B",
      descripcion: "Regar todas las plantas de la sección B del invernadero principal con sistema de goteo",
      prioridad: "alta",
      fecha_limite: "2023-11-15",
      completada: 0,
      zona: "Invernadero Principal"
    },
    {
      id_tarea: 2,
      titulo: "Podar rosales",
      descripcion: "Realizar poda formativa a los rosales del sector este, retirar ramas secas",
      prioridad: "media",
      fecha_limite: "2023-11-18",
      completada: 0,
      zona: "Sector Este"
    },
    {
      id_tarea: 3,
      titulo: "Control de plagas",
      descripcion: "Aplicar tratamiento orgánico contra pulgones en plantas de tomate",
      prioridad: "baja",
      fecha_limite: "2023-11-20",
      completada: 0,
      zona: "Invernadero Oeste"
    },
    {
      id_tarea: 4,
      titulo: "Abonar sustratos",
      descripcion: "Aplicar fertilizante orgánico en camas de cultivo 1-4",
      prioridad: "media",
      fecha_limite: "2023-11-22",
      completada: 0,
      zona: "Camas de Cultivo"
    }
  ]);

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const tareasFiltradas = tareas.filter(tarea => 
    filtroPrioridad === 'todas' || tarea.prioridad === filtroPrioridad
  );

  const completarTarea = (id) => {
    setTareas(tareas.map(tarea => 
      tarea.id_tarea === id ? { ...tarea, completada: 1 } : tarea
    ));
  };

  const handleLogout = () => {
   // navigate('/login');
  };

  const formatFecha = (fecha) => {
    const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

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
            <button 
              className={`filtro-btn ${filtroPrioridad === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltroPrioridad('todas')}
            >
              Todas las tareas
            </button>
            <button 
              className={`filtro-btn prioridad-alta ${filtroPrioridad === 'alta' ? 'active' : ''}`}
              onClick={() => setFiltroPrioridad('alta')}
            >
              Alta prioridad
            </button>
            <button 
              className={`filtro-btn prioridad-media ${filtroPrioridad === 'media' ? 'active' : ''}`}
              onClick={() => setFiltroPrioridad('media')}
            >
              Media prioridad
            </button>
            <button 
              className={`filtro-btn prioridad-baja ${filtroPrioridad === 'baja' ? 'active' : ''}`}
              onClick={() => setFiltroPrioridad('baja')}
            >
              Baja prioridad
            </button>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
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

      {/* Modal de detalles */}
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
              <button 
                className="cerrar-modal-btn"
                onClick={() => setTareaSeleccionada(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      {menuAbierto && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar">
            <button className="close-mobile-menu" onClick={() => setMenuAbierto(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="filtro-group">
              <button 
                className={`filtro-btn ${filtroPrioridad === 'todas' ? 'active' : ''}`}
                onClick={() => {
                  setFiltroPrioridad('todas');
                  setMenuAbierto(false);
                }}
              >
                Todas las tareas
              </button>
              {/* ... otros botones de filtro ... */}
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JardineroPanel;