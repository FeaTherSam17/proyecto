import { useState } from 'react';
import './ReportsPanel.css';

const ReportsPanel = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedVentaId, setSelectedVentaId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchVentas = async () => {
    try {
      const response = await fetch(`/reportes/ventas_totales?start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();

      if (data.success) {
        setVentas(data.data.ventas);
      } else {
        setError(data.error || 'Error al obtener ventas');
      }
    } catch (err) {
      console.error('Error al obtener las ventas:', err);
      setError('Hubo un error al obtener los datos');
    }
  };

  const fetchProductosVenta = async (idVenta) => {
    try {
      const res = await fetch(`/reportes/productos_venta/${idVenta}`);
      const data = await res.json();

      if (data.success) {
        setProductos(data.productos);
        setSelectedVentaId(idVenta);
      }
    } catch (err) {
      console.error(err);
      setError('Error al obtener productos vendidos');
    }
  };

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      setError('Por favor, ingrese las fechas de inicio y fin');
      return;
    }
    setError('');
    setProductos([]);
    setSelectedVentaId(null);
    fetchVentas();
  };

  const renderVentas = () => {
    return ventas.map((venta) => (
      <tr key={venta.id_venta}>
        <td>{venta.id_venta}</td>
        <td>{venta.fecha}</td>
        <td>${venta.total_venta.toFixed(2)}</td>
        <td>
          <button className="detalle-btn" onClick={() => fetchProductosVenta(venta.id_venta)}>
            Ver productos
          </button>
        </td>
      </tr>
    ));
  };

  const renderProductos = () => {
    if (productos.length === 0) return null;

    return (
      <div className="productos-vendidos">
        <h3>Productos vendidos en la venta #{selectedVentaId}</h3>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, idx) => (
              <tr key={idx}>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>${p.precio_unitario.toFixed(2)}</td>
                <td>${p.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="reports-wrapper">
      <h2>Reportes de Ventas</h2>
      <div className="date-filter">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={handleCalculate}>Calcular</button>
      </div>

      {error && <p className="error">{error}</p>}

      {ventas.length > 0 && (
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>{renderVentas()}</tbody>
        </table>
      )}

      {renderProductos()}
    </div>
  );
};

export default ReportsPanel;
