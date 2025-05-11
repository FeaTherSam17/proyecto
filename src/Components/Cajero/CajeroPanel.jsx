import React, { useState, useEffect } from 'react';
import './CajeroPanel.css';
import logo from '../Login/assets/logo.png';

const CajeroPanel = () => {
  // Estado para guardar todos los productos desde el backend
  const [productos, setProductos] = useState([]);

  // Estado para las categorías de productos
  const [categorias, setCategorias] = useState([]);

  // Estado para la venta que se está armando
  const [ventaActual, setVentaActual] = useState({
    items: [],
    subtotal: 0,
    descuento: 0,
    total: 0
  });

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  useEffect(() => {
    // Obtener productos al cargar el componente
    fetch('http://localhost:3001/productos')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProductos(data.data);
        }
      });

    // Obtener categorías
    fetch('http://localhost:3001/categorias')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategorias(data.data);
        }
      });

    // Evita que el usuario regrese con el botón "Atrás"
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.location.href = '/';
    };
  }, []);

  // Busca el nombre de una categoría según su ID
  const getCategoriaNombre = (id) => {
    const categoria = categorias.find(c => c.id_categoria === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  // Agrega un producto al carrito si hay stock disponible
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

  // Cambia la cantidad de un producto del carrito
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

  // Elimina un producto del carrito
  const eliminarProducto = (id) => {
    const itemsActualizados = ventaActual.items.filter(item => item.id_producto !== id);
    actualizarVenta(itemsActualizados);
  };

  // Recalcula los totales de la venta cuando cambia algo en los items
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

  // Aplica el descuento ingresado
  const aplicarDescuento = (e) => {
    const descuento = Number(e.target.value) || 0;
    const total = ventaActual.subtotal - descuento;

    setVentaActual({
      ...ventaActual,
      descuento,
      total
    });
  };

  // Filtrado por texto y por categoría
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'todas' ||
      getCategoriaNombre(producto.id_categoria) === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // Agrupar productos por categoría para mostrarlos ordenados
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

  // Mostrar productos sin categoría también, si aplica
  if (categoriaFiltro === 'todas') {
    const productosSinCategoria = productosFiltrados.filter(p => !p.id_categoria);
    if (productosSinCategoria.length > 0) {
      productosPorCategoria.push({
        nombre: 'Sin categoría',
        productos: productosSinCategoria
      });
    }
  }

  const categoriasFiltro = ['todas', ...categorias.map(c => c.nombre)];

  // Envía la venta al backend y actualiza el stock en frontend
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaVenta)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Venta registrada exitosamente');

          // Restar stock en el frontend para evitar recargar
          const productosActualizados = productos.map(prod => {
            const itemVendido = ventaActual.items.find(v => v.id_producto === prod.id_producto);
            if (itemVendido) {
              return { ...prod, stock: prod.stock - itemVendido.cantidad };
            }
            return prod;
          });
          setProductos(productosActualizados);

          // Limpiar el carrito
          setVentaActual({
            items: [],
            subtotal: 0,
            descuento: 0,
            total: 0
          });
        } else {
          alert('Error al registrar venta');
        }
      })
      .catch(error => {
        console.error('Error al enviar la venta:', error);
        alert('Error de conexión');
      });
  };

  // Cierra sesión
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
        {/* Sección de productos con filtros */}
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

          {/* Productos agrupados por categoría */}
          <div className="productos-categorizados">
            {productosPorCategoria.map(grupo => (
              <div key={grupo.nombre} className="categoria-grupo">
                <h3 className="titulo-categoria">{grupo.nombre}</h3>
                <div className="productos-grid">
                  {grupo.productos.map(producto => (
                    <div
                      key={producto.id_producto}
                      className="producto-card"
                      onClick={() => agregarProducto(producto)}
                    >
                      <h3>{producto.nombre}</h3>
                      <p className="precio">${producto.precio.toFixed(2)}</p>
                      <p className="categoria">{getCategoriaNombre(producto.id_categoria)}</p>
                      <p className="stock">Stock: {producto.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de carrito / venta actual */}
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
                          onChange={(e) =>
                            actualizarCantidad(item.id_producto, parseInt(e.target.value))
                          }
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

          {/* Totales y acciones */}
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
              onClick={() =>
                setVentaActual({ items: [], subtotal: 0, descuento: 0, total: 0 })
              }
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
