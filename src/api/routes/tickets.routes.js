import express from 'express';
import * as ticketController from '../controllers/tickets.controller.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const ticketRouter = express.Router();

// Middleware para validar el token
// ticketRouter.use(ticketController.verifyToken);

// Crear un nuevo ticket
ticketRouter.post('/', async (req, res) => {
  console.log('Creando un nuevo ticket...');
  console.log('Datos recibidos:', req.body);

  const { descripcion, direccion, asunto } = req.body; // 'asunto' se espera como id_tipo
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Decodificar el token y obtener los datos del usuario
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado:', decoded);

    const id_usuario = decoded.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'ID de usuario no encontrado en el token' });
    }

    // Validar que el id_tipo (asunto) exista en la tabla tipos
    // const [rows] = await pool.execute('SELECT id_tipo FROM tipos WHERE id_tipo = ?', [asunto]);
    // if (rows.length === 0) {
    //   return res.status(400).json({ error: 'El asunto proporcionado no es válido' });
    // }

    // Crear el ticket
    const newTicket = await ticketController.createTicket(id_usuario, descripcion, direccion, asunto);
    res.status(201).json({ message: 'Ticket creado con éxito', ticket: newTicket });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});





// Obtener todos los tickets
ticketRouter.get('/', async (req, res) => {
  try {
    const tickets = await ticketController.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportar tickets a Excel
ticketRouter.post('/export', async (req, res) => {
  console.log('Cuerpo recibido en la ruta:', req.body); // Depuración
  try {
    await ticketController.exportTicketsToExcel(req, res); // Pasa `req` y `res`
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


ticketRouter.get('/filtered', async (req, res) => {
  const filters = req.query;
  try {
    const filteredTickets = await ticketController.getFilteredTickets(filters);
    res.json(filteredTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener un ticket por ID
ticketRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await ticketController.getTicketById(id); // Asegúrate de implementar esta función en el controlador
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener attachments de un ticket por ID
ticketRouter.get('/:id/attachments', async (req, res) => {
  const { id } = req.params;
  try {
    const attachments = await ticketController.getAttachmentsByTicketId(id);
    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

// Obtener tickets por usuario
ticketRouter.get('/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  console.log('ID de usuario:', id_usuario);
  try {
    const tickets = await ticketController.getTicketsByUser(id_usuario);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un ticket
ticketRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ticketController.deleteTicket(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar un ticket
ticketRouter.put('/:id_ticket', async (req, res) => {
  const { id_ticket } = req.params;
  const { prioridad, estado, id_usuario_asignado } = req.body;

  console.log('Datos recibidos:', req.body);
  try {
    const result = await ticketController.updateTicket(id_ticket, prioridad, estado, id_usuario_asignado);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al actualizar ticket:', err);
    res.status(500).json({ message: 'Error al actualizar el ticket: ' + err.message });
  }
});



export default ticketRouter;
