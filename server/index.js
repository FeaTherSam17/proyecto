
import express from 'express'; // Framework para crear el servidor y manejar rutas
import mysql from 'mysql';     // Módulo para conectarse a bases de datos MySQL
import cors from 'cors';       // Middleware para permitir solicitudes desde otros orígenes (CORS)

// Inicialización de la aplicación Express
const app = express();

// Configuración del middleware CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permite solo solicitudes desde este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Cache-Control', 'Authorization'], // Cabeceras que el cliente puede enviar
}));

// Middleware para que Express pueda interpretar cuerpos JSON en las solicitudes
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',     // Dirección del servidor de la base de datos (localhost = el mismo equipo)
  user: 'root',          // Usuario con el que se conectará
  password: '',          // Contraseña del usuario (vacía en este caso)
  database: 'invernadero', // Nombre de la base de datos que se utilizará
  port: 3306             // Puerto por defecto de MySQL
});

// Intento de conexión a la base de datos
db.connect((err) => {
  if (err) {
    // Si hay un error, se muestra en consola
    console.error('❌ Error de conexión a MySQL:', err);
  } else {
    // Si la conexión es exitosa, se muestra un mensaje de éxito
    console.log('✅ Conectado a MySQL');
  }
});


//DOCUMENTAR LOS METODOS HTTP Y LA INICIALIZACION DEL SERVIDOR



