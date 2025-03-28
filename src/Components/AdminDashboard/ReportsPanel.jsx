import React from 'react';
const ReportsPanel = () => {
    const reportData = [
      { id: 1, type: 'Ventas', period: 'Enero 2023', total: 12500 },
      { id: 2, type: 'Devoluciones', period: 'Enero 2023', total: 3200 },
      { id: 3, type: 'Compras', period: 'Enero 2023', total: 8500 }
    ];
  
    return (
      <div className="reports-panel">
        <h2>Reportes Generales</h2>
        
        <div className="report-filters">
          <select>
            <option>Todos los reportes</option>
            <option>Ventas</option>
            <option>Devoluciones</option>
            <option>Compras</option>
          </select>
          <input type="date" />
          <button>Generar Reporte</button>
        </div>
  
        <div className="reports-grid">
          {reportData.map(report => (
            <div key={report.id} className="report-card">
              <h3>{report.type} - {report.period}</h3>
              <p className="report-total">${report.total.toLocaleString()}</p>
              <button>Ver Detalles</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default ReportsPanel;