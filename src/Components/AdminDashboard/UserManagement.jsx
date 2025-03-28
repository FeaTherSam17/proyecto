import React, { useState } from 'react';
const UserManagement = () => {
    const [users, setUsers] = useState([
      { id: 1, name: 'Admin Principal', email: 'admin@invernadero.com', role: 'Administrador' },
      { id: 2, name: 'Gerente Ventas', email: 'gerente@invernadero.com', role: 'Gerente' }
    ]);
  
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Técnico' });
  
    const handleAddUser = () => {
      // Lógica para agregar usuario
    };
  
    const handleDeleteUser = (id) => {
      // Lógica para eliminar usuario
    };
  
    return (
      <div className="management-panel">
        <h2>Gestión de Usuarios</h2>
        
        {/* Formulario para agregar */}
        <div className="add-user-form">
          <h3>Agregar Nuevo Usuario</h3>
          <input 
            type="text" 
            placeholder="Nombre completo"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Correo electrónico"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="Cajero">Cajero</option>
            <option value="Almacenita">Almacenista</option>
            <option value="Jardinero">Jardinero</option>
          </select>
          <button onClick={handleAddUser}>Agregar Usuario</button>
        </div>
  
        {/* Lista de usuarios */}
        <div className="users-list">
          <h3>Usuarios Registrados</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="edit-btn">✏️</button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default UserManagement;