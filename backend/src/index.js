const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde Angular (localhost:4200)
app.use(express.json()); // Permite a Express entender JSON en req.body

// Endpoint de comprobacion de estado del servicio
app.get('/api/health', (req, res) => {
    res.json({ estado: 'activo', servicio: 'API REST Soporte Tecnico' });
});

// 1. GET /api/tickets -> Listar todos los tickets
app.get('/api/tickets', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tickets ORDER BY fechaRegistro DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener tickets:', error);
        res.status(500).json({ mensaje: 'Error al consultar tickets en la base de datos.' });
    }
});

// 2. GET /api/tickets/:id -> Obtener un ticket por ID
app.get('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Ticket no encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener ticket:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// 3. POST /api/tickets -> Crear un nuevo ticket
app.post('/api/tickets', async (req, res) => {
    const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

    // Validación básica de campos obligatorios en el backend
    if (!asunto || !solicitante || !descripcion) {
        return res.status(400).json({ mensaje: 'Asunto, solicitante y descripción son obligatorios.' });
    }

    try {
        const query = `
            INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            asunto, 
            solicitante, 
            descripcion, 
            categoria || 'Software', 
            prioridad || 'Media', 
            estado || 'Abierto'
        ];

        const [resultado] = await pool.query(query, valores);
        res.status(201).json({ 
            mensaje: 'Ticket creado exitosamente.', 
            id: resultado.insertId 
        });
    } catch (error) {
        console.error('Error al crear ticket:', error);
        res.status(500).json({ mensaje: 'Error al registrar el ticket en la base de datos.' });
    }
});

// 4. PUT /api/tickets/:id -> Actualizar un ticket existente
app.put('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

    if (!asunto || !solicitante || !descripcion) {
        return res.status(400).json({ mensaje: 'Asunto, solicitante y descripción son obligatorios.' });
    }

    try {
        const query = `
            UPDATE tickets 
            SET asunto = ?, solicitante = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ?
            WHERE id = ?
        `;
        const valores = [asunto, solicitante, descripcion, categoria, prioridad, estado, id];

        const [resultado] = await pool.query(query, valores);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Ticket no encontrado para actualizar.' });
        }

        res.json({ mensaje: 'Ticket actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar ticket:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el ticket.' });
    }
});

// 5. DELETE /api/tickets/:id -> Eliminar un ticket
app.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [resultado] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Ticket no encontrado para eliminar.' });
        }
        res.json({ mensaje: 'Ticket eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar ticket:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el ticket.' });
    }
});

app.get('/', (req, res) => {
    res.send('API de Soporte Técnico activa y conectada a MySQL');
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(` Servidor backend escuchando en http://localhost:${PORT}`);
});