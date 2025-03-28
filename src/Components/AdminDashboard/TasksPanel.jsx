import { useState } from 'react';

const TasksPanel = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin',
      role: 'Administrador',
      tasks: []
    },
    {
      id: 2,
      name: 'Carlos Gómez',
      role: 'Jardinero',
      tasks: [
        {
          id: 1,
          title: 'Podar rosales',
          description: 'Podar los rosales del jardín principal',
          dueDate: '2023-06-15',
          completed: false
        }
      ]
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) return;

    setUsers(users.map(user => {
      if (user.id === parseInt(newTask.assignedTo)) {
        return {
          ...user,
          tasks: [
            ...user.tasks,
            {
              id: Date.now(),
              title: newTask.title,
              description: newTask.description,
              dueDate: newTask.dueDate,
              completed: false
            }
          ]
        };
      }
      return user;
    }));

    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
  };

  const toggleTask = (userId, taskId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          tasks: user.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return user;
    }));
  };

  return (
    <div className="tasks-panel">
      <h2>Gestión de Tareas</h2>

      <form onSubmit={addTask} className="task-form">
        <h3>Crear Nueva Tarea</h3>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Título de la tarea"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Descripción detallada"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
        </div>

        <div className="form-group">
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
            required
          >
            <option value="">Asignar a...</option>
            {users.filter(u => u.role !== 'Administrador').map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
          />
        </div>

        <button type="submit" className="btn-primary">
          Asignar Tarea
        </button>
      </form>

      <div className="tasks-list">
        {users.filter(user => user.tasks.length > 0).map(user => (
          <div key={user.id} className="user-tasks">
            <h3>{user.name} <span>({user.role})</span></h3>
            {user.tasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(user.id, task.id)}
                  />
                  <h4>{task.title}</h4>
                </div>
                <p>{task.description}</p>
                <div className="task-footer">
                  <span>📅 {task.dueDate || 'Sin fecha límite'}</span>
                  <span>{task.completed ? '✅ Completada' : '🟡 Pendiente'}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPanel;