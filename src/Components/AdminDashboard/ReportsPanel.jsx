import React, { useState, useEffect } from 'react';
import './ReportsPanel.css';

const ReportsPanel = () => {
  // Datos simulados basados en tu base de datos
  const [salesData, setSalesData] = useState([
    { id: 1, product: 'Plantas ornamentales', date: '2023-06-15', amount: 12500, quantity: 50, location: 'Italia' },
    { id: 2, product: 'Fertilizantes', date: '2023-06-10', amount: 8500, quantity: 120, location: 'Italia' },
    { id: 3, product: 'Herramientas', date: '2023-06-05', amount: 3200, quantity: 25, location: 'Roma' }
  ]);

  const [productsData, setProductsData] = useState([
    { id: 1, name: 'Plantas ornamentales', category: 'Plantas', stock: 150, price: 250 },
    { id: 2, name: 'Fertilizantes', category: 'Insumos', stock: 300, price: 70 },
    { id: 3, name: 'Herramientas', category: 'Equipo', stock: 50, price: 120 }
  ]);

  const [operationsData, setOperationsData] = useState([
    { id: 1, type: 'Compra', product: 'Fertilizantes', date: '2023-06-01', quantity: 200, amount: 10000 },
    { id: 2, type: 'Venta', product: 'Plantas ornamentales', date: '2023-06-15', quantity: 50, amount: 12500 },
    { id: 3, type: 'Devolución', product: 'Herramientas', date: '2023-06-18', quantity: 2, amount: -240 }
  ]);

  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start: '2023-06-01',
    end: '2023-06-30'
  });
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOperations: 0
  });

  // Filtra los datos según el rango de fechas
  useEffect(() => {
    const filterData = () => {
      let data = [];
      let salesTotal = 0;
      let productsTotal = productsData.length;
      let operationsTotal = 0;

      if (activeReport === 'sales') {
        data = salesData.filter(item => 
          item.date >= dateRange.start && item.date <= dateRange.end
        );
        salesTotal = data.reduce((sum, item) => sum + item.amount, 0);
      } 
      else if (activeReport === 'products') {
        data = [...productsData];
      }
      else if (activeReport === 'operations') {
        data = operationsData.filter(item => 
          item.date >= dateRange.start && item.date <= dateRange.end
        );
        operationsTotal = data.reduce((sum, item) => sum + Math.abs(item.amount), 0);
      }

      setFilteredData(data);
      setSummary({
        totalSales: salesTotal,
        totalProducts: productsTotal,
        totalOperations: operationsTotal
      });
    };

    filterData();
  }, [activeReport, dateRange, salesData, productsData, operationsData]);

  const handleGenerateReport = () => {
    // Aquí iría la lógica para generar un reporte descargable
    alert(`Reporte de ${activeReport} generado para el período ${dateRange.start} al ${dateRange.end}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  return (
    <div className="reports-container">
      <header className="reports-header">
        <h1>📊 Panel de Reportes</h1>
        <p> Análisis y seguimiento de operaciones</p>
      </header>

      <div className="reports-content">
        {/* Panel de controles */}
        <section className="controls-panel">
          <div className="report-type-selector">
            <h2>Tipo de Reporte</h2>
            <div className="report-tabs">
              <button
                className={activeReport === 'sales' ? 'active' : ''}
                onClick={() => setActiveReport('sales')}
              >
                Ventas
              </button>
              <button
                className={activeReport === 'products' ? 'active' : ''}
                onClick={() => setActiveReport('products')}
              >
                Productos
              </button>
              <button
                className={activeReport === 'operations' ? 'active' : ''}
                onClick={() => setActiveReport('operations')}
              >
                Operaciones
              </button>
            </div>
          </div>

          <div className="date-range-selector">
            <h2>Rango de Fechas</h2>
            <div className="date-inputs">
              <div className="form-group">
                <label>Desde</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Hasta</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  min={dateRange.start}
                />
              </div>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <h3>Resumen</h3>
              <div className="summary-item">
                <span>Ventas totales:</span>
                <span className="amount">{formatCurrency(summary.totalSales)}</span>
              </div>
              <div className="summary-item">
                <span>Productos registrados:</span>
                <span className="amount">{summary.totalProducts}</span>
              </div>
              <div className="summary-item">
                <span>Operaciones totales:</span>
                <span className="amount">{formatCurrency(summary.totalOperations)}</span>
              </div>
            </div>
          </div>

          <button 
            className="generate-report-btn"
            onClick={handleGenerateReport}
          >
            Generar Reporte PDF
          </button>
        </section>

        {/* Panel de visualización de datos */}
        <section className="data-panel">
          <div className="data-header">
            <h2>
              {activeReport === 'sales' && 'Reporte de Ventas'}
              {activeReport === 'products' && 'Inventario de Productos'}
              {activeReport === 'operations' && 'Historial de Operaciones'}
            </h2>
            <div className="data-actions">
              <button className="export-btn">
                Exportar a Excel
              </button>
            </div>
          </div>

          <div className="data-table-container">
            {activeReport === 'sales' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Ubicación</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(sale => (
                    <tr key={sale.id}>
                      <td>{sale.id}</td>
                      <td>{sale.product}</td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>{sale.quantity}</td>
                      <td>{formatCurrency(sale.amount)}</td>
                      <td>{sale.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'products' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio Unitario</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.stock}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{formatCurrency(product.price * product.stock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'operations' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(op => (
                    <tr key={op.id} className={op.type.toLowerCase()}>
                      <td>{op.id}</td>
                      <td>{op.type}</td>
                      <td>{op.product}</td>
                      <td>{new Date(op.date).toLocaleDateString()}</td>
                      <td>{op.quantity}</td>
                      <td>{formatCurrency(op.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredData.length === 0 && (
              <div className="no-data-message">
                <p>No hay datos disponibles para el período seleccionado</p>
              </div>
            )}
          </div>

          {/* Gráficos de resumen */}
          <div className="charts-container">
            <div className="chart-card">
              <h3>Ventas por Producto</h3>
              <div className="chart-placeholder">
                [Gráfico de barras: Ventas por producto]
              </div>
            </div>
            <div className="chart-card">
              <h3>Movimiento de Inventario</h3>
              <div className="chart-placeholder">
                [Gráfico de líneas: Entradas vs Salidas]
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsPanel;