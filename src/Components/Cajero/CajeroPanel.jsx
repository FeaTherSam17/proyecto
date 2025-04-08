import React, { useState } from 'react';
import './CajeroPanel.css';
import logo from '../Login/assets/logo.png';

const CajeroPanel = () => {
  // Datos del empleado (simulados)
  const empleado = {
    puesto: "Cajero"
  };

  // Estado para los productos disponibles
  const [productos] = useState([
    { id_producido: 1, nombre: 'Tomate Cherry', precio: 3.50, id_categoria: 1 },
    { id_producido: 2, nombre: 'Rosal', precio: 15.00, id_categoria: 3 },
    { id_producido: 3, nombre: 'Tijeras de Podar', precio: 24.90, id_categoria: 4 },
    { id_producido: 4, nombre: 'Fertilizante', precio: 12.00, id_categoria: 4 }
  ]);

  // Categorías
  const categorias = [
    { id_categoria: 1, nombre: 'Plantas' },
    { id_categoria: 2, nombre: 'Frutas' },
    { id_categoria: 3, nombre: 'Flores' },
    { id_categoria: 4, nombre: 'Herramientas' }
  ];

  // Estado para la venta en curso
  const [ventaActual, setVentaActual] = useState({
    items: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    metodoPago: 'efectivo'
  });

  // Estado para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  // Obtener nombre de categoría
  const getCategoriaNombre = (id) => {
    return categorias.find(c => c.id_categoria === id)?.nombre || 'Sin categoría';
  };

  // Agregar producto a la venta
  const agregarProducto = (producto) => {
    const itemExistente = ventaActual.items.find(item => item.id_producido === producto.id_producido);
    
    if (itemExistente) {
      const itemsActualizados = ventaActual.items.map(item =>
        item.id_producido === producto.id_producido 
          ? { ...item, cantidad: item.cantidad + 1, total: item.precio * (item.cantidad + 1) }
          : item
      );
      actualizarVenta(itemsActualizados);
    } else {
      const nuevoItem = {
        ...producto,
        cantidad: 1,
        total: producto.precio
      };
      actualizarVenta([...ventaActual.items, nuevoItem]);
    }
  };

  // Actualizar cantidades en la venta
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const itemsActualizados = ventaActual.items.map(item =>
      item.id_producido === id 
        ? { ...item, cantidad: nuevaCantidad, total: item.precio * nuevaCantidad }
        : item
    );
    actualizarVenta(itemsActualizados);
  };

  // Eliminar producto de la venta
  const eliminarProducto = (id) => {
    const itemsActualizados = ventaActual.items.filter(item => item.id_producido !== id);
    actualizarVenta(itemsActualizados);
  };

  // Actualizar estado completo de la venta
  const actualizarVenta = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const descuento = ventaActual.descuento;
    const total = subtotal - descuento;
    
    setVentaActual({
      ...ventaActual,
      items,
      subtotal,
      total
    });
  };

  // Aplicar descuento
  const aplicarDescuento = (e) => {
    const descuento = Number(e.target.value) || 0;
    const total = ventaActual.subtotal - descuento;
    
    setVentaActual({
      ...ventaActual,
      descuento,
      total
    });
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' || 
      getCategoriaNombre(producto.id_categoria) === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // Categorías únicas para el filtro
  const categoriasFiltro = ['todas', ...categorias.map(c => c.nombre)];

  // Finalizar venta
  const finalizarVenta = () => {
    const nuevaVenta = {
      fecha: new Date().toISOString().split('T')[0],
      total: ventaActual.total,
      metodoPago: ventaActual.metodoPago,
      items: ventaActual.items.map(item => ({
        id_producido: item.id_producido,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        total: item.total
      }))
    };
    
    console.log('Venta a guardar:', nuevaVenta);
    
    // Resetear venta
    setVentaActual({
      items: [],
      subtotal: 0,
      descuento: 0,
      total: 0,
      metodoPago: 'efectivo'
    });
    
    alert('Venta registrada exitosamente');
  };

  // Cerrar sesión
  const handleLogout = () => {
    console.log("Sesión cerrada");
  };

  return (
    <div className="cajero-panel">
      {/* Botón flotante de cerrar sesión */}
      <button className="floating-logout-btn" onClick={handleLogout} title="Cerrar sesión">
        <span className="logout-icon">⎋</span>
      </button>

      <header className="panel-header">
        <div className="header-content">
          <img src={logo} alt="GreenHouse Logo" className="panel-logo" />
          <div className="user-info">
            <h1>Punto de Venta</h1>
            <p className="saludo">Modo Cajero</p>
          </div>
        </div>
      </header>
      
      <div className="panel-container">
        {/* Sección de productos */}
        <div className="productos-section">
          <div className="section-header">
            <h2>Productos Disponibles</h2>
            <div className="filtros">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="busqueda-input"
              />
              
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="categoria-select"
              >
                {categoriasFiltro.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="productos-grid">
            {productosFiltrados.map(producto => (
              <div 
                key={producto.id_producido} 
                className="producto-card"
                onClick={() => agregarProducto(producto)}
              >
                <h3>{producto.nombre}</h3>
                <p className="precio">${producto.precio.toFixed(2)}</p>
                <p className="categoria">{getCategoriaNombre(producto.id_categoria)}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sección de venta actual */}
        <div className="venta-section">
          <h2>Venta Actual</h2>
          
          <div className="items-venta">
            {ventaActual.items.length === 0 ? (
              <p className="sin-items">No hay productos en la venta</p>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ventaActual.items.map(item => (
                    <tr key={item.id_producido}>
                      <td>{item.nombre}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.id_producido, parseInt(e.target.value))}
                        />
                      </td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => eliminarProducto(item.id_producido)}
                          className="eliminar-btn"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="resumen-venta">
            <div className="resumen-linea">
              <span>Subtotal:</span>
              <span>${ventaActual.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="resumen-linea">
              <label>Descuento:</label>
              <input
                type="number"
                min="0"
                max={ventaActual.subtotal}
                value={ventaActual.descuento}
                onChange={aplicarDescuento}
                className="descuento-input"
              />
            </div>
            
            <div className="resumen-linea total">
              <span>Total:</span>
              <span>${ventaActual.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="metodo-pago">
            <label>Método de pago:</label>
            <select
              value={ventaActual.metodoPago}
              onChange={(e) => setVentaActual({...ventaActual, metodoPago: e.target.value})}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          
          <div className="acciones-venta">
            <button 
              className="cancelar-btn"
              onClick={() => setVentaActual({
                items: [],
                subtotal: 0,
                descuento: 0,
                total: 0,
                metodoPago: 'efectivo'
              })}
            >
              Cancelar
            </button>
            <button 
              className="finalizar-btn"
              onClick={finalizarVenta}
              disabled={ventaActual.items.length === 0}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CajeroPanel;