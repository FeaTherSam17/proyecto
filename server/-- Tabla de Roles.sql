-- Tabla de Roles
CREATE TABLE Roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255)
);

-- Tabla de Usuarios
CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellidoP VARCHAR(50) NOT NULL,
  apellidoM VARCHAR(50) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE,
  id_rol INT NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);

-- Tabla de Tareas
CREATE TABLE Tareas (
  id_tarea INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
  fecha_limite DATE,
  completada BOOLEAN DEFAULT FALSE
);

-- Tabla de relación muchos a muchos entre Usuarios y Tareas
CREATE TABLE usuarios_tareas (
  id_usuario INT NOT NULL,
  id_tarea INT NOT NULL,
  PRIMARY KEY (id_usuario, id_tarea),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_tarea) REFERENCES Tareas(id_tarea) ON DELETE CASCADE
);

-- Tabla de Proveedores
CREATE TABLE Proveedores (
  id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  factura VARCHAR(50) UNIQUE
);

-- Tabla de Categorías
CREATE TABLE Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

-- Tabla de Productos
CREATE TABLE Producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_categoria INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  id_proveedor INT,
  stock INT DEFAULT 0,
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Tabla de Ventas
CREATE TABLE Ventas (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL
);

-- Tabla de Detalle de Ventas
CREATE TABLE Detalle_ventas (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- Tabla de operaciones de proveedores
CREATE TABLE operaciones_proveedores (
  id_operacion INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('compra', 'pago', 'devolucion') NOT NULL,
  id_proveedor INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL,
  descripcion VARCHAR(255),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Roles
INSERT INTO Roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Almacenista', 'Gestión de inventario y productos'),
('Cajero', 'Gestión de ventas y cobros'),
('Jardinero', 'Gestión de tareas de jardinería');

-- Usuarios
INSERT INTO Usuarios (nombre, apellidoP, apellidoM, username, id_rol, password) VALUES
('Ana', 'García', 'López', 'admin1', 1, 'admin123'),
('Luis', 'Martínez', 'Ruiz', 'almacen1', 2, 'almacen123'),
('Sofía', 'Pérez', 'Santos', 'cajero1', 3, 'cajero123'),
('Carlos', 'Hernández', 'Vega', 'jardinero1', 4, 'jardinero123');

-- Categorías
INSERT INTO Categorias (nombre, descripcion) VALUES
('Plantas', 'Todo tipo de plantas'),
('Herramientas', 'Herramientas para jardinería');

-- Proveedores
INSERT INTO Proveedores (nombre, contacto, telefono, email, factura) VALUES
('Vivero Central', 'María Torres', '555-1234', 'vivero@central.com', 'FAC-001'),
('Herramientas MX', 'Pedro Gómez', '555-5678', 'herramientas@mx.com', 'FAC-002');

-- Productos
INSERT INTO Producto (nombre, id_categoria, precio, id_proveedor, stock) VALUES
('Rosa Roja', 1, 50.00, 1, 100),
('Pala de mano', 2, 120.00, 2, 30),
('Helecho', 1, 35.00, 1, 80),
('Tijeras de podar', 2, 90.00, 2, 25);

-- Tareas
INSERT INTO Tareas (titulo, descripcion, prioridad, fecha_limite, completada) VALUES
('Regar plantas', 'Regar todas las plantas del invernadero', 'alta', '2024-06-15', false),
('Inventariar herramientas', 'Revisar y contar todas las herramientas', 'media', '2024-06-20', false);

-- Relación usuarios_tareas
INSERT INTO usuarios_tareas (id_usuario, id_tarea) VALUES
(4, 1), -- Carlos (jardinero) riega plantas
(2, 2); -- Luis (almacenista) inventaria herramientas

-- Ventas
INSERT INTO Ventas (fecha, total) VALUES
('2024-06-10 10:30:00', 200.00),
('2024-06-11 15:45:00', 120.00);

-- Detalle_ventas
INSERT INTO Detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, total) VALUES
(1, 1, 2, 50.00, 100.00), -- 2 Rosas Rojas
(1, 3, 2, 35.00, 70.00),  -- 2 Helechos
(1, 2, 1, 30.00, 30.00),  -- 1 Pala de mano
(2, 4, 1, 90.00, 90.00),  -- 1 Tijeras de podar
(2, 3, 1, 30.00, 30.00);  -- 1 Helecho

-- Operaciones Proveedores
INSERT INTO operaciones_proveedores (tipo, id_proveedor, fecha, total, descripcion) VALUES
('compra', 1, '2024-06-09 09:00:00', 500.00, 'Compra de plantas varias'),
('pago', 2, '2024-06-12 12:00:00', 200.00, 'Pago parcial de herramientas');