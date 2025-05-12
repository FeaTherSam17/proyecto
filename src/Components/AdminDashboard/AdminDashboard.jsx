// Importa los hooks y componentes necesarios
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Hook para redireccionar a otras rutas
import UserManagement from './UserManagement';
import ReportsPanel from './ReportsPanel';
import SuppliersPanel from './SuppliersPanel';
import TasksPanel from './TasksPanel';
import './AdminDashboard.css';  // Importa los estilos del dashboard

// Componente principal del panel de administrador
const AdminDashboard = () => {
  // Estado para controlar la pestaña activa del panel
  const [activeTab, setActiveTab] = useState('users');

  // Estado para controlar si la barra lateral está colapsada o expandida
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Hook para redirigir al usuario (por ejemplo, al hacer logout)
  const navigate = useNavigate();

  // Función que se ejecuta al cerrar sesión
  const handleLogout = () => {
    console.log("Sesión cerrada");

    // Borra los datos del usuario almacenados en el navegador
    localStorage.removeItem('user');
    
    // Redirige al usuario a la página de login
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Barra lateral del panel de administración */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          {/* Botón para colapsar/expandir la barra lateral */}
          <button 
            className="collapse-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        {/* Navegación dentro de la barra lateral */}
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {/* Botón para ir a la pestaña de gestión de usuarios */}
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              {/* Oculta el texto si la barra está colapsada */}
              {!isSidebarCollapsed && <span>Usuarios</span>}
            </button>
            
            {/* Botón para ir a la pestaña de tareas */}
            <button 
              className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <span className="nav-icon">📋</span>
              {!isSidebarCollapsed && <span>Tareas</span>}
            </button>
            
            {/* Botón para ir a la pestaña de reportes */}
            <button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon">📊</span>
              {!isSidebarCollapsed && <span>Reportes</span>}
            </button>
            
            {/* Botón para ir a la pestaña de proveedores */}
            <button 
              className={`nav-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
              onClick={() => setActiveTab('suppliers')}
            >
              <span className="nav-icon">🚚</span>
              {!isSidebarCollapsed && <span>Proveedores</span>}
            </button>
          </nav>
        </div>
        
        {/* Contenedor del botón de cerrar sesión, siempre visible al final de la barra */}
        <div className="logout-container">
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="logout-icon">⎋</span>
            {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Contenido principal del panel según la pestaña activa */}
      <div className="admin-main">
        <div className="content-header">
          {/* Muestra el título correspondiente a la pestaña activa */}
          <h3>
            {activeTab === 'users' && 'Gestión de Usuarios'}
            {activeTab === 'tasks' && 'Administración de Tareas'}
            {activeTab === 'reports' && 'Reportes y Estadísticas'}
            {activeTab === 'suppliers' && 'Gestión de Proveedores'}
          </h3>
        </div>
        
        <div className="content-container">
          {/* Muestra el componente correspondiente a la pestaña seleccionada */}
          {activeTab === 'tasks' && <TasksPanel />}
          {activeTab === 'reports' && <ReportsPanel />}
          {activeTab === 'suppliers' && <SuppliersPanel />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
