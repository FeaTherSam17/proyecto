import React, { useState } from 'react';
import './AlmacenistaPanel.css';

const AlmacenistaPanel = () => {
  // Estados para el formulario de producto
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Hortalizas',
    precio: '',
    costo: '',
    stock: '',
    stockMinimo: '',
    unidadMedida: 'unidad',
    proveedor: ''
  });

  // Estados para la lista de productos
  const [productos, setProductos] = useState([
    {
      id: 1,
      codigo: 'PROD-001',
      nombre: 'Tomate Cherry',
      categoria: 'Hortalizas',
      precio: 3.50,
      costo: 1.80,
      stock: 150,
      stockMinimo: 30,
      unidadMedida: 'kg',
      proveedor: 'AgroFruits S.A.'
    },
    // ... más productos de ejemplo
  ]);

  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value
    });
  };

  // Agregar nuevo producto
  const agregarProducto = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const producto = {
      id: productos.length + 1,
      codigo: nuevoProducto.codigo || `PROD-${(productos.length + 1).toString().padStart(3, '0')}`,
      ...nuevoProducto,
      precio: parseFloat(nuevoProducto.precio),
      costo: parseFloat(nuevoProducto.costo) || 0,
      stock: parseInt(nuevoProducto.stock),
      stockMinimo: parseInt(nuevoProducto.stockMinimo) || 0
    };

    setProductos([...productos, producto]);
    
    // Resetear formulario
    setNuevoProducto({
      codigo: '',
      nombre: '',
      categoria: 'Hortalizas',
      precio: '',
      costo: '',
      stock: '',
      stockMinimo: '',
      unidadMedida: 'unidad',
      proveedor: ''
    });
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            producto.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' || producto.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // Categorías únicas para el filtro
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];

  return (
    <div className="almacenista-panel">
      <h1>Gestión de Inventario</h1>
      
      <div className="panel-container">
        {/* Formulario para agregar productos */}
        <div className="formulario-section">
          <h2>Registrar Nuevo Producto</h2>
          
          <form onSubmit={agregarProducto} className="producto-form">
            <div className="form-group">
              <label>Código:</label>
              <input
                type="text"
                name="codigo"
                value={nuevoProducto.codigo}
                onChange={handleInputChange}
                placeholder="Auto-generado si se deja vacío"
              />
            </div>
            
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
                <option value="Hortalizas">Hortalizas</option>
                <option value="Frutas">Frutas</option>
                <option value="Flores">Flores</option>
                <option value="Insumos">Insumos</option>
                <option value="Herramientas">Herramientas</option>
              </select>
            </div>
            
            <div className="form-row">
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
                <label>Costo:</label>
                <input
                  type="number"
                  name="costo"
                  value={nuevoProducto.costo}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Stock*:</label>
                <input
                  type="number"
                  name="stock"
                  value={nuevoProducto.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Stock Mínimo:</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={nuevoProducto.stockMinimo}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Unidad de Medida:</label>
                <select
                  name="unidadMedida"
                  value={nuevoProducto.unidadMedida}
                  onChange={handleInputChange}
                >
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="g">Gramo</option>
                  <option value="L">Litro</option>
                  <option value="ml">Mililitro</option>
                  <option value="paquete">Paquete</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Proveedor:</label>
                <input
                  type="text"
                  name="proveedor"
                  value={nuevoProducto.proveedor}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <button type="submit" className="guardar-btn">Registrar Producto</button>
          </form>
        </div>
        
        {/* Lista de productos */}
        <div className="lista-section">
          <h2>Inventario de Productos</h2>
          
          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
            
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="categoria-select"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria === 'todas' ? 'Todas' : categoria}
                </option>
              ))}
            </select>
          </div>
          
          <div className="productos-table-container">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-resultados">No se encontraron productos</td>
                  </tr>
                ) : (
                  productosFiltrados.map(producto => (
                    <tr key={producto.id}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>
                        <span className={`stock ${producto.stock <= producto.stockMinimo ? 'bajo' : ''}`}>
                          {producto.stock} {producto.unidadMedida}
                        </span>
                      </td>
                      <td>
                        {producto.stock === 0 ? (
                          <span className="estado agotado">Agotado</span>
                        ) : producto.stock <= producto.stockMinimo ? (
                          <span className="estado bajo">Stock Bajo</span>
                        ) : (
                          <span className="estado disponible">Disponible</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="resumen-inventario">
            <div className="resumen-item">
              <span>Productos registrados:</span>
              <span>{productos.length}</span>
            </div>
            <div className="resumen-item">
              <span>Productos con stock bajo:</span>
              <span>{productos.filter(p => p.stock <= p.stockMinimo).length}</span>
            </div>
            <div className="resumen-item">
              <span>Productos agotados:</span>
              <span>{productos.filter(p => p.stock === 0).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlmacenistaPanel;