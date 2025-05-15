import { useState, useEffect } from 'react';
import './TasksPanel.css';

const TasksPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [gardeners, setGardeners] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'media'
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = () => {
    fetch('http://localhost:3001/tareas')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error al obtener tareas:', error));
  };

  useEffect(() => {
    fetch('http://localhost:3001/usuarios')
      .then((response) => response.json())
      .then((data) => {
        const filteredGardeners = data.filter(user => user.Rol === 'Jardinero');
        setGardeners(filteredGardeners);
        if (filteredGardeners.length > 0) {
          setNewTask(prev => ({ ...prev, assignedTo: filteredGardeners[0].ID }));
        }
      })
      .catch((error) => console.error('Error al obtener jardineros:', error));

    fetchTasks();
  }, []);

  const addTask = (e) => {
    e.preventDefault();

    if (
      !newTask.title ||
      !newTask.dueDate ||
      !newTask.priority ||
      !newTask.assignedTo ||
      isNaN(newTask.assignedTo)
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const taskData = {
      titulo: newTask.title,
      descripcion: newTask.description,
      prioridad: newTask.priority,
      fecha_limite: newTask.dueDate,
      id_usuario: newTask.assignedTo
    };

    fetch('http://localhost:3001/tareas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("✅ Tarea registrada correctamente.");
          setNewTask({
            title: '',
            description: '',
            priority: 'media',
            dueDate: '',
            assignedTo: gardeners.length > 0 ? gardeners[0].ID : '',
          });
          fetchTasks();
        } else {
          alert("❌ Error: " + data.error);
        }
      })
      .catch(err => {
        console.error("❌ Error al registrar tarea:", err);
        alert("Hubo un error al registrar la tarea.");
      });
  };

  const deleteTask = (taskId) => {
    fetch(`http://localhost:3001/tareas/${taskId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Aquí añadimos el console log
        if (data.success) {
          setTasks(tasks.filter((task) => task.id_tarea !== taskId));
          alert('Tarea eliminada correctamente');
        } else {
          alert('Error al eliminar la tarea');
        }
      })
      .catch((err) => {
        console.error('Error al eliminar tarea:', err);
        alert('Hubo un error al eliminar la tarea');
      });
  };
    
  

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending' && task.completada) return false;
    if (activeFilter === 'completed' && !task.completada) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const gardenerName = gardeners.find(g => g.ID === task.id_usuario)?.['Nombre Completo']?.toLowerCase() || '';
      return (
        task.titulo.toLowerCase().includes(searchLower) ||
        task.descripcion.toLowerCase().includes(searchLower) ||
        gardenerName.includes(searchLower)
      );
    }

    return true;
  });

  if (gardeners.length === 0) return <div>Cargando...</div>;

  return (
    <div className="admin-tasks-container">
      <header className="admin-tasks-header">
        <h1>Panel de Tareas - Administración</h1>
        <p>Asignación y gestión de tareas para jardineros</p>
      </header>

      <div className="admin-tasks-content">
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
                  maxLength={20}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  placeholder="Instrucciones detalladas..."
                  value={newTask.description}
                  maxLength={100}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Asignar a</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: parseInt(e.target.value) })}
                  >
                    {gardeners.map(gardener => (
                      <option key={gardener.ID} value={gardener.ID}>
                        {gardener['Nombre Completo']}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
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
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button type="submit" className="assign-button">
                Asignar Tarea
              </button>
            </form>
          </div>
        </section>

        <section className="tasks-list-panel">
          <div className="tasks-controls">
            <div className="filter-buttons">
              <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>Todas</button>
              <button className={activeFilter === 'pending' ? 'active' : ''} onClick={() => setActiveFilter('pending')}>Pendientes</button>
              <button className={activeFilter === 'completed' ? 'active' : ''} onClick={() => setActiveFilter('completed')}>Completadas</button>
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
      const gardener = gardeners.find(g => g.ID === task.id_usuario);
      return (
        <div key={task.id_tarea} className={`task-card ${task.prioridad} ${task.completada ? 'completed' : ''}`}>
          <div className="task-header">
            <div className="task-title">
              <h3>{task.titulo}</h3>
              <div className="task-meta">
                <span className="gardener-name">{gardener?.['Nombre Completo']}</span>
                {task.fecha_limite && (
                  <span className={`due-date ${new Date(task.fecha_limite) < new Date() && !task.completada ? 'overdue' : ''}`}>
                    📅 {new Date(task.fecha_limite).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="task-actions">
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id_tarea)} 
              >
                🗑️
              </button>
            </div>
          </div>

          {task.descripcion && (
            <div className="task-description">
              <p>{task.descripcion}</p>
            </div>
          )}

          <div className="task-footer">
            <span className={`priority-tag ${task.prioridad}`}>
              {task.prioridad === 'alta' ? 'Alta prioridad' : task.prioridad === 'media' ? 'Prioridad media' : 'Baja prioridad'}
            </span>
            <span className={`status-label ${task.completada ? 'completed' : 'pending'}`}>
              {task.completada ? 'Completada' : 'Pendiente'}
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
