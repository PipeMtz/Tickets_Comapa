import express from 'express';
import * as ticketController from '../controllers/tickets.controller.js';

const ticketRouter = express.Router();

// Middleware para validar el token
// ticketRouter.use(ticketController.verifyToken);

// Crear un nuevo ticket
ticketRouter.post('/', async (req, res) => {
  const { descripcion, direccion, prioridad } = req.body;
  const id_usuario = req.userId; // Obtiene el id_usuario del token
  try {
    const newTicket = await ticketController.createTicket(id_usuario, descripcion, direccion, prioridad);
    res.status(201).json({ message: 'Ticket creado con éxito', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export default ticketRouter;
