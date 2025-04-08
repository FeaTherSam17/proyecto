import React, { useState } from 'react';
import './AlmacenistaPanel.css';
import logo from '../Login/assets/logo.png';

const AlmacenistaPanel = () => {
  // Estados para el formulario de producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'plantas',
    precio: '',
    proveedor: ''
  });

  // Estados para la lista de productos
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: 'Suculenta Echeveria',
      categoria: 'plantas',
      precio: 8.50,
      proveedor: 'Viveros Green'
    },
    {
      id: 2,
      nombre: 'Tijeras de Podar',
      categoria: 'herramientas',
      precio: 24.90,
      proveedor: 'FerreJardín'
    }
  ]);

  // Estados para proveedores
  const [proveedores] = useState([
    'Viveros Green',
    'FerreJardín',
    'Insumos Agrícolas',
    'Plantas del Valle'
  ]);

  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value
    });
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const producto = {
      id: productos.length + 1,
      nombre: nuevoProducto.nombre,
      categoria: nuevoProducto.categoria,
      precio: parseFloat(nuevoProducto.precio),
      proveedor: nuevoProducto.proveedor || 'Sin proveedor'
    };

    setProductos([...productos, producto]);
    setNuevoProducto({
      nombre: '',
      categoria: 'plantas',
      precio: '',
      proveedor: ''
    });
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' || producto.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // Función para cerrar sesión
  const handleLogout = () => {
    console.log("Sesión cerrada");
    // Aquí iría la lógica real para cerrar sesión
  };

  return (
    <div className="almacenista-panel">
      {/* Botón flotante de cerrar sesión */}
      <button className="floating-logout-btn" onClick={handleLogout} title="Cerrar sesión">
        <span className="logout-icon">⎋</span>
      </button>

      <header className="panel-header">
        <img src={logo} alt="GreenHouse Logo" className="panel-logo" />
        <h1>GreenHouse - Gestión de Inventario</h1>
      </header>
      
      <div className="panel-container">
        <div className="formulario-section">
          <h2>Registrar Nuevo Producto</h2>
          
          <form onSubmit={agregarProducto} className="producto-form">
            <div className="form-group">
              <label>Nombre*:</label>
              <input
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={nuevoProducto.categoria}
                onChange={handleInputChange}
              >
                <option value="plantas">Plantas</option>
                <option value="herramientas">Herramientas</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Precio*:</label>
              <input
                type="number"
                name="precio"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Proveedor:</label>
              <select
                name="proveedor"
                value={nuevoProducto.proveedor}
                onChange={handleInputChange}
              >
                <option value="">Seleccione proveedor</option>
                {proveedores.map((proveedor, index) => (
                  <option key={index} value={proveedor}>{proveedor}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="guardar-btn">Registrar Producto</button>
          </form>
        </div>
        
        <div className="lista-section">
          <h2>Inventario de Productos</h2>
          
          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
            
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="categoria-select"
            >
              <option value="todas">Todas las categorías</option>
              <option value="plantas">Plantas</option>
              <option value="herramientas">Herramientas</option>
            </select>
          </div>
          
          <div className="productos-table-container">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Proveedor</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-resultados">No se encontraron productos</td>
                  </tr>
                ) : (
                  productosFiltrados.map(producto => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td className={`categoria-${producto.categoria}`}>
                        {producto.categoria === 'plantas' ? '🌱 Plantas' : '🛠️ Herramientas'}
                      </td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.proveedor}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="resumen-inventario">
            <div className="resumen-item">
              <span>Total productos:</span>
              <span>{productos.length}</span>
            </div>
            <div className="resumen-item">
              <span>Plantas:</span>
              <span>{productos.filter(p => p.categoria === 'plantas').length}</span>
            </div>
            <div className="resumen-item">
              <span>Herramientas:</span>
              <span>{productos.filter(p => p.categoria === 'herramientas').length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="panel-footer">
        <img src={logo} alt="GreenHouse Logo" className="footer-logo" />
        <p>© {new Date().getFullYear()} GreenHouse</p>
      </footer>
    </div>
  );
};

export default AlmacenistaPanel;