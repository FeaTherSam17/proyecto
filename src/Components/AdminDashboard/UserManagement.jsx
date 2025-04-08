import { useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      nombre: 'Monito', 
      apellidoPat: 'Jumento', 
      apellidoMat: 'Flores', 
      username: 'monito', 
      role: 'Jardinero', 
      password: 'monito123', 
      status: 'Activo' 
    },
    { 
      id: 2, 
      nombre: 'Usuario', 
      apellidoPat: 'Gómez', 
      apellidoMat: 'López', 
      username: 'usuario', 
      role: 'Cajero', 
      password: 'usuario456', 
      status: 'Activo' 
    },
    { 
      id: 3, 
      nombre: 'RUVM', 
      apellidoPat: 'Vargas', 
      apellidoMat: 'Méndez', 
      username: 'ruvm', 
      role: 'Almacenista', 
      password: 'ruvm789', 
      status: 'Activo' 
    }
  ]);

  const [newUser, setNewUser] = useState({
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    username: '',
    role: 'Jardinero',
    password: '',
    status: 'Activo'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const addUser = (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.apellidoPat || !newUser.username || !newUser.password) return;

    setUsers([...users, {
      id: Date.now(),
      ...newUser
    }]);

    setNewUser({ 
      nombre: '', 
      apellidoPat: '', 
      apellidoMat: '', 
      username: '', 
      role: 'Jardinero', 
      password: '', 
      status: 'Activo' 
    });
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' } 
        : user
    ));
  };

  const filteredUsers = users.filter(user =>
    `${user.nombre} ${user.apellidoPat} ${user.apellidoMat}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <header className="header">
        <h1>Gestión de Usuarios</h1>
        <p>Administración de usuarios del sistema</p>
      </header>

      <div className="content-wrapper">
        {/* Formulario de creación */}
        <section className="form-section">
          <div className="form-card">
            <h2>Crear Nuevo Usuario</h2>
            <form onSubmit={addUser}>
              <div className="form-group">
                <label>Nombre(s)*</label>
                <input
                  type="text"
                  placeholder="Nombre(s)"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Apellido Paterno*</label>
                  <input
                    type="text"
                    placeholder="Apellido Paterno"
                    value={newUser.apellidoPat}
                    onChange={(e) => setNewUser({...newUser, apellidoPat: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apellido Materno</label>
                  <input
                    type="text"
                    placeholder="Apellido Materno"
                    value={newUser.apellidoMat}
                    onChange={(e) => setNewUser({...newUser, apellidoMat: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre de usuario*</label>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol*</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    required
                  >
                    <option value="Jardinero">Jardinero</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Almacenista">Almacenista</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Contraseña*</label>
                  <input
                    type="text"
                    placeholder="Contraseña "
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Registrar Usuario
              </button>
            </form>
          </div>
        </section>

        {/* Lista de usuarios */}
        <section className="list-section">
          <div className="list-header">
            <h2>Usuarios Registrados</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Contraseña</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{`${user.nombre} ${user.apellidoPat} ${user.apellidoMat}`}</td>
                      <td>@{user.username}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="password-cell">{user.password}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteUser(user.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.role === 'Jardinero').length}</div>
              <div className="stat-label">Jardineros</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.role === 'Cajero').length}</div>
              <div className="stat-label">Cajeros</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.role === 'Almacenista').length}</div>
              <div className="stat-label">Almacenistas</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserManagement;