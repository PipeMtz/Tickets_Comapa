import express from 'express';
import * as asignacionesController from '../controllers/ticketAsignaciones.controller.js';

const ticketasignRouter = express.Router();

// Asignar un ticket a un empleado
ticketasignRouter.post('/', async (req, res) => {
  const { id_ticket, id_usuario } = req.body;
  try {
    const asignacion = await asignacionesController.assignTicket(id_ticket, id_usuario);
    res.status(201).json(asignacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener asignaciones por ticket
ticketasignRouter.get('/:id_ticket', async (req, res) => {
  const { id_ticket } = req.params;
  try {
    const asignaciones = await asignacionesController.getAsignacionesByTicket(id_ticket);
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default ticketasignRouter;
