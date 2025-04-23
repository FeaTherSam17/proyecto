import React, { useState, useEffect } from 'react';
import './CajeroPanel.css';
import logo from '../Login/assets/logo.png';

const CajeroPanel = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [ventaActual, setVentaActual] = useState({
    items: [],
    subtotal: 0,
    descuento: 0,
    total: 0
  });

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  useEffect(() => {
    fetch('http://localhost:3001/productos')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProductos(data.data);
        } else {
          console.error("No se pudieron obtener los productos");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });

    fetch('http://localhost:3001/categorias')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategorias(data.data);
        } else {
          console.error("No se pudieron obtener las categorías");
        }
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      });

    // Evita volver al panel con la flecha de atrás tras cerrar sesión
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.location.href = '/';
    };
  }, []);

  const getCategoriaNombre = (id) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const agregarProducto = (producto) => {
    const itemExistente = ventaActual.items.find(item => item.id_producto === producto.id_producto);
    
    if (itemExistente) {
      const itemsActualizados = ventaActual.items.map(item =>
        item.id_producto === producto.id_producto 
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

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const itemsActualizados = ventaActual.items.map(item =>
      item.id_producto === id 
        ? { ...item, cantidad: nuevaCantidad, total: item.precio * nuevaCantidad }
        : item
    );
    actualizarVenta(itemsActualizados);
  };

  const eliminarProducto = (id) => {
    const itemsActualizados = ventaActual.items.filter(item => item.id_producto !== id);
    actualizarVenta(itemsActualizados);
  };

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

  const aplicarDescuento = (e) => {
    const descuento = Number(e.target.value) || 0;
    const total = ventaActual.subtotal - descuento;
    
    setVentaActual({
      ...ventaActual,
      descuento,
      total
    });
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' || 
      getCategoriaNombre(producto.id_categoria) === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const categoriasFiltro = ['todas', ...categorias.map(c => c.nombre)];

  const finalizarVenta = () => {
    const nuevaVenta = {
      fecha: new Date().toISOString().split('T')[0],
      total: ventaActual.total,
      items: ventaActual.items.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        total: item.total
      }))
    };
  
    fetch('http://localhost:3001/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaVenta)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Venta registrada exitosamente');
          setVentaActual({
            items: [],
            subtotal: 0,
            descuento: 0,
            total: 0
          });
        } else {
          alert('Error al registrar venta: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error al enviar la venta:', error);
        alert('Error de conexión al registrar la venta');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <div className="cajero-panel">
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
                key={producto.id_producto} 
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
                    <tr key={item.id_producto}>
                      <td>{item.nombre}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.id_producto, parseInt(e.target.value))}
                        />
                      </td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => eliminarProducto(item.id_producto)}
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
          
          <div className="acciones-venta">
            <button 
              className="cancelar-btn"
              onClick={() => setVentaActual({
                items: [],
                subtotal: 0,
                descuento: 0,
                total: 0
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
