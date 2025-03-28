import React, { useState } from 'react';
import './CajeroPanel.css';

const CajeroPanel = () => {
  // Estado para los productos disponibles
  const [productos] = useState([
    { id: 1, nombre: 'Tomates (kg)', precio: 2.50, categoria: 'Hortalizas' },
    { id: 2, nombre: 'Lechuga', precio: 1.80, categoria: 'Hortalizas' },
    { id: 3, nombre: 'Rosas (docena)', precio: 8.00, categoria: 'Flores' },
    { id: 4, nombre: 'Maceta pequeña', precio: 5.50, categoria: 'Accesorios' },
    { id: 5, nombre: 'Fertilizante', precio: 12.00, categoria: 'Insumos' },
  ]);

  // Estado para la venta en curso
  const [ventaActual, setVentaActual] = useState({
    items: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    metodoPago: 'efectivo',
    cliente: ''
  });

  // Estado para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  // Agregar producto a la venta
  const agregarProducto = (producto) => {
    const itemExistente = ventaActual.items.find(item => item.id === producto.id);
    
    if (itemExistente) {
      const itemsActualizados = ventaActual.items.map(item =>
        item.id === producto.id 
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
      item.id === id 
        ? { ...item, cantidad: nuevaCantidad, total: item.precio * nuevaCantidad }
        : item
    );
    actualizarVenta(itemsActualizados);
  };

  // Eliminar producto de la venta
  const eliminarProducto = (id) => {
    const itemsActualizados = ventaActual.items.filter(item => item.id !== id);
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
    const coincideCategoria = categoriaFiltro === 'todas' || producto.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // Categorías únicas para el filtro
  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];

  return (
    <div className="cajero-panel">
      <h1>Registro de Ventas</h1>
      
      <div className="panel-container">
        {/* Sección de productos */}
        <div className="productos-section">
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
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="productos-grid">
            {productosFiltrados.map(producto => (
              <div 
                key={producto.id} 
                className="producto-card"
                onClick={() => agregarProducto(producto)}
              >
                <h3>{producto.nombre}</h3>
                <p className="precio">${producto.precio.toFixed(2)}</p>
                <p className="categoria">{producto.categoria}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sección de venta actual */}
        <div className="venta-section">
          <h2>Venta Actual</h2>
          
          <div className="cliente-input">
            <label>Cliente:</label>
            <input
              type="text"
              placeholder="Nombre del cliente (opcional)"
              value={ventaActual.cliente}
              onChange={(e) => setVentaActual({...ventaActual, cliente: e.target.value})}
            />
          </div>
          
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
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => eliminarProducto(item.id)}
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
            <button className="cancelar-btn">Cancelar</button>
            <button className="finalizar-btn">Finalizar Venta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CajeroPanel;