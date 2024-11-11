import express from 'express';
import * as actualizacionesController from '../controllers/actualizacionesTicket.controller.js';

const actualizacionesRouter = express.Router();

// Crear una nueva actualización para un ticket
actualizacionesRouter.post('/', async (req, res) => {
  const { id_ticket, id_usuario, comentario } = req.body;
  try {
    const actualizacion = await actualizacionesController.createActualizacion(id_ticket, id_usuario, comentario);
    res.status(201).json(actualizacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener actualizaciones por ticket
actualizacionesRouter.get('/:id_ticket', async (req, res) => {
  const { id_ticket } = req.params;
  try {
    const actualizaciones = await actualizacionesController.getActualizacionesByTicket(id_ticket);
    res.json(actualizaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default actualizacionesRouter;
