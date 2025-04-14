import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

// Middleware de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'invernadero',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

// -------------------- LOGIN --------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log("📥 Datos recibidos en el servidor:", req.body);

  if (!username || !password) {
    console.log("❌ Usuario o contraseña faltan");
    return res.status(400).json({
      success: false,
      error: 'Usuario y contraseña son requeridos'
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error MySQL:", err);
      return res.status(500).json({
        success: false,
        error: 'Error en la base de datos'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id_usuario,
        username: user.username,
        role: user.id_rol,
        nombre: user.nombre,
        apellidoP: user.apellidoP,
        apellidoM: user.apellidoM,
        fecha_creacion: user.fecha_creacion
      }
    });
  });
});

// -------------------- USUARIOS --------------------
app.get('/usuarios', (req, res) => {
  const sql = `
  SELECT 
    id_usuario AS ID,
    CONCAT(nombre, ' ', apellidoP, ' ', apellidoM) AS 'Nombre Completo',
    CASE 
      WHEN id_rol = 1 THEN 'Admin'
      WHEN id_rol = 2 THEN 'Almacenista'
      WHEN id_rol = 3 THEN 'Cajero'
      WHEN id_rol = 4 THEN 'Jardinero'
      ELSE 'Desconocido'
    END AS Rol,
    username AS Usuario,
    password AS Contraseña,
    DATE_FORMAT(fecha_creacion, '%d/%m/%Y') AS 'Fecha de creación'
  FROM usuarios
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener usuarios:", err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
});

app.post('/usuarios', (req, res) => {
  const { nombre, apellidoPat, apellidoMat, username, role, password } = req.body;

  if (!nombre || !apellidoPat || !username || !password || !role) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
  }

  const validRoles = [1, 2, 3, 4];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Rol no válido' });
  }

  const sql = `
    INSERT INTO usuarios (nombre, apellidoP, apellidoM, username, password, id_rol, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [nombre, apellidoPat, apellidoMat, username, password, role], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al insertar usuario' });
    }

    res.json({ success: true, message: 'Usuario creado correctamente' });
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellidoPat, apellidoMat, username, password, role } = req.body;

  const sql = `
    UPDATE usuarios SET 
      nombre = ?, 
      apellidoP = ?, 
      apellidoM = ?, 
      username = ?, 
      password = ?, 
      id_rol = ? 
    WHERE id_usuario = ?
  `;

  db.query(sql, [nombre, apellidoPat, apellidoMat, username, password, role, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al actualizar usuario' });
    }

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  });
});

