import React, { useState, useEffect } from 'react';
import './SuppliersPanel.css';

const SuppliersPanel = () => {
  // Estados
  const [suppliers, setSuppliers] = useState([]);
  const [operations, setOperations] = useState([]);
  const [activeTab, setActiveTab] = useState('operations');
  const [newSupplier, setNewSupplier] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    factura: '' // Factura solo para proveedores
  });
  const [newOperation, setNewOperation] = useState({
    type: 'compra',
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    productos: [],
    amount: 0
    // Eliminado: factura (no existe en la tabla operaciones_proveedores)
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [suppliersRes, operationsRes] = await Promise.all([
          fetch('/suppliers'),
          fetch('/operaciones-proveedores')
        ]);

        if (!suppliersRes.ok) throw new Error('Error al cargar proveedores');
        if (!operationsRes.ok) throw new Error('Error al cargar operaciones');

        const suppliersData = await suppliersRes.json();
        const operationsData = await operationsRes.json();

        setSuppliers(suppliersData.suppliers || []);
        setOperations(operationsData.operaciones || []);
      } catch (err) {
        console.error('Error:', err);
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Guardar/Editar Proveedor
  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingSupplier 
        ? `/suppliers/${editingSupplier.id_proveedor}`
        : '/suppliers';
      const method = editingSupplier ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSupplier || newSupplier)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error en el servidor');

      // Actualizar estado
      if (editingSupplier) {
        setSuppliers(suppliers.map(s => 
          s.id_proveedor === editingSupplier.id_proveedor 
            ? { ...s, ...editingSupplier } 
            : s
        ));
      } else {
        setSuppliers([...suppliers, { ...newSupplier, id_proveedor: data.id }]);
      }

      // Resetear formulario
      setShowModal(false);
      setEditingSupplier(null);
      setNewSupplier({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
        factura: ''
      });

      alert(data.message || 'Proveedor guardado exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar Operación (sin factura)
  const handleOperationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const operationData = {
        tipo: newOperation.type,
        id_proveedor: newOperation.supplierId,
        fecha: newOperation.date,
        total: newOperation.amount,
        descripcion: newOperation.description // Ahora usa description
        // No incluir factura (no existe en la tabla)
      };

      const response = await fetch('/operaciones-proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operationData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error en el servidor');

      // Actualizar estado
      setOperations([data.operacion, ...operations]);

      // Resetear formulario
      setShowModal(false);
      setNewOperation({
        type: 'compra',
        supplierId: '',
        date: new Date().toISOString().split('T')[0],
        productos: [],
        amount: 0
      });

      alert(data.message || 'Operación registrada exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Proveedor
  const deleteSupplier = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/suppliers/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al eliminar');

      setSuppliers(suppliers.filter(s => s.id_proveedor !== id));
      alert(data.message || 'Proveedor eliminado');
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar Operación
  const deleteOperation = async (id) => {
    if (!window.confirm('¿Eliminar esta operación?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/operaciones-proveedores/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al eliminar');

      setOperations(operations.filter(op => op.id_operacion !== id));
      alert(data.message || 'Operación eliminada');
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="suppliers-container">
      <header className="suppliers-header">
        <h1>🌿 Gestión de Proveedores</h1>
        <p>Compras y operaciones con proveedores</p>
      </header>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="suppliers-content">
        <nav className="suppliers-nav">
          <button
            className={activeTab === 'operations' ? 'active' : ''}
            onClick={() => setActiveTab('operations')}
            disabled={isLoading}
          >
            Operaciones
          </button>
          <button
            className={activeTab === 'suppliers' ? 'active' : ''}
            onClick={() => setActiveTab('suppliers')}
            disabled={isLoading}
          >
            Proveedores
          </button>
        </nav>

        <div className="actions-panel">
          {activeTab === 'operations' && (
            <button 
              className="action-button primary"
              onClick={() => {
                setModalType('operation');
                setNewOperation({ 
                  type: 'compra', 
                  supplierId: suppliers[0]?.id_proveedor || '', 
                  date: new Date().toISOString().split('T')[0], 
                  productos: [], 
                  amount: 0
                });
                setShowModal(true);
              }}
              disabled={isLoading || suppliers.length === 0}
            >
              + Registrar Operación
            </button>
          )}

          {activeTab === 'suppliers' && (
            <button 
              className="action-button primary"
              onClick={() => {
                setModalType('supplier');
                setNewSupplier({ 
                  nombre: '', 
                  contacto: '', 
                  telefono: '', 
                  email: '', 
                  factura: '' 
                });
                setEditingSupplier(null);
                setShowModal(true);
              }}
              disabled={isLoading}
            >
              + Nuevo Proveedor
            </button>
          )}
        </div>

        <div className="main-content">
          {activeTab === 'operations' ? (
            <div className="operations-section">
              <h2>Historial de Operaciones</h2>
              {operations.length === 0 ? (
                <p className="no-data">No hay operaciones registradas</p>
              ) : (
                <div className="operations-table-container">
                  <table className="operations-table">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operations.map(op => (
                        <tr key={op.id_operacion}>
                          <td>
                            <span className={`op-badge ${op.tipo}`}>
                              {op.tipo === 'compra' ? '🛒 Compra' : '↩️ Devolución'}
                            </span>
                          </td>
                          <td>{op.proveedor}</td>
                          <td>{formatDate(op.fecha)}</td>
                          <td>{op.descripcion}</td>
                          <td>{formatCurrency(op.total)}</td>
                          <td>
                            <button 
                              className="action-icon danger"
                              onClick={() => deleteOperation(op.id_operacion)}
                              disabled={isLoading}
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="suppliers-section">
              <h2>Proveedores</h2>
              {suppliers.length === 0 ? (
                <p className="no-data">No hay proveedores registrados</p>
              ) : (
                <div className="suppliers-table-container">
                  <table className="suppliers-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map(supplier => (
                        <tr key={supplier.id_proveedor}>
                          <td>{supplier.nombre}</td>
                          <td>{supplier.contacto}</td>
                          <td>{supplier.telefono}</td>
                          <td>{supplier.email}</td>
                          <td>
                            <button
                              onClick={() => {
                                setModalType('supplier');
                                setEditingSupplier(supplier);
                                setShowModal(true);
                              }}
                              disabled={isLoading}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => deleteSupplier(supplier.id_proveedor)}
                              disabled={isLoading}
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
              onClick={() => !isLoading && setShowModal(false)}
              disabled={isLoading}
            >
              ×
            </button>
            
            {modalType === 'operation' ? (
              <form onSubmit={handleOperationSubmit}>
                <h2>Registrar Nueva Operación</h2>
                
                <div className="form-group">
                  <label>Tipo de Operación *</label>
                  <select
                    value={newOperation.type}
                    onChange={(e) => setNewOperation({ 
                      ...newOperation, 
                      type: e.target.value 
                    })}
                    required
                    disabled={isLoading}
                  >
                    <option value="compra">Compra</option>
                    <option value="devolucion">Devolución</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Proveedor *</label>
                  <select
                    value={newOperation.supplierId}
                    onChange={(e) => setNewOperation({ 
                      ...newOperation, 
                      supplierId: e.target.value 
                    })}
                    required
                    disabled={isLoading || suppliers.length === 0}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {suppliers.map(s => (
                      <option key={s.id_proveedor} value={s.id_proveedor}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    value={newOperation.date}
                    onChange={(e) => setNewOperation({ 
                      ...newOperation, 
                      date: e.target.value 
                    })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    value={newOperation.description || ""}
                    onChange={(e) => setNewOperation({ 
                      ...newOperation, 
                      description: e.target.value 
                    })}
                    placeholder="Ej: 50 bolsas de sustrato, 10 litros de fertilizante"
                    required
                    maxLength={100}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newOperation.amount}
                    onChange={(e) => setNewOperation({ 
                      ...newOperation, 
                      amount: parseFloat(e.target.value) || 0 
                    })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Operación'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => !isLoading && setShowModal(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSupplierSubmit}>
                <h2>{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={editingSupplier?.nombre || newSupplier.nombre}
                    onChange={(e) => 
                      editingSupplier 
                        ? setEditingSupplier({ 
                            ...editingSupplier, 
                            nombre: e.target.value 
                          })
                        : setNewSupplier({ 
                            ...newSupplier, 
                            nombre: e.target.value 
                          })
                    }
                    required
                    maxLength={50}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    value={editingSupplier?.telefono || newSupplier.telefono}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      editingSupplier 
                        ? setEditingSupplier({ 
                            ...editingSupplier, 
                            telefono: onlyNums 
                          })
                        : setNewSupplier({ 
                            ...newSupplier, 
                            telefono: onlyNums 
                          });
                    }}
                    required
                    pattern="[0-9]{10,15}"
                    maxLength={15}
                    minLength={10}
                    placeholder="Ej: 5512345678"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editingSupplier?.email || newSupplier.email}
                    onChange={(e) => 
                      editingSupplier 
                        ? setEditingSupplier({ 
                            ...editingSupplier, 
                            email: e.target.value 
                          })
                        : setNewSupplier({ 
                            ...newSupplier, 
                            email: e.target.value 
                          })
                    }
                    required
                    maxLength={40}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Contacto *</label>
                  <input
                    type="text"
                    value={editingSupplier?.contacto || newSupplier.contacto}
                    onChange={(e) => 
                      editingSupplier 
                        ? setEditingSupplier({ 
                            ...editingSupplier, 
                            contacto: e.target.value 
                          })
                        : setNewSupplier({ 
                            ...newSupplier, 
                            contacto: e.target.value 
                          })
                    }
                    required
                    maxLength={30}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Factura (Opcional)</label>
                  <input
                    type="text"
                    value={editingSupplier?.factura || newSupplier.factura}
                    onChange={(e) => 
                      editingSupplier 
                        ? setEditingSupplier({ 
                            ...editingSupplier, 
                            factura: e.target.value 
                          })
                        : setNewSupplier({ 
                            ...newSupplier, 
                            factura: e.target.value 
                          })
                    }
                    maxLength={10}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (editingSupplier ? 'Actualizando...' : 'Creando...') 
                      : (editingSupplier ? 'Actualizar Proveedor' : 'Crear Proveedor')
                    }
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => !isLoading && setShowModal(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPanel;