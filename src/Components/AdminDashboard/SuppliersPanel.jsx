import React, { useState } from 'react';
const SuppliersPanel = () => {
    const [transactions, setTransactions] = useState([
      { id: 1, type: 'Compra', supplier: 'Viveros MX', date: '15/01/2023', amount: 4500 },
      { id: 2, type: 'Devolución', supplier: 'Plantas SA', date: '20/01/2023', amount: 1200 }
    ]);
  
    return (
      <div className="suppliers-panel">
        <h2>Movimientos con Proveedores</h2>
        
        <div className="supplier-actions">
          <button>+ Nueva Compra</button>
          <button>+ Registrar Devolución</button>
        </div>
  
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.supplier}</td>
                <td>{tx.date}</td>
                <td>${tx.amount.toLocaleString()}</td>
                <td>
                  <button>📝</button>
                  <button>📊</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  export default SuppliersPanel;