// -------------------- TAREAS --------------------
app.get('/tareas', (req, res) => {
  const sql = `
    SELECT 
      t.id_tarea,
      t.titulo,
      t.descripcion,
      t.prioridad,
      t.fecha_limite,
      t.completada,
      u.id_usuario,
      CONCAT(u.nombre, ' ', u.apellidoP, ' ', u.apellidoM) AS nombre_empleado
    FROM Tareas t
    LEFT JOIN usuarios_tareas ut ON t.id_tarea = ut.id_tarea
    LEFT JOIN usuarios u ON ut.id_usuario = u.id_usuario
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener tareas:", err);
      return res.status(500).json({ error: 'Error al obtener tareas' });
    }
    res.json(results);
  });
});

app.post('/tareas', (req, res) => {
  const { titulo, descripcion, prioridad, fecha_limite, id_usuario } = req.body;

  if (!titulo || !descripcion || !prioridad || !fecha_limite || !id_usuario) {
    return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
  }

  const insertTaskSQL = `
    INSERT INTO Tareas (titulo, descripcion, prioridad, fecha_limite, completada)
    VALUES (?, ?, ?, ?, false)
  `;

  db.query(insertTaskSQL, [titulo, descripcion, prioridad, fecha_limite], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar tarea:', err);
      return res.status(500).json({ success: false, error: 'Error al insertar tarea' });
    }

    const id_tarea = result.insertId;

    const assignSQL = `
      INSERT INTO usuarios_tareas (id_usuario, id_tarea)
      VALUES (?, ?)
    `;

    db.query(assignSQL, [id_usuario, id_tarea], (err2) => {
      if (err2) {
        console.error('❌ Error al asociar tarea con usuario:', err2);
        return res.status(500).json({ success: false, error: 'Error al asociar tarea con usuario' });
      }

      res.json({ success: true, message: 'Tarea creada y asignada correctamente' });
    });
  });
});

// -------------------- ELIMINAR TAREA --------------------
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;

  // Primero, verificamos si la tarea existe en la base de datos
  const checkTaskSQL = 'SELECT * FROM Tareas WHERE id_tarea = ?';
  db.query(checkTaskSQL, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar tarea:', err);
      return res.status(500).json({ success: false, error: 'Error al verificar tarea' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    // Si la tarea existe, procederemos a eliminarla
    const deleteTaskSQL = 'DELETE FROM Tareas WHERE id_tarea = ?';
    db.query(deleteTaskSQL, [id], (err2) => {
      if (err2) {
        console.error('❌ Error al eliminar tarea:', err2);
        return res.status(500).json({ success: false, error: 'Error al eliminar tarea' });
      }

      res.json({ success: true, message: 'Tarea eliminada correctamente' });
    });
  });
});



// -------------------- REPORTES --------------------
app.get('/reportes/ventas_totales', (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ 
      success: false,
      error: 'Debes proporcionar fecha de inicio y fin' 
    });
  }

  // Consulta SQL mejorada con cálculo correcto del total
  const sql = `
    SELECT 
      v.id_venta,
      DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') AS fecha,
      v.total AS total_venta,
      COUNT(dv.id_detalle) AS items,
      GROUP_CONCAT(CONCAT(p.nombre, ' (', dv.cantidad, ' x $', dv.precio_unitario, ')') SEPARATOR ', ') AS productos_detalle,
      SUM(dv.total) AS total_calculado
    FROM Ventas v
    LEFT JOIN Detalle_ventas dv ON v.id_venta = dv.id_venta
    LEFT JOIN Producto p ON dv.id_producto = p.id_producto
    WHERE v.fecha BETWEEN ? AND ?
    GROUP BY v.id_venta
    ORDER BY v.fecha DESC
  `;

  db.query(sql, [start_date, end_date], (err, results) => {
    if (err) {
      console.error('Error SQL:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Error en la base de datos',
        details: err.message 
      });
    }

    // Verificar que los resultados tengan el campo 'total' correcto
    console.log('Resultados de ventas:', results);

    // Cálculo CORRECTO del total general
    const totalGeneral = results.reduce((sum, venta) => {
      return sum + parseFloat(venta.total_calculado || 0);  // Asegurarnos de que total_calculado esté definido
    }, 0);
    
    // Verificación de consistencia
    results.forEach(venta => {
      if (Math.abs(parseFloat(venta.total_venta) - parseFloat(venta.total_calculado)) > 0.01) {
        console.warn(`¡Atención! Venta ${venta.id_venta} tiene total inconsistente: 
          Total en Ventas: ${venta.total_venta} vs Calculado: ${venta.total_calculado}`);
      }
    });

    res.json({
      success: true,
      data: {
        ventas: results,
        resumen: {
          total_ventas: totalGeneral.toFixed(2),
          cantidad_ventas: results.length,
          periodo: `${start_date} a ${end_date}`,
          promedio_venta: results.length > 0 ? (totalGeneral / results.length).toFixed(2) : 0
        }
      }
    });
  });
});


// -------------------- DETALLE DE PRODUCTOS POR VENTA --------------------
app.get('/reportes/productos_venta/:id_venta', (req, res) => {
  const { id_venta } = req.params;

  const sql = `
    SELECT 
      p.nombre,
      dv.cantidad,
      dv.precio_unitario,
      dv.total
    FROM Detalle_ventas dv
    INNER JOIN Producto p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `;

  db.query(sql, [id_venta], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener productos de la venta:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Error en la base de datos' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No se encontraron productos para esta venta' 
      });
    }

    res.json({ success: true, productos: results });
  });
});




// Iniciar servidor
app.listen(3001, () => {
  console.log('✅ Servidor en http://localhost:3001');
});