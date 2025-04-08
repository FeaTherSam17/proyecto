import React, { useState } from 'react';
import './SuppliersPanel.css';

const SuppliersPanel = () => {
  // Datos de ejemplo basados en tu estructura
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Viveros MX', contact: 'Juan Pérez', phone: '5512345678', email: 'contacto@viverosmx.com', products: 'Plantas ornamentales, sustratos' },
    { id: 2, name: 'Plantas SA', contact: 'María García', phone: '5587654321', email: 'ventas@plantassa.com', products: 'Fertilizantes, herramientas' },
    { id: 3, name: 'Insumos Verdes', contact: 'Carlos López', phone: '5532145698', email: 'info@insumosverdes.mx', products: 'Pesticidas, riego' }
  ]);

  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      type: 'Compra', 
      supplierId: 1, 
      date: '2023-06-15', 
      amount: 4500, 
      products: [
        { name: 'Rosales', quantity: 50, price: 50 },
        { name: 'Sustrato premium', quantity: 20, price: 100 }
      ],
      invoice: 'FAC-001'
    },
    { 
      id: 2, 
      type: 'Devolución', 
      supplierId: 2, 
      date: '2023-06-18', 
      amount: 1200, 
      reason: 'Producto defectuoso',
      products: [
        { name: 'Fertilizante NPK', quantity: 10, price: 120 }
      ],
      invoice: 'DEV-001'
    }
  ]);

  const [activeTab, setActiveTab] = useState('transactions');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    products: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    type: 'Compra',
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    products: [],
    amount: 0,
    invoice: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'supplier' o 'transaction'

  const addSupplier = (e) => {
    e.preventDefault();
    const supplier = {
      id: Date.now(),
      ...newSupplier
    };
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: '',
      contact: '',
      phone: '',
      email: '',
      products: ''
    });
    setShowModal(false);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      ...newTransaction
    };
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: 'Compra',
      supplierId: '',
      date: new Date().toISOString().split('T')[0],
      products: [],
      amount: 0,
      invoice: ''
    });
    setShowModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const getSupplierName = (id) => {
    return suppliers.find(s => s.id === id)?.name || 'Proveedor desconocido';
  };

  return (
    <div className="suppliers-container">
      <header className="suppliers-header">
        <h1>🌿 Gestión de Proveedores</h1>
        <p>Compras y relaciones con proveedores</p>
      </header>

      <div className="suppliers-content">
        {/* Panel de navegación */}
        <nav className="suppliers-nav">
          <button
            className={activeTab === 'transactions' ? 'active' : ''}
            onClick={() => setActiveTab('transactions')}
          >
            Movimientos
          </button>
          <button
            className={activeTab === 'suppliers' ? 'active' : ''}
            onClick={() => setActiveTab('suppliers')}
          >
            Proveedores
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </button>
        </nav>

        {/* Panel de acciones */}
        <div className="actions-panel">
          {activeTab === 'transactions' && (
            <>
              <button 
                className="action-button primary"
                onClick={() => {
                  setModalType('transaction');
                  setNewTransaction({
                    type: 'Compra',
                    supplierId: suppliers[0]?.id || '',
                    date: new Date().toISOString().split('T')[0],
                    products: [],
                    amount: 0,
                    invoice: ''
                  });
                  setShowModal(true);
                }}
              >
                + Registrar Compra
              </button>
              <button 
                className="action-button secondary"
                onClick={() => {
                  setModalType('transaction');
                  setNewTransaction({
                    type: 'Devolución',
                    supplierId: suppliers[0]?.id || '',
                    date: new Date().toISOString().split('T')[0],
                    products: [],
                    amount: 0,
                    invoice: '',
                    reason: ''
                  });
                  setShowModal(true);
                }}
              >
                + Registrar Devolución
              </button>
            </>
          )}

          {activeTab === 'suppliers' && (
            <button 
              className="action-button primary"
              onClick={() => {
                setModalType('supplier');
                setShowModal(true);
              }}
            >
              + Nuevo Proveedor
            </button>
          )}
        </div>

        {/* Contenido principal */}
        <div className="main-content">
          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <h2>Historial de Movimientos</h2>
              <div className="transactions-table-container">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Proveedor</th>
                      <th>Fecha</th>
                      <th>Factura</th>
                      <th>Monto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map(tx => (
                        <tr key={tx.id} className={tx.type.toLowerCase()}>
                          <td>
                            <span className={`tx-type ${tx.type.toLowerCase()}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td>{getSupplierName(tx.supplierId)}</td>
                          <td>{new Date(tx.date).toLocaleDateString()}</td>
                          <td>{tx.invoice}</td>
                          <td>{formatCurrency(tx.amount)}</td>
                          <td>
                            <button 
                              className="action-icon"
                              onClick={() => {
                                setModalType('transaction');
                                setNewTransaction(tx);
                                setShowModal(true);
                              }}
                            >
                              ✏️
                            </button>
                            <button 
                              className="action-icon danger"
                              onClick={() => deleteTransaction(tx.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">
                          No hay movimientos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="suppliers-section">
              <h2>Lista de Proveedores</h2>
              <div className="suppliers-grid">
                {suppliers.length > 0 ? (
                  suppliers.map(supplier => (
                    <div key={supplier.id} className="supplier-card">
                      <h3>{supplier.name}</h3>
                      <div className="supplier-info">
                        <p><strong>Contacto:</strong> {supplier.contact}</p>
                        <p><strong>Teléfono:</strong> {supplier.phone}</p>
                        <p><strong>Email:</strong> {supplier.email}</p>
                        <p><strong>Productos:</strong> {supplier.products}</p>
                      </div>
                      <div className="supplier-actions">
                        <button className="edit-btn">Editar</button>
                        <button className="delete-btn">Eliminar</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-suppliers">
                    <p>No hay proveedores registrados</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <h2>Productos por Proveedor</h2>
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Productos</th>
                      <th>Última Compra</th>
                      <th>Precio Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(supplier => (
                      <tr key={supplier.id}>
                        <td>{supplier.name}</td>
                        <td>{supplier.products}</td>
                        <td>
                          {transactions
                            .filter(tx => tx.supplierId === supplier.id && tx.type === 'Compra')
                            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || 'N/A'}
                        </td>
                        <td>
                          {formatCurrency(
                            transactions
                              .filter(tx => tx.supplierId === supplier.id && tx.type === 'Compra')
                              .reduce((sum, tx) => sum + tx.amount, 0) / 
                            transactions
                              .filter(tx => tx.supplierId === supplier.id && tx.type === 'Compra')
                              .length || 0
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para formularios */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            {modalType === 'supplier' ? (
              <>
                <h2>{newSupplier.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                <form onSubmit={addSupplier}>
                  <div className="form-group">
                    <label>Nombre del Proveedor*</label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Persona de Contacto*</label>
                      <input
                        type="text"
                        value={newSupplier.contact}
                        onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono*</label>
                      <input
                        type="tel"
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Productos que provee*</label>
                    <textarea
                      value={newSupplier.products}
                      onChange={(e) => setNewSupplier({...newSupplier, products: e.target.value})}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    {newSupplier.id ? 'Actualizar' : 'Registrar'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>{newTransaction.type === 'Compra' ? 'Registrar Compra' : 'Registrar Devolución'}</h2>
                <form onSubmit={addTransaction}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Proveedor*</label>
                      <select
                        value={newTransaction.supplierId}
                        onChange={(e) => setNewTransaction({...newTransaction, supplierId: parseInt(e.target.value)})}
                        required
                      >
                        <option value="">Seleccionar proveedor</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fecha*</label>
                      <input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>No. Factura*</label>
                      <input
                        type="text"
                        value={newTransaction.invoice}
                        onChange={(e) => setNewTransaction({...newTransaction, invoice: e.target.value})}
                        required
                        placeholder={newTransaction.type === 'Compra' ? 'FAC-001' : 'DEV-001'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Monto Total*</label>
                      <input
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {newTransaction.type === 'Devolución' && (
                    <div className="form-group">
                      <label>Motivo de la Devolución*</label>
                      <input
                        type="text"
                        value={newTransaction.reason || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, reason: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Productos (opcional)</label>
                    <textarea
                      placeholder="Ej: 50 Rosales a $50 c/u, 20 bolsas de sustrato a $100 c/u"
                      value={newTransaction.products.map(p => `${p.quantity} ${p.name} a ${formatCurrency(p.price)} c/u`).join('\n')}
                      onChange={(e) => {
                        // Implementar lógica para parsear productos
                      }}
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    {newTransaction.id ? 'Actualizar' : 'Registrar'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPanel;