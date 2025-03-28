import { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', email: 'admin@invernadero.com', role: 'Administrador' },
    { id: 2, name: 'Carlos Gómez', email: 'carlos@invernadero.com', role: 'Jardinero' }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Jardinero',
    password: ''
  });

  const addUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    setUsers([...users, {
      id: Date.now(),
      ...newUser
    }]);

    setNewUser({ name: '', email: '', role: 'Jardinero', password: '' });
  };

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>

      <form onSubmit={addUser} className="user-form">
        <h3>Crear Nuevo Usuario</h3>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre completo"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="Jardinero">Jardinero</option>
            <option value="Cajero">Cajero</option>
            <option value="Almacenista">Almacenista</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña temporal"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Registrar Usuario
        </button>
      </form>

      <div className="users-list">
        <h3>Usuarios Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;