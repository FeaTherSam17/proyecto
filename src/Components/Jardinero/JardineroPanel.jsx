import React from 'react';
import './JardineroPanel.css';

const JardineroPanel = () => {
  // Datos de ejemplo (simularán lo que luego vendrá de la BD)
  const tareasEjemplo = [
    {
      id: 1,
      titulo: "Regar plantas de la zona B",
      invernadero: "Invernadero Principal",
      fecha: "2023-11-15",
      prioridad: "alta",
      estado: "pendiente"
    },
    {
      id: 2,
      titulo: "Podar rosales",
      invernadero: "Invernadero Este",
      fecha: "2023-11-18",
      prioridad: "media",
      estado: "pendiente"
    },
    {
      id: 3,
      titulo: "Controlar plagas en tomates",
      invernadero: "Invernadero Oeste",
      fecha: "2023-11-20",
      prioridad: "baja",
      estado: "pendiente"
    }
  ];

  return (
    <div className="panel-jardinero">
      <header className="header-panel">
        <h1>Mis Tareas Asignadas</h1>
        <div className="filtros">
          <select className="selector-filtro">
            <option>Todas las prioridades</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
      </header>

      <div className="lista-tareas">
        {tareasEjemplo.map((tarea) => (
          <div key={tarea.id} className={`tarea ${tarea.prioridad}`}>
            <div className="info-tarea">
              <h3>{tarea.titulo}</h3>
              <p><strong>Ubicación:</strong> {tarea.invernadero}</p>
              <p><strong>Fecha límite:</strong> {tarea.fecha}</p>
              <span className="badge-prioridad">{tarea.prioridad}</span>
            </div>
            <div className="acciones-tarea">
              <button className="boton-completar">Completar</button>
              <button className="boton-detalles">Ver detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JardineroPanel;