// -------------------- LOGIN --------------------
app.post('/login', (req, res) => {
  // Se extraen usuario y contraseña desde el cuerpo de la solicitud
  const { username, password } = req.body;

  // Verificación de campos obligatorios
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Usuario y contraseña son requeridos'
    });
  }

  // Consulta para buscar el usuario en la base de datos
  const sql = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) 
      return res.status(500).json({ success: false, error: 'Error en la base de datos' });

    // Verifica si el usuario existe
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verifica la contraseña (en este caso, no hay cifrado)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }

    // Si es válido, responde con los datos del usuario
    res.json({
      success: true,
      user: {
        id_usuario: user.id_usuario,
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
  // Consulta SQL que retorna los datos de los usuarios formateados
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
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});
app.post('/usuarios', (req, res) => {
  // Se extraen los datos del cuerpo de la solicitud
  const { nombre, apellidoPat, apellidoMat, username, role, password } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !apellidoPat || !username || !password || !role) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
  }

  // Validación del rol
  const validRoles = [1, 2, 3, 4];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Rol no válido' });
  }

  // Inserta un nuevo usuario en la base de datos
  const sql = `
    INSERT INTO usuarios (nombre, apellidoP, apellidoM, username, password, id_rol, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(sql, [nombre, apellidoPat, apellidoMat, username, password, role], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al insertar usuario' });
    res.json({ success: true, message: 'Usuario creado correctamente' });
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellidoPat, apellidoMat, username, password, role } = req.body;

  // Actualiza los datos del usuario según su ID
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
  db.query(sql, [nombre, apellidoPat, apellidoMat, username, password, role, id], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al actualizar usuario' });
    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  // Elimina un usuario por ID
  const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  });
});


// -------------------- TAREAS --------------------
app.get('/tareas', (req, res) => {
  // Consulta que une tareas con usuarios asignados (si los hay)
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
    if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
    res.json(results);
  });
});

app.post('/tareas', (req, res) => {
  const { titulo, descripcion, prioridad, fecha_limite, id_usuario } = req.body;

  // Validación de campos
  if (!titulo || !descripcion || !prioridad || !fecha_limite || !id_usuario) {
    return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
  }

  // Inserta la tarea
  const insertTaskSQL = `
    INSERT INTO Tareas (titulo, descripcion, prioridad, fecha_limite, completada)
    VALUES (?, ?, ?, ?, false)
  `;

  db.query(insertTaskSQL, [titulo, descripcion, prioridad, fecha_limite], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al insertar tarea' });

    // Asocia la tarea al usuario
    const id_tarea = result.insertId;
    const assignSQL = `
      INSERT INTO usuarios_tareas (id_usuario, id_tarea)
      VALUES (?, ?)
    `;

    db.query(assignSQL, [id_usuario, id_tarea], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: 'Error al asociar tarea con usuario' });

      res.json({ success: true, message: 'Tarea creada y asignada correctamente' });
    });
  });
});

app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;

  // Verifica que la tarea exista
  const checkTaskSQL = 'SELECT * FROM Tareas WHERE id_tarea = ?';
  db.query(checkTaskSQL, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Error al verificar tarea' });

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    // Elimina la tarea si existe
    const deleteTaskSQL = 'DELETE FROM Tareas WHERE id_tarea = ?';
    db.query(deleteTaskSQL, [id], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: 'Error al eliminar tarea' });

      res.json({ success: true, message: 'Tarea eliminada correctamente' });
    });
  });
});
// -------------------- REPORTES --------------------

// Endpoint para obtener el resumen de todas las ventas en un periodo
app.get('/reportes/ventas_totales', (req, res) => {
  const { start_date, end_date } = req.query; // Se obtienen las fechas de inicio y fin desde la query

  // Validación: ambas fechas deben estar presentes
  if (!start_date || !end_date) {
    return res.status(400).json({ 
      success: false,
      error: 'Debes proporcionar fecha de inicio y fin' 
    });
  }

  // Consulta SQL para obtener las ventas realizadas entre las fechas indicadas
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

  // Ejecuta la consulta con los parámetros
  db.query(sql, [start_date, end_date], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error en la base de datos', 
        details: err.message 
      });
    }

    // Calcula el total general de todas las ventas en el periodo
    const totalGeneral = results.reduce((sum, venta) => {
      return sum + parseFloat(venta.total_calculado || 0);
    }, 0);

    // Devuelve las ventas con un resumen
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

// Endpoint para obtener los productos vendidos en una venta específica
app.get('/reportes/productos_venta/:id', (req, res) => {
  const idVenta = req.params.id;

  // Consulta SQL para traer los productos vendidos en la venta con id dado
  const sql = `
    SELECT 
      p.nombre AS nombre,
      dv.cantidad,
      dv.precio_unitario,
      dv.total
    FROM detalle_ventas dv
    JOIN producto p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `;

  // Ejecuta la consulta
  db.query(sql, [idVenta], (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener productos vendidos:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los productos vendidos',
        error: err.message
      });
    }

    // Si no hay resultados, devuelve una respuesta vacía
    if (!resultados || resultados.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron productos vendidos para esta venta',
        productos: []
      });
    }

    // Devuelve los productos de la venta
    res.status(200).json({
      success: true,
      productos: resultados
    });
  });
});


// -------------------- PROVEEDORES --------------------

// Obtener todos los proveedores ordenados alfabéticamente
app.get('/suppliers', (req, res) => {
  const sql = 'SELECT * FROM Proveedores ORDER BY nombre ASC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener proveedores',
        details: err.message 
      });
    }

    res.json({ 
      success: true, 
      suppliers: results 
    });
  });
});

// Crear un nuevo proveedor
app.post('/suppliers', (req, res) => {
  const { nombre, contacto, telefono, email, factura } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !contacto || !telefono || !email) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, contacto, teléfono y email son obligatorios'
    });
  }

  // Inserta el nuevo proveedor en la base de datos
  const sql = 'INSERT INTO Proveedores SET ?';
  db.query(sql, { nombre, contacto, telefono, email, factura }, (err, result) => {
    if (err) {
      console.error('Error al crear proveedor:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al crear proveedor',
        details: err.message
      });
    }

    res.json({
      success: true,
      id: result.insertId,
      message: 'Proveedor creado exitosamente'
    });
  });
});

// Actualizar los datos de un proveedor existente
app.put('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, telefono, email, factura } = req.body;

  // Validación de campos
  if (!nombre || !contacto || !telefono || !email) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, contacto, teléfono y email son obligatorios'
    });
  }

  // Actualiza el proveedor con el ID dado
  const sql = 'UPDATE Proveedores SET ? WHERE id_proveedor = ?';
  db.query(sql, [{ nombre, contacto, telefono, email, factura }, id], (err) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar proveedor',
        details: err.message
      });
    }

    res.json({
      success: true,
      message: 'Proveedor actualizado exitosamente'
    });
  });
});

// Eliminar un proveedor por su ID
app.delete('/suppliers/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM Proveedores WHERE id_proveedor = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar proveedor',
        details: err.message
      });
    }

    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
  });
});

// -------------------- OPERACIONES PROVEEDORES --------------------

// Obtener todas las operaciones de proveedores con su información relacionada
app.get('/operaciones-proveedores', (req, res) => {
  const sql = `
    SELECT 
      op.id_operacion,
      op.tipo,
      op.fecha,
      op.total,
      op.descripcion,
      p.id_proveedor,
      p.nombre AS proveedor,
      p.factura AS factura_proveedor -- Obtenemos la factura del proveedor
    FROM operaciones_proveedores op
    JOIN Proveedores p ON op.id_proveedor = p.id_proveedor
    ORDER BY op.fecha DESC
  `;
  
  // Ejecutamos la consulta a la base de datos
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener operaciones:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener operaciones',
        details: err.message
      });
    }
    
    // Enviamos las operaciones encontradas
    res.json({
      success: true,
      operaciones: results
    });
  });
});

// Crear una nueva operación para un proveedor
app.post('/operaciones-proveedores', (req, res) => {
  const { tipo, id_proveedor, fecha, total, descripcion } = req.body;
  
  // Validamos campos obligatorios (excepto descripción)
  if (!tipo || !id_proveedor || !fecha || !total) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son obligatorios excepto descripción'
    });
  }

  const sql = 'INSERT INTO operaciones_proveedores SET ?';
  // Insertamos la nueva operación en la base de datos
  db.query(sql, { tipo, id_proveedor, fecha, total, descripcion }, (err, result) => {
    if (err) {
      console.error('Error al crear operación:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al crear operación',
        details: err.message
      });
    }
    
    // Obtenemos los datos completos de la operación recién insertada
    const getSql = `
      SELECT 
        op.*, 
        p.nombre AS proveedor, 
        p.factura AS factura_proveedor
      FROM operaciones_proveedores op
      JOIN Proveedores p ON op.id_proveedor = p.id_proveedor
      WHERE op.id_operacion = ?
    `;
    
    db.query(getSql, [result.insertId], (err, results) => {
      if (err || !results.length) {
        return res.json({
          success: true,
          id: result.insertId,
          message: 'Operación creada pero no se pudo recuperar los detalles'
        });
      }
      
      // Enviamos los datos completos de la operación recién creada
      res.json({
        success: true,
        operacion: results[0],
        message: 'Operación creada exitosamente'
      });
    });
  });
});

// Eliminar una operación de proveedor por su ID
app.delete('/operaciones-proveedores/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM operaciones_proveedores WHERE id_operacion = ?';
  // Ejecutamos el borrado
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al eliminar operación:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar operación',
        details: err.message
      });
    }
    
    // Confirmamos que se eliminó correctamente
    res.json({
      success: true,
      message: 'Operación eliminada exitosamente'
    });
  });
});


// --------------------- SECCION DEL ALMACENISTA --------------------

// Ruta para agregar nuevo producto al inventario
app.post('/productos', (req, res) => {
  const { nombre, id_categoria, precio, stock, id_proveedor } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !id_categoria || !precio) {
    return res.status(400).json({ 
      success: false, 
      mensaje: 'Nombre, categoría y precio son obligatorios' 
    });
  }

  const nuevoProducto = {
    nombre,
    id_categoria,
    precio: parseFloat(precio),
    stock: parseInt(stock) || 0,  // Si no hay stock se usa 0 por defecto
    id_proveedor: id_proveedor || null  // El proveedor es opcional
  };

  // Consulta para insertar un nuevo producto
  const sql = `
    INSERT INTO producto 
    (nombre, id_categoria, precio, stock, id_proveedor)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    nuevoProducto.nombre,
    nuevoProducto.id_categoria,
    nuevoProducto.precio,
    nuevoProducto.stock,
    nuevoProducto.id_proveedor
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar producto:', err);
      return res.status(500).json({ 
        success: false, 
        mensaje: 'Error del servidor al guardar el producto',
        error: err.message 
      });
    }

    // Confirmamos la creación exitosa
    res.status(201).json({
      success: true,
      mensaje: 'Producto registrado con éxito',
      id: result.insertId
    });
  });
});

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  const sql = `
    SELECT 
      p.id_producto,
      p.nombre,
      c.nombre AS categoria,
      p.precio,
      p.stock,  -- Nos aseguramos de traer el stock disponible
      pr.nombre AS proveedor
    FROM producto p
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
  `;

  // Ejecutamos la consulta para obtener los productos
  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener productos:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener productos',
        error: err.message
      });
    }

    // Si no hay productos registrados
    if (!resultados || resultados.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron productos',
        data: []
      });
    }

    // Enviamos los productos obtenidos
    res.status(200).json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: resultados
    });
  });
});
// -------------------- OPERACIONES PROVEEDORES --------------------

