-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS soporte_tickets_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Usar la base de datos
USE soporte_tickets_db;

-- 3. Crear la tabla tickets
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asunto VARCHAR(150) NOT NULL,
    solicitante VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM('Hardware', 'Software', 'Redes', 'Accesos', 'Otro') NOT NULL DEFAULT 'Software',
    prioridad ENUM('Baja', 'Media', 'Alta', 'Critica') NOT NULL DEFAULT 'Media',
    estado ENUM('Abierto', 'En Progreso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Abierto',
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insertar datos de prueba iniciales
INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado) 
VALUES 
('Impresora no responde en piso 2', 'Ana Morales', 'La impresora multifuncional no recibe trabajos de impresión vía red.', 'Hardware', 'Alta', 'Abierto'),
('Error de licencia en Office', 'Pedro Soto', 'Aparece aviso de suscripción caducada al abrir Excel y Word.', 'Software', 'Media', 'En Progreso'),
('Caída de conexión en sala de reuniones', 'Beatriz Lagos', 'El punto de acceso WiFi pierde señal intermitentemente.', 'Redes', 'Critica', 'Abierto');