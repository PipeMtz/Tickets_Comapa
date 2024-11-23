import express from 'express';
import * as tipoController from '../controllers/tipos.controller.js';

const tipoRouter = express.Router();

// Obtener todos los tipos de la tabla Tipos
tipoRouter.get('/', async (req, res) => {
  try {
    const tipos = await tipoController.getTipos(); 
    // console.log('Tipos obtenidos:', tipos);
    res.status(200).json(tipos); // Envía la respuesta
  } catch (error) {
    console.error('Error al manejar la solicitud GET /tipos:', error);
    res.status(500).json({ message: error.message });
  }
});

export default tipoRouter;
