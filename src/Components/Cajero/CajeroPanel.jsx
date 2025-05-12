import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = () => {
      const usuario = JSON.parse(localStorage.getItem('user'));
      const idUsuario = localStorage.getItem('id_usuario');
      
      if (!usuario || !idUsuario || usuario.role !== 3) {
        localStorage.removeItem('user');
        localStorage.removeItem('id_usuario');
        navigate('/');
        return false;
      }
      return true;
    };

    if (!verificarAutenticacion()) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        const productosResponse = await fetch('http://localhost:3001/productos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const categoriasResponse = await fetch('http://localhost:3001/categorias', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!productosResponse.ok || !categoriasResponse.ok) {
          throw new Error('Error al cargar datos');
        }

        const productosData = await productosResponse.json();
        const categoriasData = await categoriasResponse.json();

        if (productosData.success) setProductos(productosData.data);
        if (categoriasData.success) setCategorias(categoriasData.data);

      } catch (err) {
        setError(err.message);
        if (err.message.includes('401')) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      navigate('/login', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const getCategoriaNombre = (id) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const agregarProducto = (producto) => {
    const itemExistente = ventaActual.items.find(item => item.id_producto === producto.id_producto);

    if (producto.stock <= 0) {
      alert("Producto fuera de stock");
      return;
    }

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        const itemsActualizados = ventaActual.items.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1, total: item.precio * (item.cantidad + 1) }
            : item
        );
        actualizarVenta(itemsActualizados);
      } else {
        alert("No hay suficiente stock para agregar más unidades.");
      }
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

    const producto = productos.find(p => p.id_producto === id);
    if (producto && nuevaCantidad <= producto.stock) {
      const itemsActualizados = ventaActual.items.map(item =>
        item.id_producto === id
          ? { ...item, cantidad: nuevaCantidad, total: item.precio * nuevaCantidad }
          : item
      );
      actualizarVenta(itemsActualizados);
    } else {
      alert("No hay suficiente stock para esa cantidad.");
    }
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

  const productosPorCategoria = categorias.reduce((acc, categoria) => {
    const productosDeCategoria = productosFiltrados.filter(
      p => p.id_categoria === categoria.id_categoria
    );
    if (productosDeCategoria.length > 0) {
      acc.push({
        nombre: categoria.nombre,
        productos: productosDeCategoria
      });
    }
    return acc;
  }, []);

  if (categoriaFiltro === 'todas') {
    const productosSinCategoria = productosFiltrados.filter(p => !p.id_categoria);
    if (productosSinCategoria.length > 0) {
      productosPorCategoria.push({
        nombre: 'Sin categoría',
        productos: productosSinCategoria
      });
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const finalizarVenta = async () => {
    if (ventaActual.items.length === 0) {
      alert("No hay productos en la venta");
      return;
    }

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

    try {
      const response = await fetch('http://localhost:3001/ventas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevaVenta)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Venta registrada exitosamente');
        
        const productosActualizados = productos.map(prod => {
          const itemVendido = ventaActual.items.find(v => v.id_producto === prod.id_producto);
          if (itemVendido) {
            return { ...prod, stock: prod.stock - itemVendido.cantidad };
          }
          return prod;
        });
        
        setProductos(productosActualizados);
        setVentaActual({
          items: [],
          subtotal: 0,
          descuento: 0,
          total: 0
        });
      } else {
        alert('Error al registrar venta: ' + (data.message || ''));
      }
    } catch (error) {
      console.error('Error al enviar la venta:', error);
      alert('Error de conexión al registrar la venta');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleLogout} className="logout-button">
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="cajero-panel">
      <button className="floating-logout-btn" onClick={handleLogout} title="Cerrar sesión">
  <span className="logout-icon">⎋</span>
</button>

      <header className="panel-header">
        <div className="header-content">
          <img src={logo} alt="Logo" className="panel-logo" />
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
                <option value="todas">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="productos-categorizados">
            {productosPorCategoria.map(grupo => (
              <div key={grupo.nombre} className="categoria-grupo">
                <h3 className="titulo-categoria">{grupo.nombre}</h3>
                <div className="productos-grid">
                  {grupo.productos.map(producto => (
                    <div
                      key={producto.id_producto}
                      className={`producto-card ${producto.stock <= 0 ? 'agotado' : ''}`}
                      onClick={() => producto.stock > 0 && agregarProducto(producto)}
                    >
                      <h3>{producto.nombre}</h3>
                      <p className="precio">${producto.precio.toFixed(2)}</p>
                      <p className="stock">
                        {producto.stock <= 0 ? 'AGOTADO' : `Stock: ${producto.stock}`}
                      </p>
                    </div>
                  ))}
                </div>
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
                          max={productos.find(p => p.id_producto === item.id_producto)?.stock || 1}
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.id_producto, parseInt(e.target.value) || 1)}
                          className="cantidad-input"
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
              onClick={() => setVentaActual({ items: [], subtotal: 0, descuento: 0, total: 0 })}
            >
              Cancelar Venta
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