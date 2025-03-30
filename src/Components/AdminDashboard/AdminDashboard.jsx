import { useState } from 'react';
import UserManagement from './UserManagement';
import ReportsPanel from './ReportsPanel';
import SuppliersPanel from './SuppliersPanel';
import TasksPanel from './TasksPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel Administrativo</h2>
        </div>
        <nav className="sidebar-nav">
        <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Usuarios
          </button>
          <button 
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Tareas
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            📊 Reportes
          </button>
          <button 
            className={activeTab === 'suppliers' ? 'active' : ''}
            onClick={() => setActiveTab('suppliers')}
          >
            🚚 Proveedores
          </button>
          
        </nav>
        
        {/* Botón de Cierre de Sesión */}
        <div className="logout-section">
          <button className="logout-btn">
            <span role="img" aria-label="logout">👋</span> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === 'tasks' && <TasksPanel />}
        {activeTab === 'reports' && <ReportsPanel />}
        {activeTab === 'suppliers' && <SuppliersPanel />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;