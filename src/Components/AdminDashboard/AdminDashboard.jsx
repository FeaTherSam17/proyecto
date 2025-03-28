import { useState } from 'react';
import UserManagement from './UserManagement';
import ReportsPanel from './ReportsPanel';
import SuppliersPanel from './SuppliersPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel Administrativo</h2>
        </div>
        <nav className="sidebar-nav">
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
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Usuarios
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === 'reports' && <ReportsPanel />}
        {activeTab === 'suppliers' && <SuppliersPanel />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;