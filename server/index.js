import express from 'express';
import mysql from 'mysql';
import cors from 'cors';  // Importa cors

const app = express();

// Configuración de CORS para permitir solicitudes de tu frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Asegúrate que estén PUT y DELETE
  allowedHeaders: ['Content-Type'],
}));


app.use(express.json());  // Para procesar JSON en las solicitudes

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Contraseña de MySQL
  database: 'invernadero',  // Base de datos que estás usando
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log("📥 Datos recibidos en el servidor:", req.body);  // Asegúrate de que lo que se recibe es correcto

  if (!username || !password) {
    console.log("❌ Usuario o contraseña faltan");
    return res.status(400).json({
      success: false,
      error: 'Usuario y contraseña son requeridos'
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE username = ?';  // Cambié usuario a username
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

// Ruta para obtener todos los usuarios
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


// Ruta para insertar un nuevo usuario
app.post('/usuarios', (req, res) => {
  console.log('Solicitud POST a /usuarios:', req.body);  // Verificar datos recibidos

  // Extraer los campos del body
  const { nombre, apellidoPat, apellidoMat, username, role, password } = req.body;

  // Verificar que los campos obligatorios estén presentes
  if (!nombre || !apellidoPat || !username || !password || !role) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
  }

  // Verificar que el rol sea un número válido
  const validRoles = [1, 2, 3, 4];  // Los roles válidos (Admin, Almacenista, Cajero, Jardinero)
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

    console.log('✅ Usuario insertado correctamente');
    return res.json({ success: true, message: 'Usuario creado correctamente' });
  });
});

// Actualizar un usuario

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellidoPat, apellidoMat, username, password, role } = req.body;

  console.log("🛠️ Editando usuario ID:", id, req.body);  // <-- AÑADE ESTO

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


// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al eliminar usuario' });
    }

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  });
});




// Iniciar el servidor
app.listen(3001, () => {
  console.log('✅ Servidor en http://localhost:3001');
});
