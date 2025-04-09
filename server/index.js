import express from 'express';
import mysql from 'mysql';
import cors from 'cors';  // Importa cors

const app = express();

// Configuración de CORS para permitir solicitudes de tu frontend
app.use(cors({
  origin: 'http://localhost:3000',  // Dirección de tu frontend (React)
  methods: ['GET', 'POST'],        // Métodos que permites
  allowedHeaders: ['Content-Type'],  // Cabeceras permitidas
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
        username: user.username,  // Asegúrate de que el campo se llame "username"
        role: user.id_rol
      }
    });
  });
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log('✅ Servidor en http://localhost:3001');
});