// Obtener todas las operaciones con información del proveedor
app.get('/operaciones-proveedores', (req, res) => {
  const sql = `
    SELECT 
      op.id_operacion,
      op.tipo,
      op.fecha,
      op.total,
      op.descripcion,
      p.id_proveedor,
      p.nombre AS proveedor,
      p.factura AS factura_proveedor -- Obtenemos la factura del proveedor
    FROM operaciones_proveedores op
    JOIN Proveedores p ON op.id_proveedor = p.id_proveedor
    ORDER BY op.fecha DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener operaciones:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener operaciones',
        details: err.message
      });
    }
    
    res.json({
      success: true,
      operaciones: results
    });
  });
});

// Registrar una nueva operación de proveedor
app.post('/operaciones-proveedores', (req, res) => {
  const { tipo, id_proveedor, fecha, total, descripcion } = req.body;
  
  // Validación de campos requeridos
  if (!tipo || !id_proveedor || !fecha || !total) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son obligatorios excepto descripción'
    });
  }

  const sql = 'INSERT INTO operaciones_proveedores SET ?';
  db.query(sql, { tipo, id_proveedor, fecha, total, descripcion }, (err, result) => {
    if (err) {
      console.error('Error al crear operación:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al crear operación',
        details: err.message
      });
    }
    
    // Obtener los detalles de la operación recién insertada
    const getSql = `
      SELECT 
        op.*, 
        p.nombre AS proveedor, 
        p.factura AS factura_proveedor
      FROM operaciones_proveedores op
      JOIN Proveedores p ON op.id_proveedor = p.id_proveedor
      WHERE op.id_operacion = ?
    `;
    
    db.query(getSql, [result.insertId], (err, results) => {
      if (err || !results.length) {
        return res.json({
          success: true,
          id: result.insertId,
          message: 'Operación creada pero no se pudo recuperar los detalles'
        });
      }
      
      res.json({
        success: true,
        operacion: results[0],
        message: 'Operación creada exitosamente'
      });
    });
  });
});

// Eliminar una operación de proveedor
app.delete('/operaciones-proveedores/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM operaciones_proveedores WHERE id_operacion = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al eliminar operación:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar operación',
        details: err.message
      });
    }
    
    res.json({
      success: true,
      message: 'Operación eliminada exitosamente'
    });
  });
});


// --------------------- SECCION DEL ALMACENISTA --------------------

// Registrar un nuevo producto
app.post('/productos', (req, res) => {
  const { nombre, id_categoria, precio, stock, id_proveedor } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !id_categoria || !precio) {
    return res.status(400).json({ 
      success: false, 
      mensaje: 'Nombre, categoría y precio son obligatorios' 
    });
  }

  const nuevoProducto = {
    nombre,
    id_categoria,
    precio: parseFloat(precio),
    stock: parseInt(stock) || 0,  // Valor por defecto si no se especifica
    id_proveedor: id_proveedor || null
  };

  const sql = `
    INSERT INTO producto 
    (nombre, id_categoria, precio, stock, id_proveedor)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    nuevoProducto.nombre,
    nuevoProducto.id_categoria,
    nuevoProducto.precio,
    nuevoProducto.stock,
    nuevoProducto.id_proveedor
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar producto:', err);
      return res.status(500).json({ 
        success: false, 
        mensaje: 'Error del servidor al guardar el producto',
        error: err.message 
      });
    }

    res.status(201).json({
      success: true,
      mensaje: 'Producto registrado con éxito',
      id: result.insertId
    });
  });
});

