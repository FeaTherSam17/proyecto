import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import UserManagement from './UserManagement';
import ReportsPanel from './ReportsPanel';
import SuppliersPanel from './SuppliersPanel';
import TasksPanel from './TasksPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const navigate = useNavigate(); // Crea el hook de navegación

  const handleLogout = () => {
    console.log("Sesión cerrada");

    // Elimina los datos del usuario del localStorage
    localStorage.removeItem('user');
    
    // Redirige al login
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Sidebar moderno */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="collapse-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <button 
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              {!isSidebarCollapsed && <span>Usuarios</span>}
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <span className="nav-icon">📋</span>
              {!isSidebarCollapsed && <span>Tareas</span>}
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon">📊</span>
              {!isSidebarCollapsed && <span>Reportes</span>}
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
              onClick={() => setActiveTab('suppliers')}
            >
              <span className="nav-icon">🚚</span>
              {!isSidebarCollapsed && <span>Proveedores</span>}
            </button>
          </nav>
        </div>
        
        {/* Botón de cerrar sesión fijo en la parte inferior */}
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

      {/* Área principal */}
      <div className="admin-main">
        <div className="content-header">
          <h3>
            {activeTab === 'users' && 'Gestión de Usuarios'}
            {activeTab === 'tasks' && 'Administración de Tareas'}
            {activeTab === 'reports' && 'Reportes y Estadísticas'}
            {activeTab === 'suppliers' && 'Gestión de Proveedores'}
          </h3>
        </div>
        
        <div className="content-container">
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
