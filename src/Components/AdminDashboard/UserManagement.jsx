import { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    username: '',
    role: 4,  // El valor por defecto es 'Jardinero' (equivalente al rol 4)
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios del backend al cargar el componente
  useEffect(() => {
    fetch('http://localhost:3001/usuarios')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al cargar usuarios:', error));
  }, []);

  // Función para agregar un nuevo usuario
  const addUser = async (e) => {
    e.preventDefault();

    // Verifica que los campos obligatorios estén presentes
    if (!newUser.nombre || !newUser.apellidoPat || !newUser.username || !newUser.password || !newUser.role || newUser.role === 1) return;

    try {
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();

      if (result.success) {
        // Recargar usuarios desde el backend actualizado
        const updatedUsers = await fetch('http://localhost:3001/usuarios').then(res => res.json());
        setUsers(updatedUsers);

        // Limpiar el formulario después de agregar el usuario
        setNewUser({
          nombre: '',
          apellidoPat: '',
          apellidoMat: '',
          username: '',
          role: 4,  // Asumiendo que '4' es 'Jardinero'
          password: '',
        });
      } else {
        alert(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const res = await fetch(`http://localhost:3001/usuarios/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          setUsers(users.filter(user => user.ID !== id));
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  // Función para formatear la fecha en dd/mm/yyyy
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2); // Formatear el día con dos dígitos
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Formatear el mes con dos dígitos
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user =>
    `${user['Nombre Completo']}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Rol.toLowerCase().includes(searchTerm.toLowerCase())
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
                    onChange={(e) => setNewUser({...newUser, role: parseInt(e.target.value)})}  // Cambié a número
                    required
                  >
                    <option value={4}>Jardinero</option>
                    <option value={3}>Cajero</option>
                    <option value={2}>Almacenista</option>
                    {/* Eliminé la opción de Admin */}
                  </select>
                </div>

                <div className="form-group">
                  <label>Contraseña*</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
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
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Rol</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Fecha de creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.ID}>
                      <td>{user.ID}</td>
                      <td>{user['Nombre Completo']}</td>
                      <td>{user.Rol}</td>
                      <td>{user.Usuario}</td>
                      <td>{user.Contraseña}</td>
                      <td>{formatDate(user['Fecha de creación'])}</td>

                      <td>
                        <button onClick={() => deleteUser(user.ID)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay usuarios registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserManagement;