// Obtener todos los productos con su categoría y proveedor
app.get('/productos', (req, res) => {
  const sql = `
    SELECT 
      p.id_producto,
      p.nombre,
      c.nombre AS categoria,
      p.precio,
      p.stock,  -- Aseguramos que estamos tomando 'stock'
      pr.nombre AS proveedor
    FROM producto p
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener productos:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener productos',
        error: err.message
      });
    }

    if (!resultados || resultados.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron productos',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: resultados
    });
  });
});


// ---------------------- SECCION DEL CAJERO --------------------

// Obtener todas las categorías
app.get('/categorias', (req, res) => {
  const sql = 'SELECT * FROM categorias';
  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener categorías:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener categorías',
        error: err.message
      });
    }

    if (!resultados || resultados.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron categorías',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: resultados
    });
  });
});

// Registrar una venta con sus detalles
app.post('/ventas', (req, res) => {
  const { fecha, total, items } = req.body;

  if (!fecha || !total || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Datos incompletos para la venta" });
  }

  const sqlVenta = 'INSERT INTO Ventas (fecha, total) VALUES (?, ?)';
  
  db.query(sqlVenta, [fecha, total], (err, resultadoVenta) => {
    if (err) {
      console.error('❌ Error al registrar la venta:', err);
      return res.status(500).json({ success: false, message: "Error al registrar la venta", error: err.message });
    }

    const idVenta = resultadoVenta.insertId;

    const detalles = items.map(item => [
      idVenta,
      item.id_producto,
      item.cantidad,
      item.precio_unitario,
      item.total
    ]);

    const sqlDetalle = `
      INSERT INTO Detalle_ventas 
      (id_venta, id_producto, cantidad, precio_unitario, total) 
      VALUES ?
    `;

    db.query(sqlDetalle, [detalles], (err2) => {
      if (err2) {
        console.error('❌ Error al registrar el detalle de la venta:', err2);
        return res.status(500).json({ success: false, message: "Error al registrar detalle", error: err2.message });
      }

      res.status(200).json({ success: true, message: "Venta registrada correctamente" });
    });
  });
});


// --------------------- SECCION DEL JARDINERO --------------------

// Obtener tareas pendientes asignadas a un jardinero específico
app.get('/tareas/jardinero/:idJardinero', (req, res) => {
  const { idJardinero } = req.params;
  console.log(`🔍 Solicitando tareas para jardinero ID: ${idJardinero}`);

  const sql = `
    SELECT t.*
    FROM tareas t
    JOIN usuarios_tareas ut ON ut.id_tarea = t.id_tarea
    JOIN usuarios u ON u.id_usuario = ut.id_usuario
    WHERE u.id_rol = 4 AND u.id_usuario = ? AND t.completada = 0
    ORDER BY 
      CASE t.prioridad
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baja' THEN 3
        ELSE 4
      END,
      t.fecha_limite ASC
  `;

  db.query(sql, [idJardinero], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener tareas:', err);
      return res.status(500).json({ error: 'Error al obtener tareas' });
    }
    console.log(`📋 Tareas encontradas: ${results.length}`);
    res.json({ tareas: results });
  });
});

// Marcar una tarea como completada
app.put('/tareas/:id/completar', (req, res) => {
  const { id } = req.params;
  console.log(`✅ Completando tarea ID: ${id}`);

  const sql = 'UPDATE tareas SET completada = 1, fecha_completada = NOW() WHERE id_tarea = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al completar tarea:', err);
      return res.status(500).json({ error: 'Error al completar tarea' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ success: true, message: 'Tarea completada exitosamente' });
  });
});


// -------------------- INICIAR SERVIDOR --------------------
app.listen(3001, () => {
  console.log('✅ Servidor corriendo en http://localhost:3001');
});
