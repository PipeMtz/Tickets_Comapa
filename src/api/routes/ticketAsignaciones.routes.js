import express from 'express';
import { assignTicket, getAsignacionesByTicket, updateTicketAsignacion } from '../controllers/ticketAsignaciones.controller.js';

const ticketAsigRouter = express.Router();

// Ruta para asignar un ticket a un empleado
ticketAsigRouter.post('/asignar', async (req, res) => {
  const { id_ticket, id_usuario_creador, id_usuario_asignado } = req.body;
  
  try {
    const result = await assignTicket(id_ticket, id_usuario_creador, id_usuario_asignado);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener las asignaciones de un ticket
ticketAsigRouter.get('/asignaciones/:id_ticket', async (req, res) => {
  const { id_ticket } = req.params;

  try {
    const asignaciones = await getAsignacionesByTicket(id_ticket);
    res.status(200).json({ data: asignaciones });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para actualizar la asignación de un ticket
ticketAsigRouter.put('/asignar/:id_ticket/:id_usuario_asignado', async (req, res) => {
  const { id_ticket, id_usuario_asignado } = req.params;
  const { id_usuario_creador } = req.body;

  try {
    const result = await updateTicketAsignacion(id_ticket, id_usuario_asignado, { id_usuario_creador });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default ticketAsigRouter;
