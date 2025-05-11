-- CREACIÓN DE TABLAS

CREATE TABLE Roles (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellidoP VARCHAR(50) NOT NULL,
  apellidoM VARCHAR(50) NOT NULL,
  usuario VARCHAR(30) NOT NULL UNIQUE,
  id_rol INT NOT NULL,
  password VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  ultimo_login DATETIME,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);

CREATE TABLE Tareas (
  id_tarea INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_limite DATE,
  completada BOOLEAN DEFAULT FALSE,
  fecha_completada DATETIME
);

CREATE TABLE usuarios_tareas (
  id_usuario INT NOT NULL,
  id_tarea INT NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario, id_tarea),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_tarea) REFERENCES Tareas(id_tarea)
);

CREATE TABLE Categorias (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

CREATE TABLE Proveedores (
  id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  factura VARCHAR(50) UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto (
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  id_categoria INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  id_proveedor INT,
  stock INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

CREATE TABLE Ventas (
  id_venta INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL,
  estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente'
);

CREATE TABLE Detalle_ventas (
  id_detalle INT PRIMARY KEY AUTO_INCREMENT,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE operaciones_proveedores (
  id_operacion INT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('compra', 'pago', 'devolucion') NOT NULL,
  id_proveedor INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL,
  descripcion VARCHAR(255),
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- INSERCIÓN DE DATOS

-- Roles
INSERT INTO Roles (nombre_rol, descripcion) VALUES
('Gerente', 'Acceso total al sistema'),
('Almacenista', 'Gestiona inventario y stock'),
('Jardinero', 'Encargado de cuidado de plantas y animales'),
('Cajero', 'Registra ventas y cobra al cliente');

-- Usuarios
INSERT INTO Usuarios (nombre, apellidoP, apellidoM, usuario, id_rol, password) VALUES
('Lucía', 'González', 'Ramírez', 'luciaG', 1, 'hash1'),
('Raúl', 'Mejía', 'Hernández', 'raulM', 2, 'hash2'),
('Sandra', 'Ortega', 'López', 'sandO', 3, 'hash3'),
('Tomás', 'Luna', 'Castillo', 'tomasL', 4, 'hash4'),
('Beatriz', 'Ramos', 'Delgado', 'beaR', 4, 'hash5');

-- Categorías
INSERT INTO Categorias (nombre, descripcion) VALUES
('Plantas', 'Todo tipo de plantas para venta'),
('Animales', 'Peces, tortugas, aves y más');

-- Proveedores
INSERT INTO Proveedores (nombre, contacto, telefono, email, factura) VALUES
('GreenGarden', 'Alfredo Ruiz', '555-1010', 'gg@proveedor.com', 'GG001'),
('BioFauna', 'Luz Contreras', '555-2020', 'biofauna@correo.com', 'BF001');

-- Productos
INSERT INTO Producto (nombre, id_categoria, precio, id_proveedor, stock) VALUES
('Helecho colgante', 1, 80.00, 1, 60),
('Orquídea morada', 1, 150.00, 1, 40),
('Cactus mini', 1, 50.00, 1, 100),
('Tortuga de agua', 2, 250.00, 2, 15),
('Pez dorado', 2, 45.00, 2, 50),
('Canario amarillo', 2, 300.00, 2, 20);

-- Tareas
INSERT INTO Tareas (titulo, descripcion, prioridad, fecha_limite) VALUES
('Riego de plantas', 'Regar todas las plantas del vivero', 'alta', '2025-04-10'),
('Limpieza de peceras', 'Cambio de agua y limpieza de peceras', 'media', '2025-04-12'),
('Inventario semanal', 'Revisión de productos en stock', 'alta', '2025-04-14'),
('Decoración de área de exhibición', 'Armar nuevas zonas de venta', 'baja', '2025-04-20'),
('Capacitación de seguridad', 'Curso obligatorio sobre protocolos', 'media', '2025-04-25');

-- Asignaciones de tareas
INSERT INTO usuarios_tareas (id_usuario, id_tarea) VALUES
(2, 3),
(3, 1),
(3, 2),
(4, 5),
(5, 4);

-- Ventas
INSERT INTO Ventas (fecha, total, estado) VALUES
('2025-04-05 10:00:00', 175.00, 'completada'),
('2025-04-06 11:00:00', 600.00, 'pendiente'),
('2025-04-06 13:00:00', 95.00, 'completada'),
('2025-04-07 15:00:00', 250.00, 'cancelada');

-- Detalle de ventas
INSERT INTO Detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, total) VALUES
(1, 1, 1, 80.00, 80.00),
(1, 3, 1, 50.00, 50.00),
(1, 5, 1, 45.00, 45.00),
(2, 4, 2, 250.00, 500.00),
(2, 2, 1, 100.00, 100.00),
(3, 3, 1, 50.00, 50.00),
(3, 5, 1, 45.00, 45.00),
(4, 6, 1, 250.00, 250.00);

-- Operaciones con proveedores
INSERT INTO operaciones_proveedores (tipo, id_proveedor, total, descripcion) VALUES
('compra', 1, 2000.00, 'Compra mensual de plantas'),
('pago', 1, 1500.00, 'Pago parcial a proveedor'),
('compra', 2, 1200.00, 'Compra de animales nuevos'),
('devolucion', 2, 300.00, 'Tortugas en mal estado devueltas');
