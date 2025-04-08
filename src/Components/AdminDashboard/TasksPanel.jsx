import { useState } from 'react';
import './TasksPanel.css';

const TasksPanel = () => {
  // Datos de ejemplo - solo jardineros
  const gardeners = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María García' },
    { id: 3, name: 'Carlos López' }
  ];

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Podar rosales',
      description: 'Podar los rosales del jardín principal',
      assignedTo: 1,
      dueDate: '2023-06-15',
      completed: false,
      priority: 'media'
    },
    {
      id: 2,
      title: 'Regar plantas del invernadero 2',
      description: 'Regar todas las plantas y verificar sistema de riego',
      assignedTo: 2,
      dueDate: '2023-06-16',
      completed: true,
      priority: 'alta'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: gardeners[0].id, // Asigna al primer jardinero por defecto
    dueDate: '',
    priority: 'media'
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: gardeners[0].id,
      dueDate: '',
      priority: 'media'
    });
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro por estado
    if (activeFilter === 'pending' && task.completed) return false;
    if (activeFilter === 'completed' && !task.completed) return false;
    
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        gardeners.find(g => g.id === task.assignedTo)?.name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="admin-tasks-container">
      <header className="admin-tasks-header">
        <h1>Panel de Tareas - Administración</h1>
        <p>Asignación y gestión de tareas para jardineros</p>
      </header>

      <div className="admin-tasks-content">
        {/* Panel de asignación rápida */}
        <section className="quick-assign-panel">
          <div className="assign-card">
            <h2>Asignar Nueva Tarea</h2>
            <form onSubmit={addTask} className="task-form">
              <div className="form-group">
                <label>Título de la tarea*</label>
                <input
                  type="text"
                  placeholder="Nombre de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  placeholder="Instrucciones detalladas..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Asignar a</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: parseInt(e.target.value)})}
                  >
                    {gardeners.map(gardener => (
                      <option key={gardener.id} value={gardener.id}>
                        {gardener.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Fecha límite</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button type="submit" className="assign-button">
                Asignar Tarea
              </button>
            </form>
          </div>

          {/* Resumen rápido */}
          <div className="summary-card">
            <h3>Resumen</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{tasks.length}</span>
                <span className="stat-label">Total tareas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
                <span className="stat-label">Pendientes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Listado de tareas */}
        <section className="tasks-list-panel">
          <div className="tasks-controls">
            <div className="filter-buttons">
              <button
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                Todas
              </button>
              <button
                className={activeFilter === 'pending' ? 'active' : ''}
                onClick={() => setActiveFilter('pending')}
              >
                Pendientes
              </button>
              <button
                className={activeFilter === 'completed' ? 'active' : ''}
                onClick={() => setActiveFilter('completed')}
              >
                Completadas
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="tasks-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const gardener = gardeners.find(g => g.id === task.assignedTo);
                return (
                  <div key={task.id} className={`task-card ${task.priority} ${task.completed ? 'completed' : ''}`}>
                    <div className="task-header">
                      <div className="task-title">
                        <h3>{task.title}</h3>
                        <div className="task-meta">
                          <span className="gardener-name">{gardener?.name}</span>
                          {task.dueDate && (
                            <span className={`due-date ${new Date(task.dueDate) < new Date() && !task.completed ? 'overdue' : ''}`}>
                              📅 {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <button
                          className={`status-toggle ${task.completed ? 'completed' : ''}`}
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          {task.completed ? '✅' : '◻️'}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <div className="task-description">
                        <p>{task.description}</p>
                      </div>
                    )}

                    <div className="task-footer">
                      <span className={`priority-tag ${task.priority}`}>
                        {task.priority === 'alta' ? 'Alta prioridad' : 
                         task.priority === 'media' ? 'Prioridad media' : 'Baja prioridad'}
                      </span>
                      <span className={`status-label ${task.completed ? 'completed' : 'pending'}`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-tasks-message">
                <p>No hay tareas {activeFilter !== 'all' ? ` ${activeFilter}` : ''} que coincidan con la búsqueda</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TasksPanel;